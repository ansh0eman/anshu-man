# Portfolio revamp — execution plan

Planning document only. No site code, production configuration, or published content is changed by this file. The proposed words live in [portfolio-revamp-copy-draft.md](./portfolio-revamp-copy-draft.md); keep that as the content review source until implementation begins.

## 1. Agreed direction

- Evolve the existing portfolio rather than replace its identity: `ansh0eman` wordmark, monospace, stone backgrounds, rust/orange accent, dark/light mode, conversational writing, music references, and the newly refreshed Projects page.
- Home order: short introduction → work → three selected projects → latest note → contact.
- Work is a section on Home, not a route or a primary navigation item. Keep the current About / Projects / Resume / Notes labels and existing URLs.
- Home projects: Aegis AI, SetuAI, and the Ben 10-inspired LEDA OS Watch prototype. The anomaly engine stays on Projects, outside the Home trio.
- About holds the longer personal story, including books, music, film, and philosophy. Home only names those interests. Save the `0 > 1` and *Twin Fantasy* tattoo stories and playlist for a later post.
- No new Contact page, Experience page, tattoo article, or broad rewrite of existing personal posts in this pass.

## 2. Current baseline and boundaries

- Current checkout is `codex/latest-posts-live` at `3f48d16b` (`Refresh Radiohead-inspired projects jukebox`). It tracks `origin/codex/latest-posts-live`; the production deployment branch has not been verified.
- The checkout already has unrelated modified/generated files and untracked visual assets. Do not reset, clean, or broadly stage it. At implementation time, start an isolated `leda/portfolio-revamp` branch/worktree from the approved Projects-page commit, then bring in only chosen assets and copy.
- Astro 5 site, Tailwind 3, static output, React island for `ProjectJukebox`, Netlify build command `npm run build`, and a Netlify rule mapping `setuai.ansh0eman.in/` to `/projects/setuai/`. Keep the existing rule and canonical URL.
- The public résumé currently lists Impact Analytics, YES BANK, and Alethe Labs. Its roles/dates are source material for a draft, not confirmation of what may be disclosed on the site.
- The untracked `watchos-omnitrix.png` is a candidate LEDA image. `cli-agent-transcript.png` depicts the separate terminal LEDA coding agent; do not present it as the Watch project. Original alien imagery and sounds are documented as third-party material, so choose public imagery deliberately.

## 3. Page-by-page implementation

| Surface | Content and behavior | Primary files |
| --- | --- | --- |
| Home opening | Replace stale age/student biography with the approved two-sentence introduction and one compact interests line. Keep both Work and Projects reachable from the opening. Hero should fit a small laptop without forcing a long scroll before Work. | `src/pages/index.astro`, `src/components/Hero.astro` (rewrite or replace) |
| Home Work | Add `id="work"` section above projects. Three entries in current-to-earlier order: Impact Analytics, YES BANK, Alethe Labs. Show company, role, date, concise contribution; link to the existing résumé. Use the supplied screenshot for its simple vertical rhythm, not its companies or copy. Company marks only if their source/use is clear; text treatment is the fallback. | `src/pages/index.astro`, new small `src/components/Work.astro` if useful |
| Home projects | Show Aegis AI, SetuAI, LEDA OS, each with one clear promise, one real visual, and an explicit destination. Link to matching Projects selection or SetuAI story; verify direct hash navigation. Use static Astro markup; no new client bundle for the Home list. | `src/pages/index.astro`, new small `src/components/FeaturedProjects.astro` if useful, project data source |
| Home notes/contact | Show one latest published note by date, then a plain contact invitation and email link. Keep the Spotify Now Playing element only if it supports the new hierarchy and reports unavailable states truthfully. | `src/components/LatestPosts.astro`, `src/components/NowPlaying.astro`, `src/pages/index.astro` |
| About | Replace undergraduate/old-role copy with the approved longer story. Distinct sections: work curiosity, personal interests, contact. Keep the photo only after choosing the right current image and writing a real alt description. Philosophy should sound like an interest, not a claim of expertise. | `src/pages/about/index.astro` |
| Projects index | Preserve the new jukebox and current visual language. Add LEDA OS as a selected project with truthful prototype status and appropriate Watch imagery. Keep Aegis, NearHere, Fractal Resonance, SetuAI, and anomaly engine; review descriptions/links and individual contribution language. | `src/components/ProjectJukebox.tsx`, `src/pages/projects/index.astro`, approved `public/assets/projects/leda/*` |
| SetuAI story | Keep route, hostname mapping, and page structure. Review award/outcome wording, teamwork attribution, source links, and image captions; change only unsupported or unclear text. | `src/pages/projects/setuai.astro` |
| Notes index | Add the approved short introduction, improve list readability, keep newest-first order, dates, tags, RSS, and existing post URLs. Align cards with the evolved visual system without making every page a copy of Projects. | `src/pages/posts/index.astro`, `src/components/Card.astro`, optionally `src/components/Heading.astro` |
| Existing notes | Keep the surname and OpenClaw stories and the `Cogito` poem intact in substance. Fix broken formatting, repeated explanation in the neural-style-transfer post, stale metadata, image descriptions, and line length. Present each post's proposed editorial diff for review before shipping. | `src/pages/posts/*.md`, `src/layouts/post.astro`, `src/components/PostHeader.astro`, `src/components/PostContent.astro` |
| Shared shell | Keep wordmark and primary navigation. Rework footer links/text; update per-page titles, descriptions, canonical/OG metadata as needed. Keep dark/light mode and existing `setuai` subdomain behavior. | `src/components/Navbar.astro`, `src/components/Footer.astro`, `src/layouts/Base.astro`, `src/utils/AppConfig.ts` |
| Tags, RSS, résumé, imprint | Keep routes working. Improve tag page headings/metadata if the notes redesign changes their presentation; avoid new categories without actual posts. Verify current résumé PDF. Review imprint accuracy and personal-address exposure with the user before editing legal text. | `src/pages/tags/*`, `src/pages/rss.xml.js`, `public/resume/resume.pdf`, `src/pages/imprint.astro` |

If Home and Projects need the same project description/link data, extract the existing `projects` array into one small `src/data/projects.ts` module and import it from Astro and React. Do this only if it reduces duplication without destabilizing the new jukebox.

## 4. Visual rules for implementation

- Match the Projects page's restrained editorial feel: confident headings, fine separators, real project media, generous but controlled spacing, rust/orange accents, and mono typography.
- Use different composition on each surface: compact Home opening, vertical Work rows, visual project features, a readable About essay, and a calm Notes archive. Do not repeat the record-player motif everywhere.
- Work rows: date/role hierarchy must be legible without opening the résumé; logos must not become larger than the work. On mobile, stack date/company/copy in reading order.
- Use real, attributed images already selected or approved. Avoid using the terminal-agent screenshot for LEDA OS and avoid publishing third-party character renders or sound files merely because the prototype contains them.
- Keep copy lines readable, headings semantic, keyboard focus visible, image alt text specific, and motion optional under reduced-motion settings. Preserve both light and dark mode.
- No new design library or animation dependency is planned. Astro/Tailwind/native CSS can express this redesign.

## 5. Factual and editorial gates

Resolve before a public preview or push:

1. Confirm the current Impact Analytics title/start date, the three Work descriptions, and what employer/client information may be shown.
2. Confirm graduation phrasing and the preferred About photo.
3. Confirm public name `LEDA OS`, repository/destination, Watch screenshot provenance, and whether a clear prototype label is enough. Source supports Watch UI, Crown selection, local bridge, and audio-flow code; it does not establish physical-device reliability.
4. Resolve NearHere's site-versus-résumé stack mismatch and its public link/visibility before changing that entry.
5. Check SetuAI outcome/award wording and individual-versus-team attribution. Do not turn a reported metric into an independently verified result.
6. Verify image credits, linked repositories, current PDF résumé, contact address, imprint wording, and metadata.

If one claim remains unresolved, omit or soften that claim in the first release rather than blocking the entire redesign.

## 6. Execution sequence and review points

1. **Lock copy:** incorporate user edits in the copy draft, mark approved text, and list factual items still pending. Do not start styling a page around unsettled claims.
2. **Prepare isolated source:** branch/worktree from the approved Projects commit; copy only the approved draft and assets. Record a path allowlist. Leave generated `.astro`, `node_modules`, `.DS_Store`, media experiments, and unrelated design-reference files untouched.
3. **Build shared page rhythm:** establish reusable spacing/type/accent rules in the existing stack and update the header/footer only where needed. Preserve current nav labels, wordmark, and routes.
4. **Implement Home:** opening, Work, selected projects, notes, contact. Review the desktop and phone layouts with the user before rolling the same visual language through other pages.
5. **Implement About and Projects content:** new About copy/photo; LEDA OS entry and approved image; light wording pass on other projects and SetuAI.
6. **Implement Notes and metadata:** index/cards first, then targeted post formatting and descriptions; review changed article text separately. Update page titles, descriptions, canonical/OG tags, and tag pages without moving URLs.
7. **Validate locally:** run the repository build, inspect generated routes, and review Home/About/Projects/Notes on desktop and phone in both themes. Check keyboard navigation, reduced motion, image loading, internal/external links, `/#work`, project deep links, RSS, résumé, and the SetuAI route. Fix only issues found.
8. **Prepare publication:** present the final changed-file list, screenshots, content/claim diff, and any unresolved limitations. Stage only approved paths and commit on the feature branch. Confirm which Netlify branch actually deploys before pushing or merging. After the user approves publication, push the approved commit and check the resulting deployment and both `ansh0eman.in` and `setuai.ansh0eman.in`.

## 7. Completion criteria

- Home clearly says what Anshuman does in a few lines, shows Work before Projects, features Aegis AI / SetuAI / LEDA OS, and reaches contact without a maze of CTAs.
- About carries the detailed books/philosophy/music story without publishing the tattoo essay early.
- Experience is visible on Home and nowhere requires a separate route.
- The new Projects layout remains recognizably intact; LEDA OS is distinguished from the separate terminal agent and labelled as a prototype.
- Notes retain their original voices and URLs, while index, metadata, and broken formatting improve.
- Light/dark, mobile/desktop, keyboard use, existing résumé/RSS links, and SetuAI subdomain behavior remain sound.
- The final Git change set contains only approved portfolio work; the pre-existing dirty files are preserved.
