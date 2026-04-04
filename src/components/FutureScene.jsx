import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function FutureScene() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      // Label
      gsap.to('.future__label', {
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
      gsap.to('.future__title', {
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

      // Subtitle
      gsap.to('.future__subtitle', {
        opacity: 1,
        duration: 1,
        delay: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: '10% center',
          toggleActions: 'play none none none',
        },
      })

      // CTA
      gsap.to('.future__cta', {
        opacity: 1,
        duration: 0.8,
        delay: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: '10% center',
          toggleActions: 'play none none none',
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section className="scene-section scene-section--future" ref={sectionRef} id="scene-future">
      <div className="scene-inner">
        <div className="future">
          <div className="future__label">Vision</div>
          <h2 className="future__title future__title--glitch" data-text="THE FUTURE IS NOW">
            THE FUTURE IS NOW
          </h2>
          <p className="future__subtitle">
            Where engineering meets imagination. Where heritage meets innovation.
            The next chapter is being written — and you're invited to the premiere.
          </p>
          <button className="future__cta" id="cta-experience">
            Enter the Experience →
          </button>
        </div>
      </div>
    </section>
  )
}
