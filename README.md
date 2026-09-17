# RemoteTelescope

Observe distant worlds as they were when their light left them, then record how you imagine they are right now.

## What it is

Light takes time to travel, so a telescope never shows you a planet's present. Jupiter appears as it was about 35 minutes ago, and a world 124 light-years away shows you light that left it 124 years back. RemoteTelescope is a speculative science-fiction web app built around that fact. You pick a target from an observatory catalog, watch a live clock count the delay, and explore a 3D reconstruction built only from what a telescope could confirm. Then you can run a "remote viewing" session: a four-step guided form where you write present-tense impressions of the world and tag specific regions with claims about color, weather, terrain, or mood. Those claims are treated as unverified until a later observation confirms or refutes them, and they are never allowed to overwrite what the telescope already knows.

<!-- TODO screenshot: /world/jupiter after one viewing session has been submitted. Capture the rotating 3D planet with the purple "Remote viewing overlay" panel at the bottom of the canvas, and the Provenance sidebar on the right showing region badges (Catoptric / Remote viewing / Inferred) and the session list. -->

## Features

- Observatory catalog of two targets (Jupiter and a fictional exoplanet) showing distance, light travel time, and a live clock with the exact moment the light you are seeing left the planet.
- Interactive 3D planet rendered with Three.js that slowly rotates and can be orbited and zoomed, with a starfield and a simple atmosphere layer.
- Guided four-step remote viewing session (orientation, impressions, tagged claims, narrative) that saves to a local SQLite database.
- A merge engine that overlays your claims only on regions where telescope confidence is below 50 percent, so confident telescope data always wins. Every region carries a provenance badge showing where its information came from.
- A verification step that checks pending claims against a fixture based on the 1979 Voyager 1 flyby and marks each session confirmed (shown as "canon"), refuted ("struck"), or still pending ("provisional"). Refuted sessions stay in the archive rather than being deleted.
- An archive page listing every session with its claims and a status filter.
- A locked "Residence" mode that opens once a target has at least one confirmed claim. It keeps a persistent location on the planet, two calendars (station time versus the planet's claimed present), and an inventory.

## Tech stack

- Next.js 15 (App Router, server components, route handlers), React 19, TypeScript in strict mode
- Three.js via React Three Fiber and drei for the 3D scene
- SQLite via better-sqlite3 for persistence (database file is created automatically on first run)
- Zod for schema validation, Vitest for tests, Tailwind CSS 4 for styling

## Getting started

Requires Node.js 18.18 or newer (verified on Node 24).

```bash
npm install
npm run dev
```

Open http://localhost:3000. The home page redirects to the observatory.

To try the full loop: open Jupiter's reconstruction, click "Begin viewing session", add a tag on the polar region with a value such as "flattened ring", and submit. Go to the Archive and click "Run FEEDBACK". The session is confirmed, and "Enter residence" appears on the Observatory and world pages.

```bash
npm test
npm run build
```

Data lives in `data/remote-telescope.db`, which is gitignored. Delete it to reset.

## How it's built

The app is a single Next.js App Router project. All of the rules that matter (the data types, Zod schemas, the merge rule, the verification rule, and the unlock rule) live in `src/lib/domain` with no framework or database imports, and that is the layer the test suite covers. Pages are server components that read SQLite directly, and three JSON route handlers under `src/app/api` handle writes from the client components. Seed data for the two targets and the Voyager observation fixture live in `src/lib/seed`. In the code and UI, a viewer's tagged impressions are called "qualia" and telescope-sourced data is called "catoptric" (the optics of mirrors); this README uses "claims" and "telescope data" for the same things.

The project was developed spec-first. A [design spec](docs/superpowers/specs/2026-05-24-remote-telescope-design.md) defines the premise, the data model, and the rule that claims never override confident telescope data. An [implementation plan](docs/superpowers/plans/2026-05-24-remote-telescope-hybrid-mvp.md) breaks the work into three milestones of test-first tasks, and the commit history follows those milestones. Seventeen Vitest tests cover the domain layer, including an integration test that runs the whole observe, claim, verify, unlock sequence.

| Route | What it does |
|-------|--------------|
| `/observatory` | Catalog of targets with distance and light delay; shows which worlds have Residence unlocked |
| `/world/[targetId]` | 3D reconstruction with the provenance panel and any merged claims |
| `/view/[targetId]` | Four-step remote viewing session |
| `/archive` | Ledger of every session and its status; runs verification |
| `/residence/[targetId]` | Persistent residence, locked until a claim on that world is confirmed |
| `/api/qualia`, `/api/feedback`, `/api/residence` | JSON endpoints for saving sessions, running verification, and saving residence state |

## Status

The full loop runs end to end locally with `npm run dev` for the two seed targets. The verification fixture exists only for Jupiter, so Residence can currently be unlocked only there. There is a single implicit user with no authentication, and the 3D planet is a colored sphere rather than a textured model.

## License

MIT. See [LICENSE](LICENSE).
