import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/*
 * F1 Transition — A "Lights Out" cinematic bridge between the
 * road car narrative and the F1 racing chapter.
 *
 * Visual: 5 red dots appear in a row (like F1 starting lights),
 * then all go dark simultaneously → "LIGHTS OUT AND AWAY WE GO"
 */
export default function F1Transition() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top center',
          end: '90% center',
          scrub: 1.5,
        },
      })

      // Phase 1: Fade in the title
      tl.fromTo('.f1t__title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 })

      // Phase 2: Light up each dot sequentially (like real F1 start)
      .to('.f1t__light--1', { opacity: 1, boxShadow: '0 0 30px 10px rgba(255,30,30,0.8)', duration: 0.5 })
      .to('.f1t__light--2', { opacity: 1, boxShadow: '0 0 30px 10px rgba(255,30,30,0.8)', duration: 0.5 })
      .to('.f1t__light--3', { opacity: 1, boxShadow: '0 0 30px 10px rgba(255,30,30,0.8)', duration: 0.5 })
      .to('.f1t__light--4', { opacity: 1, boxShadow: '0 0 30px 10px rgba(255,30,30,0.8)', duration: 0.5 })
      .to('.f1t__light--5', { opacity: 1, boxShadow: '0 0 30px 10px rgba(255,30,30,0.8)', duration: 0.5 })

      // Hold all lights on
      .to({}, { duration: 1 })

      // Phase 3: ALL LIGHTS OUT — instant blackout
      .to('.f1t__light', {
        opacity: 0,
        boxShadow: '0 0 0 0 transparent',
        duration: 0.15,
      })

      // Phase 4: "LIGHTS OUT" text flashes in
      .fromTo('.f1t__go',
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }
      )

      // Hold the text
      .to({}, { duration: 1 })

      // Phase 5: Everything fades out
      .to('.f1t__inner', {
        opacity: 0,
        duration: 1.5,
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section className="scene-section scene-section--f1t" ref={sectionRef} id="scene-f1-transition">
      <div className="scene-inner">
        <div className="f1t__inner">
          <p className="f1t__title">Scuderia Ferrari</p>

          <div className="f1t__lights">
            <div className="f1t__light f1t__light--1" />
            <div className="f1t__light f1t__light--2" />
            <div className="f1t__light f1t__light--3" />
            <div className="f1t__light f1t__light--4" />
            <div className="f1t__light f1t__light--5" />
          </div>

          <h2 className="f1t__go">
            <span className="f1t__go-line">Lights Out</span>
            <span className="f1t__go-sub">and away we go</span>
          </h2>
        </div>
      </div>
    </section>
  )
}
