# Projects Jukebox Redesign Plan

## Design read

Developer portfolio for recruiters, collaborators, and curious technical readers. Preserve the informal Radiohead and Thom Yorke identity, then replace the long text archive with a tactile, image-led jukebox selector.

- Redesign mode: preserve
- Design variance: 8/10
- Motion intensity: 6/10
- Visual density: 4/10
- Foundation: Astro, Tailwind 3, a small React client island, native CSS transitions
- No new animation dependency is required

## Approval references

- `desktop-light-jukebox.png`: first viewport in light mode
- `desktop-dark-jukebox.png`: first viewport in dark mode
- `mobile-light-jukebox.png`: mobile selector and active project
- `desktop-project-detail.png`: expanded project detail, experiments shelf, and footer rhythm

The references define composition, hierarchy, texture, and interaction. Generated copy and generated project artwork are not factual sources. Final implementation must use verified project descriptions and real screenshots.

### Known reference correction

The generated detail reference describes Aegis AI incorrectly. The final copy will describe an enterprise AI workspace with streaming chat, authentication, role controls, policy enforcement, and auditability.

## Content hierarchy

### Featured projects

These projects appear inside the jukebox and are visible in the first viewport:

1. LEDA
   - Umbrella project covering the local terminal coding agent and watchOS voice assistant
   - Links: coding-agent repository and watchOS repository
2. NearHere
   - Map-first native product for discovering and joining nearby activities
   - Link: public repository
3. Real-Time Anomaly Engine
   - Event-driven FastAPI, Redis Streams, PostgreSQL, WebSocket, and anomaly-detection system
   - Link: public repository
4. SetuAI
   - Vendor-compliance workflow with OCR-assisted document verification and role-based review
   - Link: public repository
5. Fractal Resonance
   - Music analysis mapped to interactive WebGL fractals and exportable generative visuals
   - Link: public repository

### Other experiments

These appear in a compact shelf below the active-project detail:

- Neural Style Transfer
- ImageFX
- Aegis AI
- Fractal Nature of Lyrical Verses

### Explicit exclusions

- Property Management System: removed from the Projects page
- QR AI Chat: excluded because the existing repository is a fork of somebody else's work

## Page structure

### Navigation

Keep the current primary navigation labels and route unchanged. Projects remains highlighted using the existing accent color.

### Radiohead artwork strip

- Preserve the current Kid A panorama as a shallow strip directly beneath navigation
- Target height: 120-160 px desktop, 96-128 px mobile
- Use a deliberate crop rather than displaying the full original ratio
- Reserve image dimensions to prevent layout shift
- Do not place text over the artwork

### First viewport jukebox

Desktop uses a 62/38 split:

- Left: active project media, title, one short description, technologies, and verified links
- Right: five-disc jukebox rack with partially overlapping project discs
- All five project names remain visible without scrolling
- The selected disc moves toward the viewing slot and receives the single accent treatment
- Project screenshots remain visually dominant over band imagery

The initial design reference selects NearHere because it already has strong real screenshots. The intended final default is LEDA after a credible terminal and watchOS visual has been captured.

### Expanded project detail

- The same project selected in the jukebox controls the expanded detail
- Show no more than three focused facts for each project
- Prefer headings such as Product, Engineering, Privacy, Architecture, or Outcome when they are genuinely relevant
- Include only working links
- Do not repeat the resume as paragraphs

### Other experiments shelf

- One horizontal editorial shelf, not a grid of equal cards
- Neural Style Transfer uses its existing real output strip
- ImageFX, Aegis AI, and lyrical analysis remain typographic until real screenshots are captured
- Each item has one sentence and one valid destination

### Footer and attribution

- Keep the current navigation and contact destinations
- Use one restrained Thom Yorke photograph crop, not a full gallery
- Add a compact Photo credits disclosure containing creator, source, and Creative Commons license
- Attribution data comes from `public/assets/radiohead/ATTRIBUTION.md`

## Interaction model

```text
Project button receives click, tap, or keyboard activation
                    |
                    v
Selected disc slides toward the viewing slot and rotates slightly
                    |
                    v
Active media crossfades while project text and links update
                    |
                    v
Expanded detail updates to the same project
                    |
                    v
URL hash records the selection for sharing and browser navigation
```

### Desktop behavior

- Project discs are semantic buttons, not decorative images
- Click or keyboard activation changes the project
- Hover may preview emphasis but must not permanently change selection
- Left and right arrow keys move through the jukebox
- Enter or Space selects the focused project
- Focus remains visible against light and dark themes

### Mobile behavior

- Convert the vertical rack into a horizontal scroll-snap rail
- Keep adjacent discs partially visible to communicate swipeability
- Tapping a disc selects it and centers it
- Maintain minimum 44 px interactive targets
- The active project title, media, and primary link appear before the rail or immediately around it

### Motion

- Disc translation: 420-560 ms
- Disc rotation: no more than 35 degrees during a selection change
- Preview transition: 180-240 ms opacity and small transform
- Text transition: 140-200 ms opacity
- No autoplay, perpetual rotation, parallax, scroll hijacking, or physics loop
- Under `prefers-reduced-motion: reduce`, all changes are immediate and static

## Visual system

### Light mode

- Background: warm stone or paper neutral inherited from the current site
- Primary ink: charcoal rather than pure black
- Accent: one burnt red sampled from the Kid A art
- Secondary ink: muted stone gray

### Dark mode

- Background: textured off-black or dark charcoal
- Primary ink: warm off-white rather than pure white
- Accent: the same burnt red used in light mode
- Project screenshots retain their original colors

### Typography

- Preserve the site's recognizable sans and monospace behavior
- Use a compressed, heavy display face only for the Projects heading if it can be self-hosted legally
- Project titles use the established sans family
- Technical metadata uses one monospace family
- Avoid excessive uppercase copy and tiny tracking

### Shape and material

- Sharp rectangular media frames
- Circular discs are the only repeated round objects
- Buttons remain text links or simple rectangular controls
- Paper grain and print texture are subtle fixed overlays, never applied to scrolling containers
- No glass panels, neon glows, pill badges, or generic rounded cards

## Image plan

### Existing images ready to use

- Kid A panorama: first artwork strip
- NearHere Simulator screenshots: active project and detail media
- Neural Style Transfer outputs: experiments shelf
- Licensed Thom Yorke and Radiohead photographs: restrained editorial crops

### Screenshots still required

1. LEDA terminal agent
   - Real invocation against a safe local repository
   - Show the prompt, one or two tool calls, and final response
   - Do not imply write or Git capabilities that do not exist
2. LEDA watchOS
   - Capture activation, listening, and speaking states in Simulator
   - Do not claim physical-device validation
3. Real-Time Anomaly Engine
   - Capture a real injected anomaly and WebSocket alert
   - Optional second visual: real service architecture diagram
4. SetuAI
   - Capture the actual dashboard and document-verification workflow
   - Use seeded or non-sensitive data
5. Fractal Resonance
   - Capture the live WebGL canvas with restrained controls visible
6. ImageFX
   - Capture the JavaFX application with an image and one filter result
7. Aegis AI
   - Capture streaming chat and the admin governance view

## Component plan

### `ProjectJukebox`

- Small React client island owning selected-project state
- Receives serializable project data from Astro
- Renders the disc controls, active media, text, and links
- Synchronizes selection to a stable URL hash

### `ProjectDisc`

- Semantic `button`
- Uses `aria-pressed` for selected state
- Contains project name as real text
- Uses a project-specific texture derived from real project media or the shared print system

### `ActiveProject`

- Responsive media with explicit dimensions
- Title, maximum two-line summary, compact technology line, and verified links
- No duplicate call-to-action intent

### `ProjectDetail`

- Three concise evidence-backed facts
- Optional second media asset
- Updates with the jukebox selection

### `ExperimentShelf`

- Horizontal layout on desktop
- Scroll snap on mobile
- Real image only when one exists

### `PhotoCredits`

- Native disclosure element
- Lists only images actually used on the page
- Keeps the visual footer clean while satisfying license terms

## Data model

Each project entry should contain:

```ts
type Project = {
  id: string;
  name: string;
  shortDescription: string;
  facts: Array<{ label: string; text: string }>;
  technologies: string[];
  media: Array<{ src: string; alt: string; width: number; height: number }>;
  links: Array<{ label: string; href: string }>;
  featured: boolean;
};
```

All descriptions and claims must be sourced from current repositories or existing verified resume evidence.

## Accessibility and performance

- Fully usable without hover
- Visible keyboard focus
- Accurate alt text describing the project state, not decorative mood
- Decorative textures use empty alt text
- Maintain WCAG AA contrast in both themes
- Preserve logical DOM reading order independent of visual placement
- Preload only the Kid A strip and initial active-project image
- Lazy-load all inactive project media
- Provide responsive `sizes` and explicit dimensions
- Avoid JavaScript-driven scroll tracking
- Respect reduced motion and reduced transparency preferences

## Implementation sequence after approval

1. Capture or select the missing real project visuals
2. Finalize verified project copy and link destinations
3. Add the project data model
4. Build the static desktop composition
5. Build the interactive jukebox client island
6. Add mobile scroll-snap behavior
7. Add light and dark theme treatments
8. Add the project detail and experiments shelf
9. Add attribution disclosure
10. Run formatting, Astro check, production build, accessibility review, responsive screenshots, and Lighthouse
11. Present the local result for approval
12. Commit and push only after explicit approval

## Definition of done

- All five featured projects are discoverable in the first viewport
- The jukebox works with mouse, touch, and keyboard
- No authored-work ambiguity remains
- No private or broken repository link is presented
- Every project uses a real screenshot or an honest text-only fallback
- Radiohead and Thom Yorke imagery complements rather than obscures project work
- Light and dark modes preserve the same hierarchy
- Mobile layout requires no precision dragging or horizontal overflow outside the intended rail
- Production build, accessibility checks, and key responsive views pass
