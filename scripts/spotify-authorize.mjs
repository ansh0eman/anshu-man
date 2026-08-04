import { randomBytes, timingSafeEqual } from 'node:crypto';
import { chmod, lstat, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';

const HOST = '127.0.0.1';
const PORT = 4321;
const CALLBACK_PATH = '/spotify/callback';
const REDIRECT_URI = `http://${HOST}:${PORT}${CALLBACK_PATH}`;
const REQUIRED_SCOPE = 'user-read-currently-playing';
const AUTHORIZATION_TIMEOUT_MS = 5 * 60 * 1_000;
const LOCAL_ENV_PATH = fileURLToPath(new URL('../.env.spotify.local', import.meta.url));

function parseEnvironmentFile(contents) {
	const values = new Map();

	for (const rawLine of contents.split(/\r?\n/u)) {
		const line = rawLine.trim();
		if (!line || line.startsWith('#')) continue;

		const separator = line.indexOf('=');
		if (separator < 1) continue;

		const key = line.slice(0, separator).trim();
		let value = line.slice(separator + 1).trim();

		if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			value = value.slice(1, -1);
		}

		values.set(key, value);
	}

	return values;
}

async function loadLocalConfiguration() {
	let stats;
	let contents;

	try {
		stats = await lstat(LOCAL_ENV_PATH);
		if (!stats.isFile() || stats.isSymbolicLink()) {
			throw new Error('.env.spotify.local must be a regular file, not a symbolic link.');
		}
		await chmod(LOCAL_ENV_PATH, 0o600);
		contents = await readFile(LOCAL_ENV_PATH, 'utf8');
	} catch (error) {
		if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
			throw new Error(
				'Create the ignored .env.spotify.local file with SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET first.'
			);
		}
		throw error;
	}

	const values = parseEnvironmentFile(contents);
	const clientId = values.get('SPOTIFY_CLIENT_ID')?.trim();
	const clientSecret = values.get('SPOTIFY_CLIENT_SECRET')?.trim();
	const existingRefreshToken = values.get('SPOTIFY_REFRESH_TOKEN')?.trim();

	if (!clientId || !clientSecret) {
		throw new Error(
			'.env.spotify.local must contain nonempty SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET values.'
		);
	}

	if (existingRefreshToken) {
		throw new Error(
			'.env.spotify.local already contains SPOTIFY_REFRESH_TOKEN; remove it explicitly before reauthorizing.'
		);
	}

	return { clientId, clientSecret, contents };
}

function statesMatch(expected, received) {
	if (typeof received !== 'string') return false;

	const expectedBuffer = Buffer.from(expected, 'utf8');
	const receivedBuffer = Buffer.from(received, 'utf8');
	return (
		expectedBuffer.length === receivedBuffer.length &&
		timingSafeEqual(expectedBuffer, receivedBuffer)
	);
}

function sendText(response, statusCode, message) {
	response.writeHead(statusCode, {
		'Cache-Control': 'no-store',
		'Content-Type': 'text/plain; charset=utf-8',
		'X-Content-Type-Options': 'nosniff'
	});
	response.end(message);
}

async function exchangeAuthorizationCode({ clientId, clientSecret, code }) {
	let response;

	try {
		response = await fetch('https://accounts.spotify.com/api/token', {
			method: 'POST',
			headers: {
				Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				code,
				grant_type: 'authorization_code',
				redirect_uri: REDIRECT_URI
			})
		});
	} catch {
		throw new Error('Could not reach Spotify to exchange the authorization code.');
	}

	if (!response.ok) {
		throw new Error(`Spotify rejected the authorization-code exchange (HTTP ${response.status}).`);
	}

	let payload;
	try {
		payload = await response.json();
	} catch {
		throw new Error('Spotify returned an unreadable token response.');
	}

	const refreshToken =
		typeof payload.refresh_token === 'string' ? payload.refresh_token.trim() : '';
	const grantedScopes =
		typeof payload.scope === 'string'
			? new Set(payload.scope.split(/\s+/u).filter(Boolean))
			: new Set();

	if (!refreshToken || /[\r\n]/u.test(refreshToken)) {
		throw new Error('Spotify did not return a usable refresh token.');
	}

	if (!grantedScopes.has(REQUIRED_SCOPE)) {
		throw new Error(`Spotify did not grant the required ${REQUIRED_SCOPE} scope.`);
	}

	return refreshToken;
}

async function storeRefreshToken(originalContents, refreshToken) {
	const temporaryPath = `${LOCAL_ENV_PATH}.${process.pid}.${randomBytes(8).toString('hex')}.tmp`;
	const updatedContents = `${originalContents.trimEnd()}\nSPOTIFY_REFRESH_TOKEN=${refreshToken}\n`;

	try {
		await writeFile(temporaryPath, updatedContents, {
			encoding: 'utf8',
			flag: 'wx',
			mode: 0o600
		});
		await rename(temporaryPath, LOCAL_ENV_PATH);
		await chmod(LOCAL_ENV_PATH, 0o600);
	} finally {
		await unlink(temporaryPath).catch(() => undefined);
	}
}

async function authorizeOwner(configuration) {
	const state = randomBytes(32).toString('hex');
	const authorizationUrl = new URL('https://accounts.spotify.com/authorize');
	authorizationUrl.search = new URLSearchParams({
		client_id: configuration.clientId,
		redirect_uri: REDIRECT_URI,
		response_type: 'code',
		scope: REQUIRED_SCOPE,
		state
	}).toString();

	await new Promise((resolve, reject) => {
		let callbackClaimed = false;
		let settled = false;
		let timeout;

		const server = createServer(async (request, response) => {
			const requestUrl = new URL(request.url ?? '/', REDIRECT_URI);

			if (requestUrl.pathname !== CALLBACK_PATH) {
				sendText(response, 404, 'Not found.');
				return;
			}

			if (request.method !== 'GET') {
				response.setHeader('Allow', 'GET');
				sendText(response, 405, 'Method not allowed.');
				return;
			}

			if (callbackClaimed) {
				sendText(response, 409, 'This authorization callback has already been used.');
				return;
			}
			callbackClaimed = true;

			try {
				if (requestUrl.searchParams.has('error')) {
					throw new Error('Spotify authorization was declined or failed.');
				}

				if (!statesMatch(state, requestUrl.searchParams.get('state'))) {
					throw new Error('Spotify authorization returned an invalid state value.');
				}

				const code = requestUrl.searchParams.get('code');
				if (!code) throw new Error('Spotify authorization returned no authorization code.');

				const refreshToken = await exchangeAuthorizationCode({
					clientId: configuration.clientId,
					clientSecret: configuration.clientSecret,
					code
				});
				await storeRefreshToken(configuration.contents, refreshToken);

				sendText(
					response,
					200,
					'Spotify authorization completed. The refresh token was saved locally; return to the terminal.'
				);
				finish();
			} catch (error) {
				sendText(
					response,
					400,
					'Spotify authorization could not be completed. Return to the terminal.'
				);
				finish(error instanceof Error ? error : new Error('Spotify authorization failed.'));
			}
		});

		function finish(error) {
			if (settled) return;
			settled = true;
			if (timeout) clearTimeout(timeout);

			const settlePromise = () => {
				if (error) reject(error);
				else resolve();
			};

			if (server.listening) server.close(settlePromise);
			else settlePromise();
		}

		server.once('error', () => {
			finish(new Error(`Could not start the local callback server on ${REDIRECT_URI}.`));
		});

		server.listen(PORT, HOST, () => {
			timeout = setTimeout(() => {
				finish(new Error('Spotify authorization timed out after five minutes.'));
			}, AUTHORIZATION_TIMEOUT_MS);

			console.log(
				`Open this URL in your browser to authorize the portfolio owner:\n${authorizationUrl}`
			);
			console.log(`Waiting for the one-time callback at ${REDIRECT_URI} (five-minute timeout).`);
		});
	});
}

try {
	const configuration = await loadLocalConfiguration();
	await authorizeOwner(configuration);
	console.log('Refresh token saved to .env.spotify.local. No token value was printed.');
} catch (error) {
	console.error(error instanceof Error ? error.message : 'Spotify authorization setup failed.');
	process.exitCode = 1;
}
