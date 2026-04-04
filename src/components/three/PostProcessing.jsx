import React, { useMemo } from 'react'
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
  Noise,
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

export default function PostProcessing({ scrollProgress = 0, activeScene = 0 }) {
  // Dynamic intensity based on scene
  const bloomIntensity = useMemo(() => {
    const base = 0.3
    // Stronger bloom in hero and future scenes
    if (activeScene === 0 || activeScene === 6) return base + 0.2
    // Medium in evolution
    if (activeScene === 2) return base + 0.1
    return base
  }, [activeScene])

  const chromaticOffset = useMemo(() => {
    // Slight chromatic aberration, stronger in future scene
    if (activeScene === 6) return new THREE.Vector2(0.003, 0.003)
    return new THREE.Vector2(0.0008, 0.0008)
  }, [activeScene])

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={bloomIntensity}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.9}
        mipmapBlur
        radius={0.8}
      />
      <Vignette
        offset={0.25}
        darkness={0.7}
        blendFunction={BlendFunction.NORMAL}
      />
      <ChromaticAberration
        offset={chromaticOffset}
        blendFunction={BlendFunction.NORMAL}
        radialModulation
        modulationOffset={0.5}
      />
      <Noise
        premultiply
        blendFunction={BlendFunction.SOFT_LIGHT}
        opacity={0.15}
      />
    </EffectComposer>
  )
}
