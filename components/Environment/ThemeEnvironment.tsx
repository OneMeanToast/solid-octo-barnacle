'use client';

import * as THREE from 'three';
import { useExplorer } from '@/lib/store';
import { PALETTE } from '@/lib/theme';
import { Stars, Grid, ContactShadows, Sky } from '@react-three/drei';
import { useMemo } from 'react';

/** Per-theme lighting + ground + sky setup. Switching themes preserves camera & timeline. */
export function ThemeEnvironment() {
  const theme = useExplorer((s) => s.theme);
  const palette = PALETTE[theme];

  // Useful in cinematic + blueprint
  const fogColor = useMemo(() => new THREE.Color(palette.fog), [palette.fog]);

  return (
    <>
      <color attach="background" args={[palette.background]} />
      <fog attach="fog" args={[fogColor, palette.fogNear, palette.fogFar]} />

      {/* Ambient + hemisphere */}
      <ambientLight intensity={palette.ambient} />
      <hemisphereLight
        args={[palette.hemisphereTop, palette.hemisphereBottom, 0.5]}
      />

      {/* Key + fill + rim */}
      <directionalLight
        position={[10, 14, 6]}
        intensity={palette.keyIntensity}
        color={palette.keyLight}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.0005}
      />
      <directionalLight
        position={[-8, 6, -10]}
        intensity={palette.fillIntensity}
        color={palette.fillLight}
      />
      <directionalLight
        position={[0, 3, -12]}
        intensity={palette.rimIntensity}
        color={palette.rimLight}
      />

      {/* Sky / Stars per theme */}
      {theme === 'realistic' && (
        <Sky
          distance={450000}
          sunPosition={[10, 14, 6]}
          inclination={0.48}
          azimuth={0.25}
          mieCoefficient={0.012}
          turbidity={4.5}
          rayleigh={1.2}
        />
      )}
      {palette.showStars && (
        <Stars
          radius={120}
          depth={60}
          count={1500}
          factor={3}
          saturation={0}
          fade
          speed={0.4}
        />
      )}

      {/* Ground */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.001, 0]}
        receiveShadow
      >
        <circleGeometry args={[40, 96]} />
        <meshStandardMaterial
          color={palette.groundColor}
          roughness={1}
          metalness={0}
        />
      </mesh>

      {palette.showGroundGrid && (
        <Grid
          position={[0, 0.002, 0]}
          args={[40, 40]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor={palette.outline}
          sectionSize={4}
          sectionThickness={1}
          sectionColor={palette.outline}
          fadeDistance={28}
          fadeStrength={1.4}
          followCamera={false}
          infiniteGrid
        />
      )}

      {/* Contact shadow under tank for grounding (skip in blueprint where ground is grid). */}
      {theme !== 'blueprint' && (
        <ContactShadows
          position={[0, 0.005, 0]}
          opacity={theme === 'cinematic' ? 0.85 : 0.55}
          scale={14}
          blur={2.4}
          far={3}
          resolution={1024}
          color="#000000"
        />
      )}
    </>
  );
}
