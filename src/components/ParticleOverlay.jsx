import React, { useMemo } from 'react'

export default function ParticleOverlay() {
  const particles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: `${Math.random() * 100}%`,
      y: `${80 + Math.random() * 30}%`,
      size: `${1.5 + Math.random() * 3}px`,
      duration: `${8 + Math.random() * 16}s`,
      delay: `${Math.random() * 10}s`,
      driftX: `${-80 + Math.random() * 160}px`,
      driftY: `${-150 - Math.random() * 200}px`,
      color: Math.random() > 0.6
        ? 'rgba(192, 57, 43, 0.35)'
        : `rgba(255, 255, 255, ${0.08 + Math.random() * 0.12})`,
    }))
  }, [])

  return (
    <div className="particle-overlay" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            '--x': p.x,
            '--y': p.y,
            '--size': p.size,
            '--duration': p.duration,
            '--delay': p.delay,
            '--drift-x': p.driftX,
            '--drift-y': p.driftY,
            '--color': p.color,
          }}
        />
      ))}
    </div>
  )
}
