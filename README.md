# Vehicle Explorer

An interactive 3D explainer with a registry of vehicles. Currently ships with the **T-72 main battle tank** and the **Su-57 fighter**, with a drop-in slot for additional vehicles. Built with **Next.js 14**, **React Three Fiber**, **drei**, and **postprocessing**. The interface is modeled on the look and feel of the [Artemis II Mission Explorer](https://artemis.radman.dev): a dark, cinematic HUD with a clickable component tree, a contextual detail panel, a scrubable phase timeline, and switchable visual themes.

## Highlights

- **Vehicle registry** — each vehicle is its own module under `vehicles/<id>/` providing parts metadata, mission phases, camera-focus targets, and a 3D `Model` component (procedural *or* GLTF-backed). The shared shell (theme, HUD, timeline, particles, post-processing) is vehicle-agnostic.
- **Two seamless visual themes per scene** — Blueprint / Field / Cinematic, applied uniformly to procedural and imported geometry.
- **Per-vehicle phase timeline** with reverse-scrubbing support.
- **Drop-in GLTF support** — place a `.glb` at `public/models/<vehicle>/scene.glb`; the app HEADs that URL on mount and uses it if present. Mesh names are mapped to selectable PartIds via a regex heuristic.
- **Hover labels, fly-to camera, theme-aware post-processing, optional sound.**

## Vehicles

### T-72 (Soviet/Russian Main Battle Tank, 1973 →)

14 subsystems · 6 phases (Idle → Start-up → Aim → Maneuver → Engage → Maintenance). Procedural model. Particle systems for diesel exhaust, track dust, and muzzle flash + lingering smoke.

### Su-57 (Russian stealth multi-role fighter, 2010 →)

13 subsystems · 6 phases (Cold → Start-up → Taxi → Takeoff → Engage → Return). The procedural fallback features animated weapons-bay doors, retractable gear, and TVC nozzles. Drop a real model at `public/models/su57/scene.glb` to use it instead — see `public/models/su57/README.md`.

## Getting started

```bash
pnpm install      # or: npm install / yarn
pnpm dev          # http://localhost:3000
```

Build:

```bash
pnpm build && pnpm start
```

## Keyboard

| Key       | Action                       |
| --------- | ---------------------------- |
| `Space`   | Play / pause timeline        |
| `←` / `→` | Scrub backward / forward     |
| `R`       | Reset timeline to 0          |

## Project layout

```
app/                       Next.js App Router entry
components/
  Scene.tsx                Canvas + post-processing + camera rig
  CameraRig.tsx            OrbitControls + cinematic fly-to (reads from active vehicle)
  HoverLabel.tsx           drei <Html> tooltip
  Tank/                    Procedural T-72 (Hull, Turret, MainGun, Tracks, ERA, …)
    PartGroup.tsx          Vehicle-agnostic hover/select wrapper
  Particles/               Exhaust, track dust, muzzle flash (T-72 specific)
  Environment/             Theme-aware lighting + post-processing
  UI/                      TopBar (with vehicle switcher), Sidebar, DetailPanel,
                           Timeline, AboutModal, CornerHud
vehicles/
  t72/                     T-72 vehicle module
    parts.ts, phases.ts, cameraFocus.ts, timeline.ts, index.tsx
  su57/                    Su-57 vehicle module
    parts.ts, phases.ts, cameraFocus.ts,
    Procedural.tsx         Procedural fallback
    GltfModel.tsx          Loads /models/su57/scene.glb if present
    materials.ts           Per-theme material set for the procedural body
    index.tsx              Composite Model: GLTF first, procedural fallback
lib/
  store.ts                 Zustand store (vehicle, selection, theme, timeline)
  vehicles.ts              Registry + useActiveVehicle()
  types.ts                 Vehicle / Part / Phase types + helpers
  theme.ts                 Per-theme colour palette
public/
  models/su57/             Drop scene.glb here to enable the real Su-57 model
```

## Adding a new vehicle

1. Create `vehicles/<id>/parts.ts`, `phases.ts`, `cameraFocus.ts`.
2. Create a `Model` component (procedural under `Tank/PartGroup` or GLTF-backed similar to `vehicles/su57/GltfModel.tsx`).
3. Export a `Vehicle` from `vehicles/<id>/index.tsx`.
4. Add to `lib/vehicles.ts`.
5. Add the `id` to `VehicleId` in `lib/types.ts`.

The TopBar vehicle switcher will pick it up automatically.

## Notes

- 3D models are educational stand-ins. Specifications are drawn from public open-source references.
- The Su-57 GLTF loader is licensing-agnostic — confirm the source model's CC-BY / CC-BY-NC terms before shipping and update `attribution` on `vehicles/su57/index.tsx`.
- Inspired by, not affiliated with, the Artemis II Mission Explorer.
