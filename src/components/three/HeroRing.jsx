import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function HeroRing({ scrollProgress = 0, activeScene = 0 }) {
  const ringRef = useRef()
  const ring2Ref = useRef()
  const ring3Ref = useRef()

  const emissiveMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(0.75, 0.15, 0.1),
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  }, [])

  const wireframeMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(0.8, 0.25, 0.15),
      transparent: true,
      opacity: 0.08,
      wireframe: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  }, [])

  const accentMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(1, 0.85, 0.3),
      transparent: true,
      opacity: 0.05,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  }, [])

  useFrame((state) => {
    if (!ringRef.current) return
    const t = state.clock.elapsedTime

    // Only show in hero section (scene 0), fade out in others
    const isHero = activeScene === 0
    const targetOpacity = isHero ? 0.15 : 0
    const targetScale = isHero ? 1 + scrollProgress * 0.5 : 0.5

    // Main ring rotation
    ringRef.current.rotation.x = Math.PI * 0.35 + Math.sin(t * 0.3) * 0.05
    ringRef.current.rotation.y = t * 0.15
    ringRef.current.rotation.z = t * 0.08

    // Scale based on scroll
    const s = THREE.MathUtils.lerp(ringRef.current.scale.x, targetScale, 0.03)
    ringRef.current.scale.setScalar(s)

    // Fade
    emissiveMaterial.opacity = THREE.MathUtils.lerp(emissiveMaterial.opacity, targetOpacity, 0.05)

    // Second ring — counter-rotate
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = Math.PI * 0.5 + Math.sin(t * 0.2) * 0.1
      ring2Ref.current.rotation.y = -t * 0.1
      ring2Ref.current.rotation.z = t * 0.05
      ring2Ref.current.scale.setScalar(s * 1.15)
      wireframeMaterial.opacity = THREE.MathUtils.lerp(wireframeMaterial.opacity, isHero ? 0.08 : 0, 0.05)
    }

    // Third ring — subtle accent
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = Math.PI * 0.3 + Math.cos(t * 0.15) * 0.08
      ring3Ref.current.rotation.y = t * 0.05
      ring3Ref.current.rotation.z = -t * 0.12
      ring3Ref.current.scale.setScalar(s * 1.35)
      accentMaterial.opacity = THREE.MathUtils.lerp(accentMaterial.opacity, isHero ? 0.05 : 0, 0.05)
    }
  })

  return (
    <group position={[0, 0, -2]}>
      {/* Main emissive ring */}
      <mesh ref={ringRef} material={emissiveMaterial}>
        <torusGeometry args={[3.5, 0.015, 32, 128]} />
      </mesh>

      {/* Wireframe ring */}
      <mesh ref={ring2Ref} material={wireframeMaterial}>
        <torusGeometry args={[3.2, 0.008, 16, 64]} />
      </mesh>

      {/* Gold accent ring */}
      <mesh ref={ring3Ref} material={accentMaterial}>
        <torusGeometry args={[4, 0.005, 16, 96]} />
      </mesh>
    </group>
  )
}
