'use client';

import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
  Noise,
  DepthOfField,
  ToneMapping,
} from '@react-three/postprocessing';
import { BlendFunction, ToneMappingMode } from 'postprocessing';
import { useExplorer } from '@/lib/store';

/** Theme-aware post-processing stack. */
export function PostFX() {
  const theme = useExplorer((s) => s.theme);

  if (theme === 'blueprint') {
    return (
      <EffectComposer multisampling={4}>
        <Bloom
          intensity={0.7}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.4}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.2} darkness={0.6} />
      </EffectComposer>
    );
  }

  if (theme === 'cinematic') {
    return (
      <EffectComposer multisampling={4}>
        <DepthOfField
          focusDistance={0.012}
          focalLength={0.04}
          bokehScale={2.4}
        />
        <Bloom
          intensity={1.1}
          luminanceThreshold={0.25}
          luminanceSmoothing={0.5}
          mipmapBlur
        />
        <ChromaticAberration
          offset={[0.0008, 0.0012]}
          blendFunction={BlendFunction.NORMAL}
          radialModulation={false}
          modulationOffset={0}
        />
        <Vignette eskil={false} offset={0.18} darkness={0.85} />
        <Noise opacity={0.06} blendFunction={BlendFunction.OVERLAY} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    );
  }

  // realistic
  return (
    <EffectComposer multisampling={4}>
      <Bloom
        intensity={0.35}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.4}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.3} darkness={0.4} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}
