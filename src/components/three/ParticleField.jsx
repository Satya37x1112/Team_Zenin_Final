import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 2000

// Scene-based color palettes
const SCENE_COLORS = {
  0: { primary: [0.75, 0.22, 0.17], secondary: [1, 1, 1] },     // Hero: red + white
  1: { primary: [0.75, 0.22, 0.17], secondary: [0.8, 0.6, 0.2] }, // Legacy: red + gold
  2: { primary: [0.9, 0.15, 0.1], secondary: [1, 0.3, 0.1] },    // Evolution: bright red
  3: { primary: [0.75, 0.22, 0.17], secondary: [0.6, 0.6, 0.7] }, // Showcase: red + silver
  4: { primary: [0.75, 0.22, 0.17], secondary: [1, 0.85, 0.3] },  // Exploded: red + gold
  5: { primary: [0.79, 0.66, 0.3], secondary: [0.75, 0.22, 0.17] }, // Craft: gold + red
  6: { primary: [0.1, 0.5, 0.8], secondary: [0.75, 0.22, 0.17] },  // Future: blue + red
}

export default function ParticleField({ scrollProgress = 0, activeScene = 0 }) {
  const meshRef = useRef()
  const timeRef = useRef(0)

  const { positions, velocities, sizes, colors, opacities } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const velocities = new Float32Array(PARTICLE_COUNT * 3)
    const sizes = new Float32Array(PARTICLE_COUNT)
    const colors = new Float32Array(PARTICLE_COUNT * 3)
    const opacities = new Float32Array(PARTICLE_COUNT)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      // Spread particles in a wide volume
      positions[i3] = (Math.random() - 0.5) * 20
      positions[i3 + 1] = (Math.random() - 0.5) * 12
      positions[i3 + 2] = (Math.random() - 0.5) * 10

      // Slow upward drift with random turbulence
      velocities[i3] = (Math.random() - 0.5) * 0.003
      velocities[i3 + 1] = 0.002 + Math.random() * 0.005
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.002

      sizes[i] = 0.01 + Math.random() * 0.04
      opacities[i] = Math.random()

      // Mix of red embers and white dust
      if (Math.random() > 0.6) {
        colors[i3] = 0.75
        colors[i3 + 1] = 0.22
        colors[i3 + 2] = 0.17
      } else {
        const v = 0.5 + Math.random() * 0.5
        colors[i3] = v
        colors[i3 + 1] = v
        colors[i3 + 2] = v
      }
    }

    return { positions, velocities, sizes, colors, opacities }
  }, [])

  // Custom shader material
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uScrollProgress: { value: 0 },
        uPrimaryColor: { value: new THREE.Vector3(0.75, 0.22, 0.17) },
        uSecondaryColor: { value: new THREE.Vector3(1, 1, 1) },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: `
        attribute float aSize;
        attribute float aOpacity;
        attribute vec3 aColor;
        
        uniform float uTime;
        uniform float uScrollProgress;
        uniform float uPixelRatio;
        
        varying float vOpacity;
        varying vec3 vColor;
        
        void main() {
          vec3 pos = position;
          
          // Turbulence
          pos.x += sin(uTime * 0.3 + position.y * 2.0) * 0.15;
          pos.y += cos(uTime * 0.2 + position.x * 1.5) * 0.1;
          pos.z += sin(uTime * 0.15 + position.z * 2.5) * 0.08;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          
          gl_PointSize = aSize * uPixelRatio * 300.0 / -mvPosition.z;
          gl_PointSize = max(gl_PointSize, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          // Fade based on depth
          float depth = smoothstep(-8.0, 2.0, mvPosition.z);
          vOpacity = aOpacity * depth * (0.3 + uScrollProgress * 0.3);
          vColor = aColor;
        }
      `,
      fragmentShader: `
        varying float vOpacity;
        varying vec3 vColor;
        
        void main() {
          // Soft circle
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          alpha *= vOpacity;
          
          // Subtle glow
          vec3 color = vColor + 0.1 * (1.0 - dist * 2.0);
          
          gl_FragColor = vec4(color, alpha * 0.6);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  }, [])

  useFrame((state, delta) => {
    if (!meshRef.current) return
    timeRef.current += delta

    const geo = meshRef.current.geometry
    const posAttr = geo.attributes.position
    const posArray = posAttr.array

    // Update particle positions
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      posArray[i3] += velocities[i3] + Math.sin(timeRef.current * 0.5 + i * 0.1) * 0.001
      posArray[i3 + 1] += velocities[i3 + 1]
      posArray[i3 + 2] += velocities[i3 + 2]

      // Reset particles that drift too far
      if (posArray[i3 + 1] > 7) {
        posArray[i3 + 1] = -7
        posArray[i3] = (Math.random() - 0.5) * 20
        posArray[i3 + 2] = (Math.random() - 0.5) * 10
      }
    }
    posAttr.needsUpdate = true

    // Update uniforms
    shaderMaterial.uniforms.uTime.value = timeRef.current
    shaderMaterial.uniforms.uScrollProgress.value = scrollProgress

    // Interpolate colors based on scene
    const colors = SCENE_COLORS[activeScene] || SCENE_COLORS[0]
    const uPrimary = shaderMaterial.uniforms.uPrimaryColor.value
    const uSecondary = shaderMaterial.uniforms.uSecondaryColor.value
    uPrimary.lerp(new THREE.Vector3(...colors.primary), delta * 2)
    uSecondary.lerp(new THREE.Vector3(...colors.secondary), delta * 2)
  })

  return (
    <points ref={meshRef} material={shaderMaterial}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={PARTICLE_COUNT}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aOpacity"
          count={PARTICLE_COUNT}
          array={opacities}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aColor"
          count={PARTICLE_COUNT}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
    </points>
  )
}
