# Project media library

Collected on 2026-10-09 for the planned Projects-page redesign. These are reference assets only; the Projects page has not been rebuilt around them yet.

## Recommended first-screen lineup

| Project | GitHub | Strongest visual | Status / use |
| --- | --- | --- | --- |
| NearHere | https://github.com/ansh0eman/NearHere | `/assets/projects/nearhere/selected-place.png` | Real iOS Simulator capture. Best lead visual because the map, marker, bottom sheet, and acid-green accent read immediately. |
| LEDA | https://github.com/ansh0eman/Leda | `/assets/projects/leda/cli-agent-transcript.png` | A designed rendering of a real CLI run captured on 2026-10-09. Label it as a terminal transcript, not a literal terminal-window screenshot. |
| Fractal Resonance | https://github.com/ansh0eman/music-fractal | `/assets/projects/fractal-resonance/generator-interface.png` plus an output image | Real local frontend capture plus real generated outputs. Excellent visual counterweight to product/UI work. |
| SetuAI | https://github.com/ansh0eman/setuai | `/assets/projects/setuai/buyer-marketplace.png` | Real authenticated buyer-side frontend capture from a temporary clone, with seeded demo vendors and compliance statuses. Product captures avoid the watermarked login background. |
| Real-Time Anomaly Engine | https://github.com/ansh0eman/real-time-anomaly-engine | `/assets/projects/real-time-anomaly-engine/api-ingestion-schema.png` | Real live OpenAPI capture with the ingestion payload expanded. Strong technical proof, but visually secondary. |
| Aegis AI | https://github.com/ansh0eman/aegis-ai | `/assets/projects/aegis-ai/governance-ui-concept.jpg` | AI-generated UI visualization based on the current synthetic governance demo. Label it as a visualization, not a live capture. |

## Collected files

### NearHere

- `/assets/projects/nearhere/browse-map.png` — real iOS Simulator browse state.
- `/assets/projects/nearhere/selected-place.png` — real selected-place state; recommended cover.
- `/assets/projects/nearhere/profile-details.png` — real profile/details screen.

### LEDA

- `/assets/projects/leda/cli-agent-transcript.png` — visual transcript derived from an actual safe, read-only local run that inspected `package.json` and `README.md`.
- `/assets/projects/leda/watchos-omnitrix.png` — clean 416 x 496 capture from Apple Watch Series 11 (46 mm), watchOS 26.5 Simulator. Shows the app's idle Omnitrix face; no interaction or physical-device behavior is implied.

### Fractal Resonance

- `/assets/projects/fractal-resonance/generator-interface.png` — real local frontend at 1440 x 900.
- `/assets/projects/fractal-resonance/output-neon-tree.png` — real generated output.
- `/assets/projects/fractal-resonance/output-mandelbrot.png` — real generated output.
- `/assets/projects/fractal-resonance/output-sierpinski.png` — real generated output.

### SetuAI

- `/assets/projects/setuai/login.png` — real frontend login capture with capture-only translation scaffolding. The background carries visible Unsplash watermarks; prefer authenticated product screens above for the page redesign.
- `/assets/projects/setuai/vendor-dashboard.png` — authenticated vendor dashboard with seeded document statuses.
- `/assets/projects/setuai/compliance-reports.png` — vendor compliance reports view.
- `/assets/projects/setuai/vendor-compliance-detail.png` — detailed compliance view for a seeded demo vendor.
- `/assets/projects/setuai/marketplace.png` — vendor-role marketplace view.
- `/assets/projects/setuai/buyer-marketplace.png` — authenticated buyer marketplace with seeded vendor cards and compliance states; preferred marketplace visual.
- `/assets/projects/setuai/buyer-engagements-translation-gap.png` — buyer engagement table with seeded active/pending/on-hold/completed records; the app exposes untranslated localization keys in this screen, so treat as functional-flow evidence, not polished UI.
- `/assets/projects/setuai/textile-factory-source.jpeg` — original checked-in background source, retained for provenance.

### Real-Time Anomaly Engine

- `/assets/projects/real-time-anomaly-engine/api-ingestion-schema.png` — real local FastAPI/OpenAPI interface with the metric payload visible.

### Aegis AI

- `/assets/projects/aegis-ai/governance-ui-concept.jpg` — AI-generated view of synthetic member access and quota controls.
- `/assets/projects/aegis-ai/workspace-ui-concept.jpg` — AI-generated view of the scripted public chat demo.

### Neural Style Transfer

- `/assets/projects/neural-style-transfer/style-transfer-samples.png` — existing project composite already present in the portfolio. Keep as an archive item if space allows, not in the first-screen lineup.

## Projects with visual-capture limitations

### ImageFX

- GitHub: https://github.com/ansh0eman/ImageFX
- Repository is public, but contains no screenshots or sample images.
- The checked-in JavaFX entry point is not directly runnable as-is (`ImageFX.java` declares `public class TEST2`) and the repository has no reproducible JavaFX build configuration.
- Recommendation: keep it in a compact archive row until a real run can be repaired and captured. Do not synthesize a fake editor screenshot.

### LEDA watchOS companion

- GitHub: https://github.com/ansh0eman/ledaWatchOS
- The repository is public and contains the implementation. A clean Simulator idle-state capture is now available; interactive/audio states still need direct validation and capture.

## Explicit exclusions

- Property Management: removed from the proposed collection per user direction.
- QR AI Chat: excluded from authored-project cards until it is independently rebuilt.
- No AI-generated substitute screenshots were created.

## Supporting references

- `project-media-contact-sheet.png` — 20-image overview of the collected project visuals, including the later SetuAI and LEDA Watch captures; watermarked SetuAI source/login and the untranslated engagement screen are explicitly labelled.
- `project-media-contact-sheet.jpg` — earlier nine-image overview retained as historical reference.
- `leda-cli-capture.html` — capture-only source used to render the LEDA transcript image.
- Radiohead/Thom Yorke editorial assets remain under `/assets/radiohead/`; they should frame the jukebox/archive interface, not masquerade as project screenshots.
