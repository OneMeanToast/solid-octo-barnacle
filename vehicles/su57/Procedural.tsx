'use client';

import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { PartGroup } from '@/components/Tank/PartGroup';
import { useJetMaterials } from './materials';
import { useExplorer } from '@/lib/store';
import { SU57_PHASES } from './phases';
import { inPhase, localPhaseProgress, phaseAt } from '@/lib/types';

/**
 * A stylized procedural Su-57 silhouette used as a fallback when the
 * GLTF model isn't present. All major subsystems are individually
 * selectable — when the real model loads, this is unmounted in favor
 * of the imported asset.
 */
export function Su57Procedural() {
  const M = useJetMaterials();
  const root = useRef<THREE.Group>(null!);
  const gearRef = useRef<THREE.Group>(null!);
  const mainBayDoorL = useRef<THREE.Group>(null!);
  const mainBayDoorR = useRef<THREE.Group>(null!);
  const sideBayDoorL = useRef<THREE.Group>(null!);
  const sideBayDoorR = useRef<THREE.Group>(null!);
  const noseRef = useRef<THREE.Group>(null!);
  const levconRef = useRef<THREE.Group[]>([]);
  const stabRef = useRef<THREE.Group[]>([]);
  const nozzlePitch = useRef<THREE.Group[]>([]);

  useFrame((_, dt) => {
    const { progress } = useExplorer.getState();

    // ---- vertical bob + heading sweep during taxi/takeoff ----
    if (root.current) {
      let lift = 0;
      let pitch = 0;
      if (inPhase(progress, SU57_PHASES, 'takeoff')) {
        const local = localPhaseProgress(progress, phaseAt(progress, SU57_PHASES));
        lift = Math.max(0, local - 0.3) * 1.6;
        pitch = -Math.sin(local * Math.PI) * 0.18;
      } else if (inPhase(progress, SU57_PHASES, 'engage')) {
        lift = 1.6;
        const local = localPhaseProgress(progress, phaseAt(progress, SU57_PHASES));
        pitch = Math.sin(local * Math.PI * 1.4) * 0.06;
      } else if (inPhase(progress, SU57_PHASES, 'rtb')) {
        const local = localPhaseProgress(progress, phaseAt(progress, SU57_PHASES));
        lift = 1.6 * (1 - local);
        pitch = -0.05 * (1 - local);
      }
      root.current.position.y = THREE.MathUtils.lerp(root.current.position.y, lift, 0.06);
      root.current.rotation.z = THREE.MathUtils.lerp(root.current.rotation.z, pitch, 0.06);
    }

    // ---- gear retract during takeoff, deploy during RTB ----
    if (gearRef.current) {
      let down = 1;
      if (inPhase(progress, SU57_PHASES, 'takeoff')) {
        const local = localPhaseProgress(progress, phaseAt(progress, SU57_PHASES));
        down = THREE.MathUtils.clamp(1 - (local - 0.5) * 3, 0, 1);
      } else if (inPhase(progress, SU57_PHASES, 'engage')) {
        down = 0;
      } else if (inPhase(progress, SU57_PHASES, 'rtb')) {
        const local = localPhaseProgress(progress, phaseAt(progress, SU57_PHASES));
        down = THREE.MathUtils.clamp((local - 0.3) * 2, 0, 1);
      }
      gearRef.current.scale.y = THREE.MathUtils.lerp(gearRef.current.scale.y, down, 0.1);
      gearRef.current.visible = gearRef.current.scale.y > 0.02;
    }

    // ---- weapons bay doors during engage ----
    let bay = 0;
    if (inPhase(progress, SU57_PHASES, 'engage')) {
      const local = localPhaseProgress(progress, phaseAt(progress, SU57_PHASES));
      bay = Math.sin(local * Math.PI);
    }
    if (mainBayDoorL.current) mainBayDoorL.current.rotation.x = -bay * 0.9;
    if (mainBayDoorR.current) mainBayDoorR.current.rotation.x = bay * 0.9;
    if (sideBayDoorL.current) sideBayDoorL.current.rotation.z = bay * 0.7;
    if (sideBayDoorR.current) sideBayDoorR.current.rotation.z = -bay * 0.7;

    // ---- gentle aerosurface flutter ----
    const t = performance.now() * 0.002;
    const flying =
      inPhase(progress, SU57_PHASES, 'takeoff') ||
      inPhase(progress, SU57_PHASES, 'engage') ||
      inPhase(progress, SU57_PHASES, 'rtb');
    levconRef.current.forEach((l, i) => {
      if (l) l.rotation.y = (Math.sin(t + i) * 0.05) * (flying ? 1 : 0.2);
    });
    stabRef.current.forEach((l, i) => {
      if (l) l.rotation.x = Math.sin(t * 1.3 + i) * 0.05 * (flying ? 1 : 0.2);
    });
    nozzlePitch.current.forEach((n, i) => {
      if (n) n.rotation.z = Math.sin(t * 0.7 + i) * 0.08 * (flying ? 1 : 0);
    });
    void dt;
  });

  return (
    <group ref={root} position={[0, 0.55, 0]}>
      {/* ---------- AIRFRAME ---------- */}
      <PartGroup id="airframe">
        {/* Center fuselage spine */}
        <mesh castShadow receiveShadow material={M.skin}>
          <boxGeometry args={[5.4, 0.55, 1.05]} />
        </mesh>
        {/* Forward fuselage taper */}
        <mesh
          ref={(el) => {
            noseRef.current = el as unknown as THREE.Group;
          }}
          position={[2.2, 0.05, 0]}
          castShadow
          material={M.skin}
        >
          <boxGeometry args={[1.3, 0.45, 0.85]} />
        </mesh>
        {/* Nose cone */}
        <mesh position={[3.0, 0.05, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow material={M.radome}>
          <coneGeometry args={[0.4, 0.9, 22]} />
        </mesh>
        {/* Spine fairing (between fins) */}
        <mesh position={[-1.6, 0.35, 0]} castShadow material={M.skin}>
          <boxGeometry args={[1.6, 0.2, 0.55]} />
        </mesh>
        {/* Lower belly between engines */}
        <mesh position={[-1.0, -0.25, 0]} castShadow material={M.dark}>
          <boxGeometry args={[2.6, 0.18, 0.9]} />
        </mesh>
      </PartGroup>

      {/* ---------- COCKPIT ---------- */}
      <PartGroup id="cockpit" position={[1.65, 0.4, 0]}>
        {/* Tub */}
        <mesh material={M.dark} castShadow>
          <boxGeometry args={[0.85, 0.18, 0.55]} />
        </mesh>
        {/* Seat hint */}
        <mesh position={[-0.05, 0.12, 0]} material={M.metal} castShadow>
          <boxGeometry args={[0.18, 0.18, 0.22]} />
        </mesh>
        {/* HUD bracket */}
        <mesh position={[0.3, 0.2, 0]} material={M.metal} castShadow>
          <boxGeometry args={[0.06, 0.12, 0.18]} />
        </mesh>
      </PartGroup>

      {/* ---------- CANOPY ---------- */}
      <PartGroup id="canopy" position={[1.5, 0.55, 0]}>
        <mesh castShadow material={M.canopy}>
          <sphereGeometry args={[0.42, 22, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
        <mesh position={[-0.2, 0.0, 0]} castShadow material={M.canopy} scale={[1.4, 0.9, 1]}>
          <sphereGeometry args={[0.32, 22, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
      </PartGroup>

      {/* ---------- RADAR ---------- */}
      <PartGroup id="radar" position={[2.85, 0.05, 0]}>
        {/* AESA face hint */}
        <mesh rotation={[0, 0, Math.PI / 2]} material={M.metal} castShadow>
          <cylinderGeometry args={[0.32, 0.32, 0.05, 24]} />
        </mesh>
        {Array.from({ length: 6 }).map((_, i) =>
          Array.from({ length: 6 }).map((_, j) => (
            <mesh
              key={`${i}-${j}`}
              position={[0.03, -0.22 + i * 0.07, -0.22 + j * 0.07]}
              material={M.dark}
            >
              <boxGeometry args={[0.005, 0.05, 0.05]} />
            </mesh>
          )),
        )}
      </PartGroup>

      {/* ---------- IRST ---------- */}
      <PartGroup id="irst" position={[1.95, 0.55, 0.1]}>
        <mesh material={M.metal} castShadow>
          <sphereGeometry args={[0.12, 18, 14]} />
        </mesh>
        <mesh position={[0.07, 0, 0]} material={M.canopy}>
          <sphereGeometry args={[0.06, 14, 10]} />
        </mesh>
      </PartGroup>

      {/* ---------- WINGS (with LEVCONs) ---------- */}
      <PartGroup id="wings">
        {[1, -1].map((side) => (
          <group key={side}>
            {/* Main wing — angled trapezoid via box rotation */}
            <mesh
              position={[-0.1, 0.05, side * 1.4]}
              rotation={[0, side * 0.0, 0]}
              castShadow
              receiveShadow
              material={M.skin}
            >
              <boxGeometry args={[2.4, 0.1, 1.7]} />
            </mesh>
            {/* Wing leading-edge sweep — small triangular fillet */}
            <mesh
              position={[1.0, 0.06, side * 1.0]}
              rotation={[0, side * Math.PI / 8, 0]}
              castShadow
              material={M.skin}
            >
              <boxGeometry args={[0.9, 0.08, 0.7]} />
            </mesh>
            {/* LEVCON */}
            <group
              ref={(el) => {
                if (el) levconRef.current[side === 1 ? 0 : 1] = el;
              }}
              position={[1.5, 0.07, side * 0.55]}
            >
              <mesh castShadow material={M.skin}>
                <boxGeometry args={[0.55, 0.06, 0.45]} />
              </mesh>
            </group>
            {/* Wingtip pod */}
            <mesh
              position={[-0.4, 0.12, side * 2.3]}
              castShadow
              material={M.metal}
            >
              <boxGeometry args={[0.55, 0.12, 0.18]} />
            </mesh>
          </group>
        ))}
      </PartGroup>

      {/* ---------- TAIL (canted vertical stabs + horizontal stabs) ---------- */}
      <PartGroup id="tail">
        {[1, -1].map((side) => (
          <group key={side}>
            {/* Vertical stab — canted outward */}
            <mesh
              position={[-2.1, 0.7, side * 0.65]}
              rotation={[0, 0, side * 0.45]}
              castShadow
              material={M.skin}
            >
              <boxGeometry args={[0.9, 0.95, 0.06]} />
            </mesh>
            {/* Stab tip */}
            <mesh
              position={[-2.4, 1.18, side * 0.95]}
              rotation={[0, 0, side * 0.45]}
              material={M.metal}
            >
              <boxGeometry args={[0.18, 0.08, 0.04]} />
            </mesh>
            {/* Horizontal stabilator (all-moving) */}
            <group
              ref={(el) => {
                if (el) stabRef.current[side === 1 ? 0 : 1] = el;
              }}
              position={[-2.3, 0.05, side * 1.05]}
            >
              <mesh castShadow material={M.skin}>
                <boxGeometry args={[1.0, 0.06, 0.85]} />
              </mesh>
            </group>
          </group>
        ))}
      </PartGroup>

      {/* ---------- ENGINES ---------- */}
      <PartGroup id="engines">
        {[1, -1].map((side) => (
          <group key={side} position={[-2.2, 0, side * 0.35]}>
            {/* Engine nacelle */}
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow material={M.dark}>
              <cylinderGeometry args={[0.28, 0.28, 1.6, 22]} />
            </mesh>
            {/* Inlet fairing forward */}
            <mesh
              position={[0.95, 0, 0]}
              rotation={[0, 0, Math.PI / 2]}
              castShadow
              material={M.skin}
            >
              <cylinderGeometry args={[0.3, 0.32, 0.6, 22]} />
            </mesh>
          </group>
        ))}
      </PartGroup>

      {/* ---------- TVC NOZZLES ---------- */}
      <PartGroup id="nozzles">
        {[1, -1].map((side) => (
          <group
            key={side}
            ref={(el) => {
              if (el) nozzlePitch.current[side === 1 ? 0 : 1] = el;
            }}
            position={[-3.05, 0, side * 0.35]}
          >
            {/* Nozzle ring */}
            <mesh rotation={[0, 0, Math.PI / 2]} material={M.nozzle} castShadow>
              <cylinderGeometry args={[0.26, 0.22, 0.42, 22]} />
            </mesh>
            {/* Petals */}
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2;
              return (
                <mesh
                  key={i}
                  position={[-0.25, Math.sin(a) * 0.22, Math.cos(a) * 0.22]}
                  rotation={[a, 0, 0]}
                  material={M.nozzle}
                >
                  <boxGeometry args={[0.22, 0.05, 0.05]} />
                </mesh>
              );
            })}
          </group>
        ))}
      </PartGroup>

      {/* ---------- MAIN WEAPONS BAYS ---------- */}
      <PartGroup id="main-bay">
        {/* Bay cavity (hint) */}
        <mesh position={[-0.2, -0.4, 0]} material={M.dark}>
          <boxGeometry args={[2.4, 0.12, 0.85]} />
        </mesh>
        {/* Doors — pivot along their inboard edge */}
        <group ref={mainBayDoorL} position={[-0.2, -0.32, -0.42]}>
          <mesh castShadow material={M.skin} position={[0, 0, -0.21]}>
            <boxGeometry args={[2.4, 0.04, 0.42]} />
          </mesh>
        </group>
        <group ref={mainBayDoorR} position={[-0.2, -0.32, 0.42]}>
          <mesh castShadow material={M.skin} position={[0, 0, 0.21]}>
            <boxGeometry args={[2.4, 0.04, 0.42]} />
          </mesh>
        </group>
        {/* Stowed missile (R-77M proxy) */}
        <mesh position={[-0.2, -0.55, 0]} rotation={[0, 0, Math.PI / 2]} material={M.metal}>
          <cylinderGeometry args={[0.06, 0.06, 1.6, 12]} />
        </mesh>
      </PartGroup>

      {/* ---------- SIDE BAYS ---------- */}
      <PartGroup id="side-bays">
        {[1, -1].map((side) => (
          <group key={side}>
            <mesh
              position={[0.6, 0.0, side * 0.78]}
              material={M.dark}
            >
              <boxGeometry args={[1.0, 0.18, 0.18]} />
            </mesh>
            <group
              ref={side === 1 ? sideBayDoorL : sideBayDoorR}
              position={[0.6, 0.0, side * 0.88]}
            >
              <mesh castShadow material={M.skin} position={[0, 0, side * 0.04]}>
                <boxGeometry args={[1.0, 0.18, 0.04]} />
              </mesh>
            </group>
            {/* Stowed SRAAM */}
            <mesh
              position={[0.6, -0.02, side * 0.78]}
              rotation={[0, 0, Math.PI / 2]}
              material={M.metal}
            >
              <cylinderGeometry args={[0.04, 0.04, 1.0, 10]} />
            </mesh>
          </group>
        ))}
      </PartGroup>

      {/* ---------- LANDING GEAR ---------- */}
      <group ref={gearRef}>
        <PartGroup id="gear">
          {/* Nose gear */}
          <group position={[2.0, -0.3, 0]}>
            <mesh material={M.metal}>
              <boxGeometry args={[0.05, 0.5, 0.05]} />
            </mesh>
            <mesh position={[0, -0.3, 0]} rotation={[Math.PI / 2, 0, 0]} material={M.dark}>
              <cylinderGeometry args={[0.12, 0.12, 0.16, 14]} />
            </mesh>
          </group>
          {/* Main gear */}
          {[1, -1].map((side) => (
            <group key={side} position={[0.0, -0.3, side * 0.55]}>
              <mesh material={M.metal}>
                <boxGeometry args={[0.05, 0.55, 0.05]} />
              </mesh>
              <mesh position={[0, -0.32, 0]} rotation={[Math.PI / 2, 0, 0]} material={M.dark}>
                <cylinderGeometry args={[0.16, 0.16, 0.18, 14]} />
              </mesh>
            </group>
          ))}
        </PartGroup>
      </group>

      {/* ---------- EW (panels at fin caps) ---------- */}
      <PartGroup id="ew">
        {[1, -1].map((side) => (
          <mesh
            key={side}
            position={[-2.4, 1.18, side * 0.95]}
            rotation={[0, 0, side * 0.45]}
            material={M.metal}
          >
            <boxGeometry args={[0.16, 0.06, 0.05]} />
          </mesh>
        ))}
        {/* Wingtip pods already provide the visual */}
      </PartGroup>
    </group>
  );
}
