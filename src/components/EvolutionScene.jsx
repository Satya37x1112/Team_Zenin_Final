import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: '1000', suffix: '+', unit: 'HP', label: 'Peak Power' },
  { value: '2.5', suffix: 's', unit: '', label: '0-100 km/h' },
  { value: '350', suffix: '+', unit: '', label: 'Top Speed km/h' },
]

const bars = [
  { label: 'Aerodynamic Efficiency', value: '95%', width: 95 },
  { label: 'Downforce Generation', value: '800 kg', width: 85 },
  { label: 'Power-to-Weight Ratio', value: '1:1', width: 100 },
]

export default function EvolutionScene() {
  const sectionRef = useRef(null)
  const barsRef = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      // Label
      gsap.to('.evolution__label', {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: '10% center',
          toggleActions: 'play none none none',
        },
      })

      // Title
      gsap.to('.evolution__title', {
        opacity: 1,
        duration: 1.2,
        delay: 0.2,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: section,
          start: '10% center',
          toggleActions: 'play none none none',
        },
      })

      // Stats
      gsap.to('.evolution__stat', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: section,
          start: '15% center',
          toggleActions: 'play none none none',
        },
      })

      // Bars
      gsap.to('.evolution__bar-item', {
        opacity: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: '25% center',
          toggleActions: 'play none none none',
          onEnter: () => {
            barsRef.current.forEach((bar) => {
              if (bar) {
                bar.style.width = bar.dataset.width
              }
            })
          },
        },
      })

      // Fade out
      gsap.to('.evolution', {
        opacity: 0,
        y: -50,
        scrollTrigger: {
          trigger: section,
          start: '70% center',
          end: '85% center',
          scrub: 1.5,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section className="scene-section scene-section--evolution" ref={sectionRef} id="scene-evolution">
      <div className="scene-inner">
        <div className="evolution">
          <div className="evolution__label">Performance</div>
          <h2 className="evolution__title">EVOLUTION</h2>

          <div className="evolution__stats">
            {stats.map((s, i) => (
              <div className="evolution__stat" key={i}>
                <div className="evolution__stat-value">
                  {s.value}<span>{s.suffix}</span> {s.unit}
                </div>
                <div className="evolution__stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="evolution__bar-container">
            {bars.map((b, i) => (
              <div className="evolution__bar-item" key={i}>
                <div className="evolution__bar-header">
                  <span className="evolution__bar-label">{b.label}</span>
                  <span className="evolution__bar-value">{b.value}</span>
                </div>
                <div className="evolution__bar-track">
                  <div
                    className="evolution__bar-fill"
                    ref={(el) => (barsRef.current[i] = el)}
                    data-width={`${b.width}%`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
