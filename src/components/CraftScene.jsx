import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const materials = [
  { name: 'Carbon Fiber' },
  { name: 'Alcantara' },
  { name: 'Titanium' },
  { name: 'Ceramic' },
]

export default function CraftScene() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      // Label
      gsap.to('.craft__label', {
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
      gsap.to('.craft__title', {
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

      // Description
      gsap.to('.craft__description', {
        opacity: 1,
        duration: 1,
        delay: 0.4,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: '10% center',
          toggleActions: 'play none none none',
        },
      })

      // Materials
      gsap.to('.craft__material', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: section,
          start: '20% center',
          toggleActions: 'play none none none',
        },
      })

      // Fade out
      gsap.to('.craft__content', {
        opacity: 0,
        y: -30,
        scrollTrigger: {
          trigger: section,
          start: '65% center',
          end: '85% center',
          scrub: 1.5,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section className="scene-section scene-section--craft" ref={sectionRef} id="scene-craft">
      <div className="scene-inner">
        <div className="craft">
          <div className="craft__content">
            <div className="craft__label">Craftsmanship</div>
            <h2 className="craft__title">
              Precision in<br />Every Detail
            </h2>
            <p className="craft__description">
              Every surface is sculpted with purpose. Every material chosen for
              both form and function. Hand-finished by artisans who understand
              that perfection is not a goal — it is a standard.
            </p>
            <div className="craft__materials">
              {materials.map((m, i) => (
                <div className="craft__material" key={i}>
                  <div className="craft__material-dot" />
                  <div className="craft__material-name">{m.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
