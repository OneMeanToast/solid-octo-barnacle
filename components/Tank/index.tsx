'use client';

import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

import { Hull } from './Hull';
import { Turret } from './Turret';
import { MainGun } from './MainGun';
import { Tracks } from './Tracks';
import { ERA } from './ERA';
import { EngineDeck } from './EngineDeck';
import { Cupola } from './Cupola';
import { MachineGun } from './MachineGun';
import { SmokeLaunchers } from './SmokeLaunchers';
import { Optics } from './Optics';
import { DriverStation } from './DriverStation';
import { Autoloader } from './Autoloader';
import { AmmoStorage } from './AmmoStorage';
import { FireControl } from './FireControl';

import { useExplorer } from '@/lib/store';
import { inPhase, localPhaseProgress, phaseAt } from '@/vehicles/t72/timeline';
import { ExhaustSmoke } from '@/components/Particles/ExhaustSmoke';
import { TrackDust } from '@/components/Particles/TrackDust';
import { MuzzleFlash } from '@/components/Particles/MuzzleFlash';

/**
 * Top-level T-72 assembly.
 *  - Hull stays grounded (mild bob during maneuver).
 *  - Turret yaws on Y, then the gun pitches on Z.
 *  - Recoil during Engage pulls the barrel back.
 */
export function Tank() {
  const root = useRef<THREE.Group>(null!);
  const turretYaw = useRef<THREE.Group>(null!);
  const gunPitch = useRef<THREE.Group>(null!);
  const gunRecoil = useRef<THREE.Group>(null!);
  const lastFireFrac = useRef(-1);

  useFrame(() => {
    const { progress } = useExplorer.getState();
    const t = performance.now() / 1000;

    // ------------- root motion (forward drive in Maneuver) -------------
    if (root.current) {
      let xOffset = 0;
      let bob = 0;
      if (inPhase(progress, 'maneuver')) {
        const local = localPhaseProgress(progress, phaseAt(progress));
        // s-curve: out and back
        xOffset = Math.sin(local * Math.PI) * 0.7;
        bob = Math.sin(local * Math.PI * 12) * 0.015 * Math.sin(local * Math.PI);
      }
      root.current.position.x = xOffset;
      root.current.position.y = bob;
    }

    // ------------- turret yaw (Aim phase) -------------
    if (turretYaw.current) {
      let yaw = 0;
      if (inPhase(progress, 'aim')) {
        const local = localPhaseProgress(progress, phaseAt(progress));
        yaw = Math.sin(local * Math.PI) * 0.55; // ~32°
      } else if (inPhase(progress, 'engage') || inPhase(progress, 'maneuver')) {
        yaw = 0.55;
      }
      // smooth toward target
      turretYaw.current.rotation.y = THREE.MathUtils.lerp(
        turretYaw.current.rotation.y,
        yaw,
        0.07,
      );
    }

    // ------------- gun pitch (Aim phase, then hold) -------------
    if (gunPitch.current) {
      let pitch = 0;
      if (inPhase(progress, 'aim')) {
        const local = localPhaseProgress(progress, phaseAt(progress));
        pitch = -Math.sin(local * Math.PI) * 0.18; // negative = elevate
      } else if (inPhase(progress, 'engage')) {
        pitch = -0.18;
      } else if (inPhase(progress, 'maneuver')) {
        pitch = -0.14;
      }
      gunPitch.current.rotation.z = THREE.MathUtils.lerp(
        gunPitch.current.rotation.z,
        pitch,
        0.07,
      );
    }

    // ------------- gun recoil pulses (Engage phase, periodic) -------------
    if (gunRecoil.current) {
      let recoil = 0;
      if (inPhase(progress, 'engage')) {
        const local = localPhaseProgress(progress, phaseAt(progress));
        // 3 shots across the engage window
        const shots = 3;
        const slot = local * shots;
        const within = slot - Math.floor(slot);
        // recoil curve: instant kick, exponential settle
        if (within < 0.2) {
          recoil = -within / 0.2; // -1 to 0 kicked back
          recoil = -1 + within / 0.2;
          recoil = -(1 - within / 0.2);
        } else {
          recoil = -Math.exp(-(within - 0.2) * 8);
        }
        // detect rising edge for muzzle flash
        const slotIdx = Math.floor(slot);
        if (slotIdx !== lastFireFrac.current && within < 0.05) {
          lastFireFrac.current = slotIdx;
          // notify muzzle flash via custom event
          window.dispatchEvent(new CustomEvent('t72:fire'));
        }
      } else {
        lastFireFrac.current = -1;
      }
      gunRecoil.current.position.x = THREE.MathUtils.lerp(
        gunRecoil.current.position.x,
        recoil * 0.32,
        0.45,
      );
    }
    void t;
  });

  return (
    <group ref={root}>
      {/* Static, hull-bound parts */}
      <Hull />
      <Tracks />
      <EngineDeck />
      <DriverStation />
      <AmmoStorage />

      {/* ERA — split: glacis blocks move with hull, turret blocks with turret. */}
      <ERA />

      {/* Particle systems anchored on the hull */}
      <ExhaustSmoke position={[-2.7, 1.0, 1.0]} />
      <TrackDust />

      {/* Turret subtree (yaw) — sits at hull top */}
      <group position={[0.0, 1.05, 0]} ref={turretYaw}>
        <Turret>
          <Cupola />
          <MachineGun />
          <SmokeLaunchers />
          <Optics />
          <FireControl />

          {/* Gun pitches on Z — origin at trunnion */}
          <group ref={gunPitch} position={[1.5, 0, 0]}>
            <group ref={gunRecoil}>
              <MainGun />
              {/* Muzzle flash — slightly forward of barrel tip */}
              <MuzzleFlash position={[5.2, 0, 0]} />
            </group>
          </group>

          {/* Autoloader sits below the turret floor */}
          <group position={[-0.05, -0.95, 0]}>
            <Autoloader />
          </group>
        </Turret>
      </group>
    </group>
  );
}
