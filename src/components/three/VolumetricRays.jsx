import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const RAY_COUNT = 5

export default function VolumetricRays({ scrollProgress = 0, activeScene = 0 }) {
  const groupRef = useRef()

  const rays = useMemo(() => {
    return Array.from({ length: RAY_COUNT }, (_, i) => ({
      rotation: (i / RAY_COUNT) * Math.PI * 2,
      speed: 0.05 + Math.random() * 0.1,
      width: 0.3 + Math.random() * 0.5,
      height: 12 + Math.random() * 6,
      offset: Math.random() * Math.PI * 2,
      baseOpacity: 0.02 + Math.random() * 0.03,
    }))
  }, [])

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0.03 },
        uColor: { value: new THREE.Color(0.75, 0.22, 0.17) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uOpacity;
        uniform vec3 uColor;
        varying vec2 vUv;
        
        void main() {
          // Soft falloff from center
          float centerFade = 1.0 - abs(vUv.x - 0.5) * 2.0;
          centerFade = pow(centerFade, 3.0);
          
          // Fade at top and bottom
          float verticalFade = smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.85, vUv.y);
          
          // Subtle flicker
          float flicker = 0.8 + 0.2 * sin(uTime * 2.0 + vUv.y * 5.0);
          
          float alpha = centerFade * verticalFade * uOpacity * flicker;
          
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    })
  }, [])

  useFrame((state, delta) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime

    // Slowly rotate the whole group
    groupRef.current.rotation.z = t * 0.02

    // Update opacity based on scroll
    const intensity = 0.015 + scrollProgress * 0.025
    shaderMaterial.uniforms.uTime.value = t
    shaderMaterial.uniforms.uOpacity.value = intensity

    // Scene-based color
    if (activeScene === 5) {
      shaderMaterial.uniforms.uColor.value.lerp(new THREE.Color(0.79, 0.66, 0.3), delta * 2)
    } else if (activeScene === 6) {
      shaderMaterial.uniforms.uColor.value.lerp(new THREE.Color(0.15, 0.4, 0.7), delta * 2)
    } else {
      shaderMaterial.uniforms.uColor.value.lerp(new THREE.Color(0.75, 0.22, 0.17), delta * 2)
    }

    // Animate individual rays
    groupRef.current.children.forEach((mesh, i) => {
      const ray = rays[i]
      if (!ray) return
      mesh.rotation.z = ray.rotation + Math.sin(t * ray.speed + ray.offset) * 0.3
      mesh.material.uniforms.uOpacity.value = ray.baseOpacity * (0.6 + 0.4 * Math.sin(t * 0.5 + i))
    })
  })

  return (
    <group ref={groupRef} position={[0, 0, -3]}>
      {rays.map((ray, i) => (
        <mesh key={i} rotation={[0, 0, ray.rotation]}>
          <planeGeometry args={[ray.width, ray.height]} />
          <primitive object={shaderMaterial.clone()} attach="material" />
        </mesh>
      ))}
    </group>
  )
}
