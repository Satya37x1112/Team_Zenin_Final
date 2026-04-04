import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function DrivingScene() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      // Fade in label
      gsap.fromTo('.driving__label',
        { opacity: 0, y: 15 },
        {
          opacity: 1, y: 0, duration: 0.8,
          scrollTrigger: {
            trigger: section,
            start: '5% center',
            toggleActions: 'play none none none',
          },
        }
      )

      // Title lines — smooth stagger
      gsap.fromTo('.driving__title-line',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 1,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: '8% center',
            toggleActions: 'play none none none',
          },
        }
      )

      // Subtitle
      gsap.fromTo('.driving__subtitle',
        { opacity: 0, y: 15 },
        {
          opacity: 1, y: 0, duration: 1,
          scrollTrigger: {
            trigger: section,
            start: '12% center',
            toggleActions: 'play none none none',
          },
        }
      )

      // Line accent
      gsap.fromTo('.driving__line',
        { scaleX: 0 },
        {
          scaleX: 1, duration: 1.2, ease: 'expo.inOut',
          scrollTrigger: {
            trigger: section,
            start: '10% center',
            toggleActions: 'play none none none',
          },
        }
      )

      // Speed stats
      gsap.fromTo('.driving__stat',
        { opacity: 0, y: 15 },
        {
          opacity: 1, y: 0, duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: '15% center',
            toggleActions: 'play none none none',
          },
        }
      )

      // Fade out
      gsap.to('.driving', {
        opacity: 0,
        y: -30,
        scrollTrigger: {
          trigger: section,
          start: '80% center',
          end: '95% center',
          scrub: 1.5,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section className="scene-section scene-section--driving" ref={sectionRef} id="scene-driving">
      <div className="scene-inner">
        <div className="driving">
          <div className="driving__content">
            <div className="driving__label">Driving Experience</div>

            <div className="driving__line" />

            <h2 className="driving__title">
              <span className="driving__title-line">Born to</span>
              <span className="driving__title-line driving__title-line--accent">Dominate</span>
            </h2>

            <p className="driving__subtitle">
              Where engineering meets adrenaline.<br />
              Pure control at every limit.
            </p>

            <div className="driving__stats">
              <div className="driving__stat">
                <div className="driving__stat-value">2.5<span>s</span></div>
                <div className="driving__stat-label">0–100 km/h</div>
              </div>
              <div className="driving__stat">
                <div className="driving__stat-value">340<span>km/h</span></div>
                <div className="driving__stat-label">Top Speed</div>
              </div>
              <div className="driving__stat">
                <div className="driving__stat-value">1,030<span>HP</span></div>
                <div className="driving__stat-label">Combined Power</div>
              </div>
            </div>
          </div>

          <div className="driving__tag">
            <span className="driving__tag-number">07</span>
            <span className="driving__tag-divider" />
            <span className="driving__tag-text">Track Mode</span>
          </div>
        </div>
      </div>
    </section>
  )
}
