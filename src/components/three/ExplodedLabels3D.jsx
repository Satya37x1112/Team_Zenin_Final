import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Connection points — positioned in 3D space to overlay on the exploded view
const LABEL_POSITIONS = [
  { id: 'engine', position: [2.5, 1.5, 0], label: '01' },
  { id: 'chassis', position: [0, -1.2, 0], label: '02' },
  { id: 'aero', position: [-2, 1.8, 0], label: '03' },
  { id: 'suspension', position: [3, -0.5, 0], label: '04' },
  { id: 'brakes', position: [-1.5, -1.8, 0], label: '05' },
  { id: 'interior', position: [0.5, 0.8, 0], label: '06' },
]

function LabelConnector({ position, isActive, scrollProgress, time }) {
  const groupRef = useRef()
  const lineRef = useRef()

  const lineMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: isActive ? new THREE.Color(0.9, 0.2, 0.15) : new THREE.Color(0.4, 0.4, 0.4),
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  }, [isActive])

  const dotMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(0.9, 0.2, 0.15),
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  }, [])

  const ringMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(0.75, 0.22, 0.17),
      transparent: true,
      opacity: 0.2,
      wireframe: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  }, [])

  // Animated line from dot to offset
  const lineGeometry = useMemo(() => {
    const points = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-0.8, 0.5, 0),
    ]
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [])

  useFrame(() => {
    if (!groupRef.current) return

    // Subtle float animation
    groupRef.current.position.y = position[1] + Math.sin(time + position[0]) * 0.05

    // Pulse the dot
    const pulse = 0.5 + 0.5 * Math.sin(time * 2 + position[0] * 3)
    dotMaterial.opacity = isActive ? 0.8 : 0.3 + pulse * 0.2
    ringMaterial.opacity = isActive ? 0.4 : 0.1 + pulse * 0.1

    // Scale ring on active
    const targetScale = isActive ? 1.5 : 1
    if (groupRef.current.children[2]) {
      groupRef.current.children[2].scale.setScalar(
        THREE.MathUtils.lerp(groupRef.current.children[2].scale.x, targetScale, 0.1)
      )
    }

    // Line visibility
    lineMaterial.opacity = isActive ? 0.5 : 0.15
    lineMaterial.color.lerp(
      isActive ? new THREE.Color(0.9, 0.2, 0.15) : new THREE.Color(0.3, 0.3, 0.3),
      0.1
    )
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Center dot */}
      <mesh material={dotMaterial}>
        <sphereGeometry args={[0.04, 16, 16]} />
      </mesh>

      {/* Connector line */}
      <line geometry={lineGeometry} material={lineMaterial} />

      {/* Pulsing ring */}
      <mesh material={ringMaterial} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.08, 0.12, 32]} />
      </mesh>
    </group>
  )
}

export default function ExplodedLabels3D({ scrollProgress = 0, activeScene = 0, activeComponent = null }) {
  const groupRef = useRef()
  const timeRef = useRef(0)

  // Only show in exploded section
  const isExploded = activeScene === 4

  useFrame((state, delta) => {
    if (!groupRef.current) return
    timeRef.current = state.clock.elapsedTime

    // Fade in/out
    const targetOpacity = isExploded ? 1 : 0
    groupRef.current.visible = isExploded || groupRef.current.children.some(
      c => c.material && c.material.opacity > 0.01
    )
  })

  if (!isExploded) return null

  return (
    <group ref={groupRef} position={[0, 0, -1]}>
      {LABEL_POSITIONS.map((label, i) => (
        <LabelConnector
          key={label.id}
          position={label.position}
          isActive={activeComponent === i}
          scrollProgress={scrollProgress}
          time={timeRef.current}
        />
      ))}
    </group>
  )
}
