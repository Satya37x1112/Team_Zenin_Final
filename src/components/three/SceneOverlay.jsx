import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'

import ParticleField from './ParticleField'
import ExplodedLabels3D from './ExplodedLabels3D'

export default function SceneOverlay({
  scrollProgress = 0,
  activeScene = 0,
  activeComponent = null,
}) {
  return (
    <div className="three-overlay" aria-hidden="true">
      <Canvas
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: false,
        }}
        camera={{
          position: [0, 0, 5],
          fov: 50,
          near: 0.1,
          far: 50,
        }}
        dpr={[1, 1.5]}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <Suspense fallback={null}>
          {/* GPU Particle System */}
          <ParticleField
            scrollProgress={scrollProgress}
            activeScene={activeScene}
          />

          {/* Exploded View 3D Labels */}
          <ExplodedLabels3D
            scrollProgress={scrollProgress}
            activeScene={activeScene}
            activeComponent={activeComponent}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
