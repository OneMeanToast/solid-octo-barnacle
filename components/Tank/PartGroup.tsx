'use client';

import { useRef, useMemo, useEffect, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { ThreeEvent } from '@react-three/fiber';
import { useExplorer } from '@/lib/store';
import { PALETTE } from '@/lib/theme';

type Props = {
  id: string;
  children: React.ReactNode;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number] | number;
};

/**
 * Wraps a sub-tree of meshes so it behaves as one selectable, hoverable part.
 * Applies an outline / emissive boost when hovered or selected.
 */
export const PartGroup = forwardRef<THREE.Group, Props>(function PartGroup(
  { id, children, position, rotation, scale },
  ref,
) {
  const localRef = useRef<THREE.Group>(null!);
  useImperativeHandle(ref, () => localRef.current);

  const setHovered = useExplorer((s) => s.setHoveredPart);
  const setSelected = useExplorer((s) => s.setSelectedPart);
  const hovered = useExplorer((s) => s.hoveredPart === id);
  const selected = useExplorer((s) => s.selectedPart === id);
  const theme = useExplorer((s) => s.theme);
  const palette = PALETTE[theme];

  // Cache original material colors so we can restore after hover
  const originals = useRef<WeakMap<THREE.Mesh, { color?: THREE.Color; emissive?: THREE.Color; emissiveIntensity?: number }>>(
    new WeakMap(),
  );

  useEffect(() => {
    const grp = localRef.current;
    if (!grp) return;
    grp.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const m of mats) {
        const std = m as THREE.MeshStandardMaterial;
        if (!originals.current.has(mesh)) {
          originals.current.set(mesh, {
            color: std.color?.clone(),
            emissive: std.emissive?.clone(),
            emissiveIntensity: std.emissiveIntensity ?? 0,
          });
        }
        if (selected) {
          std.emissive?.set(palette.selectOutline);
          std.emissiveIntensity = 0.55;
        } else if (hovered) {
          std.emissive?.set(palette.hoverOutline);
          std.emissiveIntensity = 0.35;
        } else {
          const orig = originals.current.get(mesh);
          if (orig) {
            std.emissive?.copy(orig.emissive ?? new THREE.Color(0, 0, 0));
            std.emissiveIntensity = orig.emissiveIntensity ?? 0;
          }
        }
        std.needsUpdate = true;
      }
    });
  }, [hovered, selected, palette.hoverOutline, palette.selectOutline, theme]);

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
    const p = e.point;
    setHovered(id, [p.x, p.y, p.z]);
  };
  const onOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = 'auto';
    setHovered(null, null);
  };
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setSelected(id);
  };

  const scaleVec = useMemo<[number, number, number]>(() => {
    if (typeof scale === 'number') return [scale, scale, scale];
    return scale ?? [1, 1, 1];
  }, [scale]);

  return (
    <group
      ref={localRef}
      position={position}
      rotation={rotation}
      scale={scaleVec}
      onPointerOver={onOver}
      onPointerOut={onOut}
      onClick={onClick}
      userData={{ partId: id }}
    >
      {children}
    </group>
  );
});
