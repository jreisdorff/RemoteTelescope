# RemoteTelescope — Layered Design Spec

**Status:** Approved (medium locked)  
**Date:** 2026-05-24  
**Canonical tier:** Both (layered) — weak interface public, strong layer optional  
**Medium:** Hybrid — web L0–L1, text L2, persistent sim L3

---

## 1. In-world physics (one paragraph)

Every world receives every other world only through **signals that obey *c***. **Catoptrics**—mirror arrays and reflecting telescopes—collect photons that left target world **B** at emission time *tₑ*; observers on **A** therefore always see **B’s past**, indexed by distance and orbit. **Remote viewing** is the contested second channel: trained consciousness may couple to **B’s present** (or to a qualia-bearing layer not resolved by optics) without physical transport. Neither channel moves matter or enables causal intervention across light-years. **Experience of life on B** is therefore always **vicarious on A**: either immersion in a physically grounded representation (weak), or ongoing presence inside a dual-channel simulation or shared mind-state (strong). Catoptrics supplies the **spacetime anchor**; remote viewing supplies **phenomenology** where photons cannot.

---

## 2. Layer model

| Layer | Name | Default truth in product | User visibility |
|-------|------|--------------------------|-----------------|
| **L0** | Catoptric archive | Physical optics + known physics | Public |
| **L1** | Reconstructed world | VR/sim built from L0 | Public |
| **L2** | Remote viewing | Qualia packets; psi coupling unproven in-universe | Optional / gated |
| **L3** | Shared residence | Dual residency; B as second address | Hidden until unlocked |

**Principle:** L0–L1 are always available and scientifically honest. L2–L3 never contradict L0 where L0 has high confidence; they **extend** where L0 is sparse or silent.

---

## 3. User-facing loop

```text
OBSERVE → VIEW → MERGE → LIVE → FEEDBACK
```

### OBSERVE (L0)
- Select target **B** (catalog entry: coordinates, distance, light-travel lag Δt).
- Ingest latest catoptric stack: images, spectra, light curves, ephemeris.
- Output: **Anchor packet** `{ target_id, t_emission, t_observed, geometry, confidence_map }`.

### VIEW (L2, optional)
- Session requires **Anchor packet** (no free-floating RV).
- Trained viewer (or player-as-viewer) produces **Qualia packet**: colors, weather, terrain texture, emotion tags, narrative fragments, agent hints.
- Output: `{ session_id, anchor_ref, qualia[], viewer_id, timestamp }`.

### MERGE
- **Baseline (L1):** Mesh + atmosphere + lighting from L0 only.
- **Enriched (L1+L2):** Qualia fields applied only where `confidence_map < threshold` (see §4).
- **Strong (L3):** Persistent world-state fork; user may “reside” in merged B-world.
- Output: **Experience instance** — navigable B-world with metadata showing data provenance per region/feature.

### LIVE
- Weak: curriculum, observatory culture, time-lagged sky, VR tourism, stories.
- Strong: second life inside B-world; social layers; rituals tied to B’s orbital phase on A.

### FEEDBACK
- New L0 observations compared to L2 claims.
- Confirmed → promote qualia to **canon** (still labeled RV-sourced).
- Refuted → **strike** qualia; log in cultural record.
- Disconfirmation is first-class UI, not failure state.

---

## 4. Override rules: when RV beats optics (and when it cannot)

### RV may enrich (L2 overrides L1 default) when:
1. **Spatial resolution gap:** feature smaller than diffraction limit at A→B distance.
2. **Temporal gap:** user wants “present B” while L0 shows *tₑ* = now − Δt.
3. **Phenomenology gap:** color, mood, social context, interior spaces—no photometric path.
4. **Confidence map:** region flagged `unknown` or `inferred` in Anchor packet.

### RV must defer to L0 when:
1. **Hard measurement exists:** orbital period, bulk composition, disk morphology, confirmed geography.
2. **Conflict with high-confidence L0:** RV claim contradicts resolved imagery or spectroscopy → L0 wins; RV archived as **anomaly**.
3. **Causal claims:** RV cannot assert “I changed B” or “B caused event on A.”
4. **Provenance required:** every RV-enriched element carries badge: `source: rv`, `session_id`, `status: canon|provisional|struck`.

### Promotion ladder (qualia → canon)
```text
provisional → (L0 confirms) → canon
provisional → (L0 refutes) → struck
provisional → (no data) → remains provisional until observation or expiry policy
```

---

## 5. Light-cone culture (weak layer copy)

In-world copy and UI should reinforce:
- “You see B as it was **{Δt}** ago.”
- Generations mark milestones by **emission epoch**, not observation date.
- RV sessions labeled: “Present-tense report; not yet verified by mirror.”

---

## 6. Strong layer unlock (L3)

**Not** available at first launch. Unlock conditions (product TBD):
- Complete N FEEDBACK cycles with canon confirmations.
- Or narrative gate: initiation into viewer tradition.
- Or explicit user opt-in: “Enable strong layer” with ontology disclaimer.

**Strong layer behavior:**
- Persistent avatar/state in B-world.
- Qualia from other users’ RV sessions may appear as NPC texture/phenomenology.
- Ontological ambiguity preserved: product never claims psi is proven; factions debate in-world.

---

## 7. Data model (minimal)

```yaml
Target:
  id: string
  distance_ly: number
  light_lag: duration
  ephemeris: ref

AnchorPacket:
  target_id: string
  t_emission: datetime
  t_observed: datetime
  geometry: mesh_ref
  spectra: ref[]
  confidence_map: grid  # 0..1 per region

QualiaPacket:
  anchor_ref: string
  session_id: string
  qualia: QualiaField[]
  status: provisional | canon | struck

ExperienceInstance:
  target_id: string
  layers: [L0, L1, L2?]
  provenance: map<region, source>  # catoptric | rv | inferred
```

---

## 8. Product surfaces

| Surface | Layer | Role |
|---------|-------|------|
| Observatory | L0 | Catalog, light-lag clock, raw stacks |
| Reconstruction | L1 | Walkable optics-only world |
| Viewing chamber | L2 | RV UI, anchor-locked |
| Residence | L3 | Persistent merged life |
| Archive | all | Canon / provisional / struck ledger |

---

## 9. Non-goals (v1)

- FTL or cross-planet causal influence
- Claiming RV is proven (in or out of universe)
- RV overriding high-confidence optics
- Multiplayer L3 before single-player FEEDBACK is stable

---

## 10. Hybrid architecture (locked)

Three surfaces, one shared data core. All layers read/write the same `Target`, `AnchorPacket`, `QualiaPacket`, and `ExperienceInstance` types.

```text
┌─────────────────────────────────────────────────────────────┐
│  WEB SHELL (L0 + L1)                                        │
│  Observatory · catalog · light-lag clock · reconstruction │
│  Three.js globe / atmosphere from anchor data               │
└──────────────────────────┬──────────────────────────────────┘
                           │ anchor_ref
┌──────────────────────────▼──────────────────────────────────┐
│  TEXT CHAMBER (L2)                                            │
│  Structured RV session: prompts, free text, qualia tags       │
│  Output → QualiaPacket (provisional)                          │
└──────────────────────────┬──────────────────────────────────┘
                           │ merge
┌──────────────────────────▼──────────────────────────────────┐
│  RESIDENCE (L3, gated)                                        │
│  Persisted ExperienceInstance + avatar state                  │
│  Merged world re-rendered with canon/provisional qualia       │
└─────────────────────────────────────────────────────────────┘
                           │
                    ARCHIVE + FEEDBACK
                    (shared ledger, all surfaces)
```

| Surface | Tech | Layer | Ships in |
|---------|------|-------|----------|
| Observatory + Reconstruction | Web (Next.js, R3F) | L0, L1 | Milestone 1 |
| Viewing chamber | Web (text UI) | L2 | Milestone 2 |
| Residence | Web (persisted state + enriched L1 view) | L3 | Milestone 3 |
| Archive | Web (table + detail) | all | Milestone 2 |

**Merge rule in UI:** L1 mesh is always visible; L2 qualia appear as text overlays, color tints, and weather labels on low-confidence regions; L3 adds persistent location, inventory, and calendar on A/B.

**Single backend:** file-based or SQLite store for v1; no separate IF engine — L2 is a React route with session state machine.

---

## 11. Open decisions

1. ~~Medium~~ → **Hybrid (locked)**
2. Home world A: Earth, fictional, or abstract observer station? *(default for v1: abstract station)*
3. Targets: real exoplanets, Solar System, or fictional? *(default: Jupiter + one fictional exoplanet)*
4. L3 unlock: narrative vs opt-in vs progression? *(default: progression via FEEDBACK)*

---

## 12. Success criteria

- Core loop works on L0–L1 without L2.
- Every feature shows provenance.
- One FEEDBACK cycle ships (confirm or strike).
- L3 is optional, not required.
