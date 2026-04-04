import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function HeroScene() {
  const sectionRef = useRef(null)
  const heroRef = useRef(null)
  const hasPlayed = useRef(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section || hasPlayed.current) return
    hasPlayed.current = true

    const ctx = gsap.context(() => {
      // Master entrance timeline — cinematic, smooth, no jank
      const tl = gsap.timeline({
        delay: 0.8, // wait for loader fade + canvas paint
        defaults: {
          ease: 'power2.out',
          duration: 1,
        },
      })

      // 1. Subtitle fades in first (small text, barely noticeable — sets the stage)
      tl.to('.hero__subtitle', {
        opacity: 0.7,
        duration: 1.5,
      })

      // 2. Title characters appear with a gentle lift
      .to('.hero__title-char', {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.035,
        ease: 'power2.out',
      }, '-=1')

      // 3. Top accent line extends
      .to('.hero__line-top', {
        scaleX: 1,
        duration: 1.6,
        ease: 'power1.inOut',
      }, '-=0.8')

      // 4. Tagline
      .to('.hero__tagline', {
        opacity: 0.8,
        duration: 1.4,
      }, '-=1')

      // 5. Bottom line
      .to('.hero__line-bottom', {
        scaleX: 1,
        duration: 1.4,
        ease: 'power1.inOut',
      }, '-=0.8')

      // 6. Scroll indicator — last, very gentle
      .to('.hero__scroll-indicator', {
        opacity: 0.6,
        duration: 1.2,
      }, '-=0.5')

      // Scroll-driven fadeout
      gsap.to(heroRef.current, {
        opacity: 0,
        y: -30,
        scrollTrigger: {
          trigger: section,
          start: '20% top',
          end: '50% top',
          scrub: 2,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  const title = 'FERRARI'
  const chars = title.split('')

  return (
    <section className="scene-section scene-section--hero" ref={sectionRef} id="scene-hero">
      <div className="scene-inner">
        <div className="hero" ref={heroRef}>
          <div className="hero__line-top" />

          <h1 className="hero__title">
            {chars.map((char, i) => (
              <span
                key={i}
                className="hero__title-char"
                style={{ color: char === 'R' && i === 3 ? 'var(--color-primary)' : undefined }}
              >
                {char}
              </span>
            ))}
          </h1>

          <p className="hero__subtitle">Est. 1947 · Maranello, Italia</p>

          <div className="hero__line-bottom" />

          <p className="hero__tagline">
            Born from obsession. Forged in fire.
          </p>

          <div className="hero__scroll-indicator">
            <span className="hero__scroll-text">Scroll to explore</span>
            <div className="hero__scroll-line" />
          </div>
        </div>
      </div>
    </section>
  )
}
