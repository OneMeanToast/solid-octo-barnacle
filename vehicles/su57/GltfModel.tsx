'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useExplorer } from '@/lib/store';
import { PALETTE } from '@/lib/theme';
import { PartGroup } from '@/components/Tank/PartGroup';

const MODEL_URL = '/models/su57/scene.glb';

/** Fast HEAD probe so we don't trigger a Suspense throw when the model file isn't there. */
function useModelExists(url: string) {
  const [state, setState] = useState<'unknown' | 'present' | 'missing'>('unknown');
  useEffect(() => {
    let cancelled = false;
    fetch(url, { method: 'HEAD' })
      .then((r) => {
        if (cancelled) return;
        setState(r.ok ? 'present' : 'missing');
      })
      .catch(() => {
        if (!cancelled) setState('missing');
      });
    return () => {
      cancelled = true;
    };
  }, [url]);
  return state;
}

/**
 * Loads /models/su57/scene.glb if it's present and walks the mesh tree
 * tagging children with userData.partId so the existing PartGroup hover/click
 * machinery still works. Material overrides per theme are applied via traversal.
 *
 * If the file is absent, returns null and the caller should render the
 * procedural fallback instead.
 */
export function Su57Gltf({ onMissing }: { onMissing?: () => void }) {
  const status = useModelExists(MODEL_URL);

  useEffect(() => {
    if (status === 'missing') onMissing?.();
  }, [status, onMissing]);

  if (status !== 'present') return null;

  return (
    <Suspense fallback={null}>
      <Su57GltfInner />
    </Suspense>
  );
}

function Su57GltfInner() {
  const gltf = useGLTF(MODEL_URL);
  const theme = useExplorer((s) => s.theme);
  const palette = PALETTE[theme];
  const rootRef = useRef<THREE.Group>(null!);

  // Snapshot of original materials per mesh, captured once.
  const originals = useMemo(
    () => new WeakMap<THREE.Mesh, THREE.Material | THREE.Material[]>(),
    [],
  );

  /** Heuristic mapping from mesh name → our PartId. Falls back to airframe. */
  const mapNameToPartId = (name: string): string => {
    const n = name.toLowerCase();
    if (/cockpit|seat/.test(n)) return 'cockpit';
    if (/canopy|glass|hood/.test(n)) return 'canopy';
    if (/radar|radome|aesa|nose_cone/.test(n)) return 'radar';
    if (/irst|ols|sensor_fwd/.test(n)) return 'irst';
    if (/levcon|leading.*edge|slat/.test(n)) return 'wings';
    if (/wing(?!.*tip)|aileron|flap/.test(n)) return 'wings';
    if (/(?:vert|fin)|stabili[sz]er|tail|rudder/.test(n)) return 'tail';
    if (/nozzle|exhaust|tvc/.test(n)) return 'nozzles';
    if (/engine|turbine|compressor|al-?41|al-?51/.test(n)) return 'engines';
    if (/main_bay|weapons_bay_main|center_bay|bay_door_main/.test(n)) return 'main-bay';
    if (/side_bay|cheek_bay|sraam|r-?74/.test(n)) return 'side-bays';
    if (/(?:gear|wheel|tire|tyre|strut)/.test(n)) return 'gear';
    if (/antenna|jamm|himalay|mws|countermeasure/.test(n)) return 'ew';
    if (/fuselage|airframe|body|hull|panel/.test(n)) return 'airframe';
    return 'airframe';
  };

  /** First-pass: capture originals + tag userData with partId. Bucket meshes by part. */
  const buckets = useMemo(() => {
    const map: Record<string, THREE.Object3D[]> = {};
    if (!gltf?.scene) return map;
    gltf.scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      if (!originals.has(mesh)) {
        originals.set(
          mesh,
          Array.isArray(mesh.material) ? mesh.material.map((m) => m.clone()) : mesh.material.clone(),
        );
      }
      const partId = mapNameToPartId(mesh.name || mesh.parent?.name || '');
      mesh.userData.partId = partId;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      (map[partId] ||= []).push(mesh);
    });
    return map;
    // We deliberately depend only on gltf.scene so the buckets are stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gltf?.scene]);

  /** Per-theme material overrides: clone original color/roughness, but tint per palette. */
  useEffect(() => {
    if (!gltf?.scene) return;
    const isBlueprint = theme === 'blueprint';
    gltf.scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const original = originals.get(mesh);
      const apply = (target: THREE.Material, src?: THREE.Material) => {
        const std = target as THREE.MeshStandardMaterial;
        const orig = src as THREE.MeshStandardMaterial | undefined;
        if (isBlueprint) {
          if (std.color && orig?.color) std.color.copy(orig.color).multiplyScalar(0.25).offsetHSL(0, 0, -0.3);
          std.emissive?.set(palette.outline);
          std.emissiveIntensity = 0.4;
          std.transparent = true;
          std.opacity = 0.45;
          std.metalness = 0;
          std.roughness = 1;
        } else {
          if (orig) {
            if (std.color && orig.color) std.color.copy(orig.color);
            std.emissive?.set('#000');
            std.emissiveIntensity = 0;
            std.transparent = orig.transparent;
            std.opacity = orig.opacity;
            std.metalness = orig.metalness ?? 0.5;
            std.roughness = orig.roughness ?? 0.6;
          }
          if (theme === 'cinematic' && std.color) std.color.multiplyScalar(0.85);
        }
        std.needsUpdate = true;
      };
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m, i) => {
          const o = Array.isArray(original) ? original[i] : original;
          apply(m, o as THREE.Material);
        });
      } else if (mesh.material) {
        apply(mesh.material, Array.isArray(original) ? original[0] : (original as THREE.Material));
      }
    });
  }, [gltf?.scene, theme, palette.outline, originals]);

  // Auto-fit: scale and position so the model sits on the ground at origin.
  const fit = useMemo(() => {
    if (!gltf?.scene) return { scale: 1, offset: new THREE.Vector3() };
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const targetLen = 6.0; // matches the procedural model
    const scale = size.x > 0 ? targetLen / size.x : 1;
    return {
      scale,
      offset: new THREE.Vector3(-center.x, -box.min.y, -center.z),
    };
  }, [gltf?.scene]);

  return (
    <group ref={rootRef} scale={fit.scale} position={fit.offset.toArray()}>
      {/* Render PartGroup wrappers for each bucket so hover/click work. */}
      {Object.entries(buckets).map(([partId, meshes]) => (
        <PartGroup id={partId} key={partId}>
          <GltfBucket meshes={meshes} />
        </PartGroup>
      ))}
    </group>
  );
}

function GltfBucket({ meshes }: { meshes: THREE.Object3D[] }) {
  // Re-parent the actual mesh objects under this group via primitive.
  return (
    <>
      {meshes.map((m, i) => (
        <primitive key={i} object={m} />
      ))}
    </>
  );
}

