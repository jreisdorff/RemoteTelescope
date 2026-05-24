# RemoteTelescope

Hybrid web app: catoptric observation (L0–L1), text remote viewing (L2), and FEEDBACK archive.

## Routes

| Route | Layer |
|-------|-------|
| `/observatory` | L0 — catalog, light-lag clock |
| `/world/[targetId]` | L1 (+ merged L2 qualia) |
| `/view/[targetId]` | L2 — text viewing chamber |
| `/archive` | FEEDBACK — qualia ledger + Jupiter observation demo |

Seed targets: **Jupiter**, **K2-Fictional b**.

## Loop

1. Observatory → pick a target → reconstruction
2. **Begin viewing session** → tag qualia (e.g. polar `rings`, Io `volcanic`)
3. World page shows merged overlay (provisional)
4. Archive → **Run FEEDBACK** (Jupiter Voyager fixture) → canon or struck
5. Return to world — provenance updates

## Develop

```bash
npm install
npm run dev
```

## Test & build

```bash
npm test
npm run build
```

Data is stored in `data/remote-telescope.db` (gitignored).

## Docs

- [Design spec](docs/superpowers/specs/2026-05-24-remote-telescope-design.md)
- [Implementation plan](docs/superpowers/plans/2026-05-24-remote-telescope-hybrid-mvp.md)
