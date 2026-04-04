import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const specs = [
  {
    icon: (
      <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    value: 'V12 Hybrid',
    label: 'Engine',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    value: '1,030 HP',
    label: 'Total Power',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    ),
    value: '2.5s',
    label: '0-100 km/h',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
    ),
    value: '800 Nm',
    label: 'Peak Torque',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
    ),
    value: '340 km/h',
    label: 'Top Speed',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24"><path d="M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>
    ),
    value: '1,495 kg',
    label: 'Dry Weight',
  },
]

export default function ShowcaseScene() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      // Label
      gsap.to('.showcase__label', {
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
      gsap.to('.showcase__title', {
        opacity: 1,
        duration: 1,
        delay: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: '10% center',
          toggleActions: 'play none none none',
        },
      })

      // Cards
      gsap.to('.showcase__card', {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: section,
          start: '15% center',
          toggleActions: 'play none none none',
        },
      })

      // Fade out
      gsap.to('.showcase', {
        opacity: 0,
        y: -40,
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
    <section className="scene-section scene-section--showcase" ref={sectionRef} id="scene-showcase">
      <div className="scene-inner">
        <div className="showcase">
          <div className="showcase__header">
            <div className="showcase__label">Specifications</div>
            <h2 className="showcase__title">Technical Excellence</h2>
          </div>

          <div className="showcase__grid">
            {specs.map((spec, i) => (
              <div className="showcase__card" key={i} id={`spec-card-${i}`}>
                <div className="showcase__card-icon">{spec.icon}</div>
                <div className="showcase__card-value">{spec.value}</div>
                <div className="showcase__card-label">{spec.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
