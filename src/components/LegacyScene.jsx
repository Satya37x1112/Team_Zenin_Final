import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const milestones = [
  { year: '1947', event: 'The First Engine Roars to Life' },
  { year: '1962', event: 'Domination at Le Mans' },
  { year: '1987', event: 'The F40 — A Legend is Born' },
  { year: '2002', event: 'Enzo: Engineering Without Limits' },
  { year: '2024', event: 'The New Era Begins' },
]

export default function LegacyScene() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      // Label
      gsap.to('.legacy__label', {
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
      gsap.to('.legacy__title', {
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
      gsap.to('.legacy__description', {
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

      // Milestones
      gsap.to('.legacy__milestone', {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: section,
          start: '20% center',
          toggleActions: 'play none none none',
        },
      })

      // Fade out
      gsap.to('.legacy__content', {
        opacity: 0,
        y: -40,
        scrollTrigger: {
          trigger: section,
          start: '70% center',
          end: '90% center',
          scrub: 1.5,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section className="scene-section scene-section--legacy" ref={sectionRef} id="scene-legacy">
      <div className="scene-inner">
        <div className="legacy">
          <div className="legacy__content">
            <div className="legacy__label">Heritage</div>
            <h2 className="legacy__title">
              A Legacy Written<br />in Speed
            </h2>
            <p className="legacy__description">
              For over seven decades, we have pursued a single vision — to create machines
              that transcend engineering and become art. Each curve tells a story.
              Each engine note carries a legacy.
            </p>
            <div className="legacy__timeline">
              {milestones.map((m, i) => (
                <div className="legacy__milestone" key={i}>
                  <span className="legacy__year">{m.year}</span>
                  <span className="legacy__divider" />
                  <span className="legacy__event">{m.event}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
