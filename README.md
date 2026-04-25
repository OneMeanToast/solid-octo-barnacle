# T-72 Tank Explorer

An interactive 3D explainer for the Soviet/Russian **T-72 main battle tank**, built with **Next.js 14**, **React Three Fiber**, **drei**, and **postprocessing**. The interface is deliberately modeled on the look and feel of the [Artemis II Mission Explorer](https://artemis.radman.dev): a dark, cinematic HUD with a clickable component tree, a contextual detail panel, a scrubable phase timeline, and switchable visual themes.

## Highlights

- **14 selectable subsystems** — Hull, Turret, 125 mm 2A46 gun, Autoloader, ERA, Tracks, Engine, Driver's Station, Cupola, MG, Smoke Launchers, Optics, Ammunition, Fire Control.
- **Three seamless visual themes** — `Blueprint`, `Field`, `Cinematic`. Switching preserves camera and timeline state.
- **Six-phase mission timeline** — Idle → Start-up → Aim → Maneuver → Engage → Maintenance, with synchronized animations and reverse-scrubbing support.
- **Particle systems** — diesel exhaust, track dust, muzzle flash + lingering smoke.
- **Hover labels, fly-to camera, exploded maintenance view, optional sound.**
- **Procedural model** — the entire T-72 is built from instanced primitives so every part is individually addressable and the app runs without external GLB downloads.

## Getting started

```bash
pnpm install      # or: npm install
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
app/                 Next.js App Router entry
components/
  Scene.tsx          Canvas, post-processing, camera rig
  CameraRig.tsx      OrbitControls + cinematic fly-to per part
  HoverLabel.tsx     drei <Html> tooltip
  Tank/              Procedural T-72 (Hull, Turret, MainGun, Tracks, ERA, …)
  Particles/         Exhaust, track dust, muzzle flash
  Environment/       Theme-aware lighting + post-processing
  UI/                TopBar, Sidebar, DetailPanel, Timeline, AboutModal, CornerHud
lib/
  store.ts           Zustand store (selection, theme, timeline)
  parts.ts           Part metadata + specs
  timeline.ts        Phase definitions
  theme.ts           Per-theme colour palette
```

## Notes

- The 3D model is a stylized procedural representation of a T-72A/B variant; shapes and proportions are simplified for clarity.
- Specs are drawn from public open-source references on the T-72 family for educational purposes.
- Inspired by, not affiliated with, the Artemis II Mission Explorer.
