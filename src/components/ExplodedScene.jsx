import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const components = [
  {
    id: 'engine',
    name: 'V12 Hybrid Power Unit',
    spec: '1,030 HP combined output',
    detail: 'Twin-turbocharged 6.5L V12 with three electric motors',
  },
  {
    id: 'chassis',
    name: 'Carbon Fiber Monocoque',
    spec: 'Torsional rigidity: 20% increase',
    detail: 'Full carbon fiber construction with integrated roll cage',
  },
  {
    id: 'aero',
    name: 'Active Aerodynamics',
    spec: '800 kg downforce at 250 km/h',
    detail: 'S-Duct, active rear wing, and underbody diffuser',
  },
  {
    id: 'suspension',
    name: 'Magnetorheological Dampers',
    spec: 'Response time: 1ms',
    detail: 'Adaptive suspension with predictive road scanning',
  },
  {
    id: 'brakes',
    name: 'Carbon Ceramic Brakes',
    spec: '100-0 km/h in 29m',
    detail: 'Brembo CCM-R with ABS evo and brake-by-wire',
  },
  {
    id: 'interior',
    name: 'Driver-Centric Cockpit',
    spec: 'Full digital interface',
    detail: 'Alcantara-wrapped steering with integrated controls',
  },
]

export default function ExplodedScene() {
  const sectionRef = useRef(null)
  const [activeComponent, setActiveComponent] = React.useState(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      // Header
      gsap.fromTo('.exploded__label',
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.8,
          scrollTrigger: {
            trigger: section,
            start: '5% center',
            toggleActions: 'play none none none',
          },
        }
      )

      gsap.fromTo('.exploded__title',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 1,
          scrollTrigger: {
            trigger: section,
            start: '5% center',
            toggleActions: 'play none none none',
          },
        }
      )

      // Component cards stagger in
      gsap.fromTo('.exploded__card',
        { opacity: 0, x: -30, scale: 0.95 },
        {
          opacity: 1, x: 0, scale: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: section,
            start: '15% center',
            toggleActions: 'play none none none',
          },
        }
      )

      // Scroll indicator text
      gsap.fromTo('.exploded__hint',
        { opacity: 0 },
        {
          opacity: 1, duration: 0.8,
          scrollTrigger: {
            trigger: section,
            start: '5% center',
            toggleActions: 'play none none none',
          },
        }
      )

      // Fade out
      gsap.to('.exploded', {
        opacity: 0,
        y: -40,
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
    <section className="scene-section scene-section--exploded" ref={sectionRef} id="scene-exploded">
      <div className="scene-inner">
        <div className="exploded">
          {/* Left side: info panel */}
          <div className="exploded__panel">
            <div className="exploded__label">Technical Blueprint</div>
            <h2 className="exploded__title">Engineering<br />Deconstructed</h2>

            <div className="exploded__hint">
              Scroll to explore the anatomy
            </div>

            <div className="exploded__cards">
              {components.map((comp, i) => (
                <div
                  className={`exploded__card ${activeComponent === i ? 'exploded__card--active' : ''}`}
                  key={comp.id}
                  id={`component-${comp.id}`}
                  onMouseEnter={() => {
                    setActiveComponent(i)
                    window.__setActiveComponent?.(i)
                  }}
                  onMouseLeave={() => {
                    setActiveComponent(null)
                    window.__setActiveComponent?.(null)
                  }}
                >
                  <div className="exploded__card-index">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="exploded__card-content">
                    <div className="exploded__card-name">{comp.name}</div>
                    <div className="exploded__card-spec">{comp.spec}</div>
                    {activeComponent === i && (
                      <div className="exploded__card-detail">{comp.detail}</div>
                    )}
                  </div>
                  <div className="exploded__card-indicator" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
