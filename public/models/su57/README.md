# Su-57 model

Drop a glTF/GLB here as `scene.glb`:

```
public/models/su57/scene.glb
```

The app HEADs this URL on mount. If it's present, it's loaded via
`useGLTF` and meshes are auto-tagged to the existing PartGroup
hover/click system using a name-pattern heuristic
(`vehicles/su57/GltfModel.tsx`). If absent, the app falls back to a
stylized procedural Su-57.

## Recommended source

The reference model used for testing the loader path:

- **Sukhoi Su-57 Felon Fighter Jet** — Sketchfab
  https://sketchfab.com/3d-models/sukhoi-su-57-felon-fighter-jet-free-59995d6f34ba4bb7990195be3a745fc5

  1. Sign in to Sketchfab.
  2. Click **Download 3D Model** → choose **glTF (.glb)** if available,
     otherwise grab the .zip and find / re-export `scene.glb`.
  3. Place at `public/models/su57/scene.glb`.

## Licensing

Sketchfab "free" downloads are typically **CC-BY 4.0** (attribution
required) or **CC-BY-NC** (non-commercial). Confirm the license on the
model page and add the required credit to the about modal if you ship.

The active vehicle's `attribution` field flows into the About modal —
edit `vehicles/su57/index.tsx` to update it once you've checked the
license.

## Mesh-name mapping

`GltfModel.tsx` maps mesh names to part IDs via a regex heuristic
(`cockpit|seat`, `canopy|glass`, `radar|aesa|nose_cone`, …). Most
artists don't name meshes consistently — if buckets look wrong in the
sidebar, either:

1. Open the model in Blender, rename the parent groups to match the
   mapping, and re-export, or
2. Edit `mapNameToPartId` in `GltfModel.tsx` to match the names your
   model actually uses.
