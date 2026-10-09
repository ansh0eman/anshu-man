import { useEffect, useState } from 'react';

type Slide = {
	src: string;
	alt: string;
	caption: string;
	width: number;
	height: number;
};

type Project = {
	id: string;
	name: string;
	shortDescription: string;
	technologies: string[];
	facts: { label: string; text: string }[];
	links: { label: string; href: string }[];
	cover: string;
	coverAlt: string;
	coverPosition?: string;
	media: Slide[];
};

const projects: Project[] = [
	{
		id: 'nearhere', name: 'NearHere', shortDescription: 'A map-first way to find your people nearby.',
		technologies: ['Expo', 'React Native', 'Supabase', 'Maps'],
		facts: [
			{ label: 'Product', text: 'Discover nearby activities and make small-group plans.' },
			{ label: 'Privacy', text: 'Area-based discovery keeps location disclosure an explicit product decision.' },
			{ label: 'Flow', text: 'Open an activity, review its details, and RSVP in one path.' }
		],
		links: [{ label: 'GitHub', href: 'https://github.com/ansh0eman/NearHere' }],
		cover: '/assets/projects/nearhere/nearhere-project-overview.png', coverAlt: 'NearHere concept artwork visualizing nearby map and profile screens',
		media: [
			{ src: '/assets/projects/nearhere/nearhere-project-overview.png', alt: 'Concept artwork visualizing a map-first nearby activity feed and profile for NearHere', caption: 'Product concept direction', width: 1536, height: 1024 },
			{ src: '/assets/projects/nearhere/selected-place.png', alt: 'NearHere iOS Simulator showing a selected activity on the map', caption: 'Selected activity on the map', width: 1206, height: 2622 },
			{ src: '/assets/projects/nearhere/browse-map.png', alt: 'NearHere iOS Simulator browse map with nearby activities', caption: 'Browse nearby activities', width: 1206, height: 2622 },
			{ src: '/assets/projects/nearhere/profile-details.png', alt: 'NearHere profile details screen in iOS Simulator', caption: 'Profile and activity details', width: 1206, height: 2622 }
		]
	},
	{
		id: 'aegis-ai', name: 'Aegis AI', shortDescription: 'An enterprise AI workspace with practical access and usage controls.',
		technologies: ['Next.js', 'TypeScript', 'SQLite', 'Drizzle ORM'],
		facts: [
			{ label: 'Workspace', text: 'Authenticated users can stream chat responses and return to saved conversations.' },
			{ label: 'Governance', text: 'Admin controls support member provisioning, account status, and per-user AI policies.' },
			{ label: 'Integrity', text: 'SQLite-backed usage limits and audit events keep key account changes traceable.' }
		],
		links: [{ label: 'GitHub', href: 'https://github.com/ansh0eman/aegis-ai' }],
		cover: '/assets/projects/aegis-ai/admin-users.png', coverAlt: 'Aegis AI admin console for member provisioning and governance',
		media: [
			{ src: '/assets/projects/aegis-ai/admin-users.png', alt: 'Aegis AI admin interface for member provisioning and AI policy controls', caption: 'Admin and governance controls', width: 1440, height: 900 },
			{ src: '/assets/projects/aegis-ai/workspace.png', alt: 'Authenticated Aegis AI workspace empty state', caption: 'Authenticated workspace', width: 1440, height: 900 }
		]
	},
	{
		id: 'fractal-resonance', name: 'Fractal Resonance', shortDescription: 'A visual instrument for exploring sound through fractals.',
		technologies: ['WebGL', 'JavaScript', 'Audio'],
		facts: [
			{ label: 'Input', text: 'Map musical input into visual parameters.' },
			{ label: 'Canvas', text: 'Explore fractal forms through a browser-based generator.' },
			{ label: 'Output', text: 'Generate exportable visuals, including tree and set patterns.' }
		],
		links: [{ label: 'GitHub', href: 'https://github.com/ansh0eman/music-fractal' }],
		cover: '/assets/projects/fractal-resonance/generator-interface.png', coverAlt: 'Fractal Resonance generator interface used as a project cover',
		media: [
			{ src: '/assets/projects/fractal-resonance/generator-interface.png', alt: 'Fractal Resonance generator interface captured from the running project', caption: 'Generator interface', width: 1440, height: 900 },
			{ src: '/assets/projects/fractal-resonance/output-neon-tree.png', alt: 'Fractal Resonance neon tree output', caption: 'Neon tree', width: 1024, height: 1024 },
			{ src: '/assets/projects/fractal-resonance/output-mandelbrot.png', alt: 'Fractal Resonance Mandelbrot output', caption: 'Mandelbrot', width: 1024, height: 1024 },
			{ src: '/assets/projects/fractal-resonance/output-sierpinski.png', alt: 'Fractal Resonance Sierpinski output', caption: 'Sierpinski pattern', width: 1024, height: 1024 }
		]
	},
	{
		id: 'setuai', name: 'SetuAI', shortDescription: 'Making supplier compliance easier to see and act on.',
		technologies: ['React', 'Node.js', 'PostgreSQL', 'Gemini OCR'],
		facts: [
			{ label: 'Intake', text: 'OCR-assisted document extraction supports vendor onboarding.' },
			{ label: 'Review', text: 'External checks, risk scoring, and role-based review support buyer workflows.' },
			{ label: 'Outcome', text: 'The team reported 70% faster vendor onboarding; SetuAI received a SAP Hackfest 2025 Special Award.' }
		],
		links: [
			{ label: 'Project story', href: 'https://setuai.ansh0eman.in/' },
			{ label: 'GitHub', href: 'https://github.com/ansh0eman/SetuAI' }
		],
		cover: '/assets/projects/setuai/buyer-marketplace.png', coverAlt: 'SetuAI buyer marketplace used as a project cover',
		media: [
			{ src: '/assets/projects/setuai/buyer-marketplace.png', alt: 'SetuAI buyer marketplace listing textile suppliers and compliance states', caption: 'Buyer marketplace', width: 1440, height: 900 },
			{ src: '/assets/projects/setuai/vendor-dashboard.png', alt: 'SetuAI vendor dashboard showing submitted compliance documents and review statuses', caption: 'Vendor dashboard', width: 1440, height: 900 },
			{ src: '/assets/projects/setuai/vendor-compliance-detail.png', alt: 'SetuAI vendor compliance detail view with document verification states', caption: 'Document verification detail', width: 1440, height: 900 },
			{ src: '/assets/projects/setuai/compliance-reports.png', alt: 'SetuAI compliance reports screen', caption: 'Compliance reports', width: 1440, height: 900 },
			{ src: '/assets/projects/setuai/marketplace.png', alt: 'SetuAI vendor marketplace screen', caption: 'Vendor marketplace', width: 1440, height: 900 }
		]
	},
	{
		id: 'leda-os', name: 'LEDA OS', shortDescription: 'An Omnitrix-inspired voice prototype for Apple Watch.',
		technologies: ['watchOS', 'SwiftUI', 'Digital Crown', 'Local voice bridge'],
		facts: [
			{ label: 'Interaction', text: 'Tap the dial and turn the Digital Crown to select an alien-inspired mode.' },
			{ label: 'Feedback', text: 'Sound and haptics give the selection flow its watch-like feel.' },
			{ label: 'Status', text: 'A local real-time voice bridge connects the prototype; physical-device reliability is still to be validated.' }
		],
		links: [{ label: 'GitHub', href: 'https://github.com/ansh0eman/ledaWatchOS' }],
		cover: '/assets/projects/leda/watchos-omnitrix.png', coverAlt: 'LEDA OS Omnitrix-inspired watchOS prototype interface',
		media: [
			{ src: '/assets/projects/leda/watchos-omnitrix.png', alt: 'Green Omnitrix-inspired interface from the LEDA OS watchOS prototype', caption: 'Prototype watch interface', width: 400, height: 400 }
		]
	},
	{
		id: 'anomaly-engine', name: 'Real-Time Anomaly Engine', shortDescription: 'A streaming pipeline for spotting unusual events.',
		technologies: ['FastAPI', 'Redis Streams', 'PostgreSQL', 'WebSockets'],
		facts: [
			{ label: 'Ingestion', text: 'FastAPI validates incoming metric events.' },
			{ label: 'Scoring', text: 'A z-score cold start and Isolation Forest detect unusual values.' },
			{ label: 'Delivery', text: 'Redis Streams moves events through async processing; flagged events are persisted and streamed as alerts.' }
		],
		links: [{ label: 'GitHub', href: 'https://github.com/ansh0eman/real-time-anomaly-engine' }],
		cover: '/assets/projects/real-time-anomaly-engine/api-ingestion-schema.png', coverAlt: 'Anomaly engine metric-ingestion schema used as a project cover',
		media: [
			{ src: '/assets/projects/real-time-anomaly-engine/api-ingestion-schema.png', alt: 'FastAPI OpenAPI page showing the anomaly engine metric-ingestion schema', caption: 'Metric ingestion API schema', width: 1440, height: 900 }
		]
	}
];

function ProjectCarousel({ project }: { project: Project }) {
	const [slideIndex, setSlideIndex] = useState(0);
	const slide = project.media[slideIndex]!;
	const slideCount = project.media.length;
	const move = (direction: -1 | 1) => setSlideIndex((index) => (index + direction + slideCount) % slideCount);
	const isPortrait = slide.height > slide.width;
	const isSquare = slide.height === slide.width;

	return (
		<section className="project-gallery" aria-label={`${project.name} screenshots`}>
			<div className="gallery-copy">
				<p className="gallery-kicker">Screens / {String(slideIndex + 1).padStart(2, '0')} of {String(slideCount).padStart(2, '0')}</p>
				<h3>{slide.caption}</h3>
				<p>{slide.alt}</p>
				{slideCount > 1 && (
					<div className="gallery-controls">
						<button type="button" className="gallery-arrow" onClick={() => move(-1)} aria-label={`Previous ${project.name} screenshot`}>← Previous</button>
						<button type="button" className="gallery-arrow" onClick={() => move(1)} aria-label={`Next ${project.name} screenshot`}>Next →</button>
					</div>
				)}
				{slideCount > 1 && <div className="gallery-thumbnails" role="group" aria-label={`${project.name} screenshots`}>
					{project.media.map((item, index) => <button type="button" key={item.src} className={`gallery-thumb${index === slideIndex ? ' is-current' : ''}`} onClick={() => setSlideIndex(index)} aria-label={`Show ${item.caption}`} aria-current={index === slideIndex ? 'true' : undefined}>
						<img src={item.src} alt="" loading="lazy" />
					</button>)}
				</div>}
			</div>
			<div className={`gallery-stage${isPortrait ? ' is-portrait' : isSquare ? ' is-square' : ' is-landscape'}`}>
				<a href={slide.src} target="_blank" rel="noreferrer" className="gallery-image-link" aria-label={`Open full size image: ${slide.caption}`}>
					<img src={slide.src} alt={slide.alt} width={slide.width} height={slide.height} loading="lazy" />
				</a>
			</div>
		</section>
	);
}

export default function ProjectJukebox() {
	const [activeId, setActiveId] = useState('nearhere');
	const activeIndex = Math.max(0, projects.findIndex((project) => project.id === activeId));
	const active = projects[activeIndex]!;

	useEffect(() => {
		const fromHash = () => {
			const requested = window.location.hash.slice(1);
			if (projects.some((project) => project.id === requested)) setActiveId(requested);
		};
		fromHash();
		window.addEventListener('hashchange', fromHash);
		return () => window.removeEventListener('hashchange', fromHash);
	}, []);

	const chooseProject = (project: Project) => {
		setActiveId(project.id);
		window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${project.id}`);
	};
	const moveProject = (direction: -1 | 1) => chooseProject(projects[(activeIndex + direction + projects.length) % projects.length]!);

	return (
		<div className="jukebox" id={active.id} aria-label="Project jukebox">
			<section className="jukebox-stage" aria-label="Featured projects">
				<div className="project-feature">
					<figure className="project-media">
						<div className="project-cover"><img src={active.cover} alt={active.coverAlt} style={{ objectPosition: active.coverPosition ?? 'center' }} /></div>
						<figcaption><span>{active.name} / selected frame</span><span>{String(activeIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span></figcaption>
					</figure>
					<div className="feature-copy">
						<p className="eyebrow">Now in the listening room</p>
						<h2>{active.name}</h2>
						<p className="feature-line">{active.shortDescription}</p>
						<p className="project-stack">{active.technologies.join('  /  ')}</p>
						<nav className="project-links" aria-label={`${active.name} links`}>
							{active.links.map((link) => <a href={link.href} target="_blank" rel="noreferrer" key={link.href}>{link.label} ↗</a>)}
						</nav>
					</div>
				</div>
				<aside className="record-rack" aria-label="Choose a featured project">
					<div className="rack-heading"><span>Choose a side</span><span>{String(activeIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span></div>
					<div className="record-list" onKeyDown={(event) => {
						if (event.key === 'ArrowLeft') { event.preventDefault(); moveProject(-1); }
						if (event.key === 'ArrowRight') { event.preventDefault(); moveProject(1); }
					}}>
						{projects.map((project, index) => <div className={`record-choice${project.id === active.id ? ' is-active' : ''}`} key={project.id}>
							<button type="button" className="record-select" onClick={() => chooseProject(project)} aria-pressed={project.id === active.id}>
								<span className="record-disc"><img src={project.cover} alt="" loading="lazy" /><span className="record-center">{String(index + 1).padStart(2, '0')}</span></span>
								<span className="record-label"><strong>{project.name}</strong><small>{project.technologies.slice(0, 2).join(' / ')}</small></span>
							</button>
							{project.links[0] && <a className="record-arrow" href={project.links[0].href} target="_blank" rel="noreferrer" aria-label={`Open ${project.name}: ${project.links[0].label}`} title={`Open ${project.name}: ${project.links[0].label}`}>↗</a>}
						</div>)}
					</div>
					<p className="rack-note">Use the arrow keys or select a record to change the project.</p>
				</aside>
			</section>

			<section className="project-detail" aria-live="polite">
				<header className="detail-heading"><p className="eyebrow">Listening notes / {String(activeIndex + 1).padStart(2, '0')}</p><h3>Inside {active.name}</h3></header>
				<div className="detail-facts">{active.facts.map((fact) => <article key={fact.label}><h4>{fact.label}</h4><p>{fact.text}</p></article>)}</div>
			</section>
			<ProjectCarousel key={active.id} project={active} />
		</div>
	);
}
