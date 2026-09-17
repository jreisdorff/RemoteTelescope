# RemoteTelescope Hybrid MVP Implementation Plan

**Goal:** Ship a hybrid web app where users observe targets (L0), walk a reconstructed world (L1), optionally run text remote-viewing sessions (L2), and unlock persistent residence (L3) after FEEDBACK progression.

**Architecture:** Next.js App Router monolith with a shared domain layer (`packages/core` or `src/lib/domain`) holding targets, anchor packets, qualia packets, and merge logic. L0–L1 use React Three Fiber on `/observatory` and `/world/[targetId]`. L2 is a text session route `/view/[targetId]`. L3 is `/residence/[targetId]` with persisted `ExperienceInstance` in SQLite via better-sqlite3 (or Turso for deploy). Archive and FEEDBACK live at `/archive`.

**Tech Stack:** Next.js 15, TypeScript, Tailwind, React Three Fiber + drei, better-sqlite3, Vitest, Zod for schemas

**Defaults (from spec open items):** Abstract observer station as home world A; seed targets Jupiter + fictional exoplanet K2-18b-style; L3 unlock after 1 canon FEEDBACK cycle.

---

## File structure (target)

```text
RemoteTelescope/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # redirect → /observatory
│   │   ├── observatory/page.tsx        # L0 catalog + light-lag
│   │   ├── world/[targetId]/page.tsx   # L1 reconstruction
│   │   ├── view/[targetId]/page.tsx    # L2 text RV session
│   │   ├── residence/[targetId]/page.tsx # L3 gated
│   │   └── archive/page.tsx            # FEEDBACK ledger
│   ├── components/
│   │   ├── observatory/
│   │   ├── world/
│   │   ├── viewing/
│   │   └── archive/
│   └── lib/
│       ├── domain/                     # types, merge, feedback
│       ├── db/                         # sqlite schema + queries
│       └── seed/                       # jupiter, k2-18b fixtures
├── tests/
│   └── lib/domain/
├── data/
│   └── remote-telescope.db             # gitignored
└── docs/superpowers/
```

---

## Milestone 1: L0–L1 core loop (OBSERVE → MERGE → LIVE weak)

### Task 1: Project scaffold

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `vitest.config.ts`
- Create: `src/app/layout.tsx`, `src/app/page.tsx`

- [ ] **Step 1:** `npx create-next-app@latest . --typescript --tailwind --app --no-eslint --import-alias "@/*"`
- [ ] **Step 2:** Add deps: `@react-three/fiber`, `@react-three/drei`, `three`, `zod`, `better-sqlite3`, `@types/better-sqlite3`
- [ ] **Step 3:** Add dev dep `vitest`, `@vitejs/plugin-react`; script `"test": "vitest"`
- [ ] **Step 4:** Verify `npm run dev` and `npm test` run (empty pass)

### Task 2: Domain types and Zod schemas

**Files:**
- Create: `src/lib/domain/types.ts`
- Create: `src/lib/domain/schemas.ts`
- Test: `tests/lib/domain/schemas.test.ts`

- [ ] **Step 1:** Write failing tests for parsing `Target`, `AnchorPacket`, `QualiaPacket`, `ExperienceInstance`
- [ ] **Step 2:** Implement Zod schemas matching design spec §7
- [ ] **Step 3:** Run tests — PASS
- [ ] **Step 4:** Commit

### Task 3: Seed data (Jupiter + fictional exoplanet)

**Files:**
- Create: `src/lib/seed/targets.ts`
- Create: `src/lib/seed/jupiter-anchor.ts`
- Create: `src/lib/seed/k2fictional-anchor.ts`

- [ ] **Step 1:** Jupiter target: real distance, ~35–52 min light lag (variable), public-domain-ish placeholder spectra metadata
- [ ] **Step 2:** Fictional exoplanet `k2-fictional`: ~124 ly lag, low confidence_map in polar regions
- [ ] **Step 3:** Export `getSeedTargets()` and anchor packets
- [ ] **Step 4:** Commit

### Task 4: Merge engine

**Files:**
- Create: `src/lib/domain/merge.ts`
- Test: `tests/lib/domain/merge.test.ts`

- [ ] **Step 1:** Write failing tests:
  - optics-only regions unchanged when no qualia
  - qualia applied only where `confidence < 0.5`
  - qualia rejected where `confidence >= 0.5` (L0 wins)
  - struck qualia never applied
- [ ] **Step 2:** Implement `mergeAnchorWithQualia(anchor, qualia[]) → ExperienceInstance`
- [ ] **Step 3:** Run tests — PASS
- [ ] **Step 4:** Commit

### Task 5: Observatory page (L0)

**Files:**
- Create: `src/app/observatory/page.tsx`
- Create: `src/components/observatory/TargetCatalog.tsx`
- Create: `src/components/observatory/LightLagClock.tsx`

- [ ] **Step 1:**  List targets with name, distance, computed Δt display**
- [ ] **Step 2:** Light-lag clock ticks; copy: “You see {name} as it was {Δt} ago”
- [ ] **Step 3:** Link each target → `/world/[targetId]`
- [ ] **Step 4:** Manual smoke test in browser
- [ ] **Step 5:** Commit

### Task 6: Reconstruction page (L1)

**Files:**
- Create: `src/app/world/[targetId]/page.tsx`
- Create: `src/components/world/PlanetScene.tsx`
- Create: `src/components/world/ProvenancePanel.tsx`

- [ ] **Step 1:** R3F canvas: textured sphere, simple atmosphere shader or `@react-three/drei` `Stars`
- [ ] **Step 2:** Load anchor for targetId; color from spectra metadata
- [ ] **Step 3:** Provenance panel lists regions with `catoptric | inferred` badges
- [ ] **Step 4:** Link to “Begin viewing session” → `/view/[targetId]` (disabled styling ok until M2)
- [ ] **Step 5:** Commit

---

## Milestone 2: L2 text chamber + Archive + FEEDBACK

### Task 7: SQLite persistence

**Files:**
- Create: `src/lib/db/schema.sql`
- Create: `src/lib/db/client.ts`
- Create: `src/lib/db/qualia.ts`
- Create: `src/app/api/qualia/route.ts`

- [ ] **Step 1:** Schema: `qualia_packets`, `experience_instances`, `feedback_events`
- [ ] **Step 2:** CRUD for qualia insert/list by target
- [ ] **Step 3:** API route POST qualia from L2 session
- [ ] **Step 4:** Commit

### Task 8: Viewing chamber (L2 text UI)

**Files:**
- Create: `src/app/view/[targetId]/page.tsx`
- Create: `src/components/viewing/ViewingSession.tsx`
- Create: `src/lib/domain/viewing-prompts.ts`

- [ ] **Step 1:** Require anchor loaded; show target coords + t_emission
- [ ] **Step 2:** Multi-step session: orientation → impressions → qualia tags (color, weather, emotion) → free text
- [ ] **Step 3:** Submit creates `QualiaPacket` status `provisional`; redirect to merged world preview
- [ ] **Step 4:** Label UI: “Present-tense report; not yet verified by mirror”
- [ ] **Step 5:** Commit

### Task 9: Enriched merge preview

**Files:**
- Modify: `src/app/world/[targetId]/page.tsx`
- Create: `src/components/world/QualiaOverlay.tsx`

- [ ] **Step 1:** Fetch provisional/canon qualia for target from DB
- [ ] **Step 2:** Run merge engine; tint low-confidence regions; show qualia text overlays
- [ ] **Step 3:** Provenance badges include `rv` + session_id + status
- [ ] **Step 4:** Commit

### Task 10: Feedback engine + Archive

**Files:**
- Create: `src/lib/domain/feedback.ts`
- Test: `tests/lib/domain/feedback.test.ts`
- Create: `src/app/archive/page.tsx`
- Create: `src/app/api/feedback/route.ts`

- [ ] **Step 1:** Tests: `applyFeedback(qualia, observation)` → canon | struck
- [ ] **Step 2:** Implement: match qualia claims against new L0 observation fixtures (admin trigger for v1)
- [ ] **Step 3:** Archive page: table of all qualia with status filters
- [ ] **Step 4:** Admin “Simulate new observation” button on Jupiter (confirms rings/volcanism demo) — promotes to canon
- [ ] **Step 5:** Commit

---

## Milestone 3: L3 residence (gated persistent sim)

### Task 11: Unlock gate

**Files:**
- Create: `src/lib/domain/unlock.ts`
- Test: `tests/lib/domain/unlock.test.ts`
- Modify: `src/app/residence/[targetId]/page.tsx`

- [ ] **Step 1:** `canUnlockResidence(userId, targetId)` true when ≥1 canon qualia for target
- [ ] **Step 2:** `/residence/[targetId]` returns 403 UI if locked; else render residence
- [ ] **Step 3:** Observatory shows subtle “Residence available” when unlocked
- [ ] **Step 4:** Commit

### Task 12: Persistent experience state

**Files:**
- Create: `src/lib/db/residence.ts`
- Create: `src/components/residence/ResidenceHUD.tsx`

- [ ] **Step 1:** Schema fields: `last_location`, `a_calendar`, `b_calendar`, `inventory` (JSON)
- [ ] **Step 2:** Load/save on navigation; dual calendar shows A observation time vs B claimed present
- [ ] **Step 3:** Reuse L1 scene with merged qualia + residence state overlays
- [ ] **Step 4:** Commit

### Task 13: End-to-end smoke + README

**Files:**
- Create: `README.md`
- Create: `tests/e2e/flow.test.ts` (optional integration)

- [ ] **Step 1:** Document loop: observatory → world → view → archive feedback → residence
- [ ] **Step 2:** Integration test: seed → merge → feedback → unlock (Vitest, no Playwright required for v1)
- [ ] **Step 3:** Final manual pass all routes
- [ ] **Step 4:** Commit

---

## Testing strategy

| Layer | Test type |
|-------|-----------|
| merge, feedback, unlock, schemas | Vitest unit |
| API Gateway | Vitest integration with seed fixtures |
| R3F scenes | Manual smoke only (v1) |
| API routes | Vitest + fetch mock or supertest |

---

## Out of scope for this plan

- Real telescope API ingestion (use seed anchors)
- Multiplayer / shared qualia
- LLM-generated RV (player-authored text only)
- Production deploy (Docker/Vercel notes in README only)

---

## Execution order

```text
M1: Tasks 1–6  → shippable L0–L1 demo
M2: Tasks 7–10 → full OBSERVE→VIEW→MERGE→FEEDBACK
M3: Tasks 11–13 → L3 residence + docs
```

Start with **Task 1** in a fresh worktree if using superpowers git workflow.
