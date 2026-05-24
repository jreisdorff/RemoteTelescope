# RemoteTelescope

Hybrid web app: catoptric observation (L0–L1), text remote viewing (L2), FEEDBACK archive, and gated residence (L3).

## Routes

| Route | Layer |
|-------|-------|
| `/observatory` | L0 — catalog, light-lag, residence unlock badges |
| `/world/[targetId]` | L1 (+ merged L2 qualia) |
| `/view/[targetId]` | L2 — text viewing chamber |
| `/archive` | FEEDBACK — qualia ledger + Jupiter observation demo |
| `/residence/[targetId]` | L3 — persistent dual life (requires canon qualia) |

Seed targets: **Jupiter**, **K2-Fictional b**.

## Full loop

1. **Observatory** → pick a target → reconstruction
2. **Begin viewing session** → tag qualia (e.g. polar `flattened ring`, Io `volcanic`)
3. **World** — merged overlay (provisional)
4. **Archive** → **Run FEEDBACK** (Jupiter Voyager fixture) → `canon` or `struck`
5. **Observatory** shows **Residence available** → **Enter residence**
6. **Residence** — dual calendar (A station time vs B present), location, inventory (persisted in SQLite)

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

Data: `data/remote-telescope.db` (gitignored).

## Docs

- [Design spec](docs/superpowers/specs/2026-05-24-remote-telescope-design.md)
- [Implementation plan](docs/superpowers/plans/2026-05-24-remote-telescope-hybrid-mvp.md)
