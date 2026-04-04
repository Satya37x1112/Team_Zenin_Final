import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/*
 * F1Scene — Contains 4 sub-sections for the 4 F1 frame sequences.
 * Each sub-section has its own text overlay.
 */

const F1_SUBS = [
  {
    id: 'f1-reveal',
    label: 'The Machine',
    title: 'SF-24',
    subtitle: '1,000 HP hybrid power unit. 350 km/h. Zero compromise.',
    tag: '01',
    tagText: 'Reveal',
  },
  {
    id: 'f1-front',
    label: 'Aerodynamic Force',
    title: 'Ground\nEffect',
    subtitle: 'Every surface sculpted by wind tunnel and CFD simulation.',
    tag: '02',
    tagText: 'Aero',
  },
  {
    id: 'f1-detail',
    label: 'Precision Engineering',
    title: 'Contact\nPatch',
    subtitle: 'Four patches of rubber. The only connection between car and asphalt.',
    tag: '03',
    tagText: 'Detail',
  },
  {
    id: 'f1-glory',
    label: 'Racing Heritage',
    title: 'Forza\nFerrari',
    subtitle: '16 Constructors\' Championships. 243 Grand Prix victories. The legend continues.',
    tag: '04',
    tagText: 'Legacy',
  },
]

export default function F1Scene({ activeF1Sub = 0 }) {
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      F1_SUBS.forEach((sub, i) => {
        const el = `.f1__sub--${i}`

        gsap.fromTo(`${el} .f1__label`,
          { opacity: 0, y: 15 },
          {
            opacity: 1, y: 0, duration: 0.8,
            scrollTrigger: {
              trigger: `.scene-section--f1-${i}`,
              start: '5% center',
              toggleActions: 'play none none reverse',
            },
          }
        )

        gsap.fromTo(`${el} .f1__title-line`,
          { opacity: 0, y: 25 },
          {
            opacity: 1, y: 0, duration: 1,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: `.scene-section--f1-${i}`,
              start: '8% center',
              toggleActions: 'play none none reverse',
            },
          }
        )

        gsap.fromTo(`${el} .f1__subtitle`,
          { opacity: 0 },
          {
            opacity: 0.7, duration: 1,
            scrollTrigger: {
              trigger: `.scene-section--f1-${i}`,
              start: '12% center',
              toggleActions: 'play none none reverse',
            },
          }
        )

        // Fade out at end
        gsap.to(`${el}`, {
          opacity: 0, y: -25,
          scrollTrigger: {
            trigger: `.scene-section--f1-${i}`,
            start: '75% center',
            end: '95% center',
            scrub: 1.5,
          },
        })
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <>
      {F1_SUBS.map((sub, i) => (
        <section
          key={sub.id}
          className={`scene-section scene-section--f1-${i}`}
          ref={i === 0 ? sectionRef : undefined}
          id={`scene-${sub.id}`}
        >
          <div className="scene-inner">
            <div className={`f1 f1__sub f1__sub--${i}`}>
              <div className="f1__content">
                <div className="f1__label">{sub.label}</div>

                <div className="f1__line" />

                <h2 className="f1__title">
                  {sub.title.split('\n').map((line, j) => (
                    <span key={j} className={`f1__title-line ${j > 0 ? 'f1__title-line--accent' : ''}`}>
                      {line}
                    </span>
                  ))}
                </h2>

                <p className="f1__subtitle">{sub.subtitle}</p>
              </div>

              <div className="f1__tag">
                <span className="f1__tag-number">{sub.tag}</span>
                <span className="f1__tag-divider" />
                <span className="f1__tag-text">{sub.tagText}</span>
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  )
}
