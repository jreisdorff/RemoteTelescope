# RemoteTelescope

Hybrid web app: catoptric observation (L0–L1) with optional remote viewing (L2) and residence (L3).

## Milestone 1 (current)

- **Observatory** (`/observatory`) — target catalog and light-lag clock
- **Reconstruction** (`/world/[targetId]`) — 3D globe and provenance panel

Seed targets: Jupiter, K2-Fictional b.

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (redirects to Observatory).

## Test

```bash
npm test
```

## Docs

- [Design spec](docs/superpowers/specs/2026-05-24-remote-telescope-design.md)
- [Implementation plan](docs/superpowers/plans/2026-05-24-remote-telescope-hybrid-mvp.md)
