import React, { useState, useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

import Loader from './components/Loader'
import FrameCanvas from './components/FrameCanvas'
import Navbar from './components/Navbar'
import HeroScene from './components/HeroScene'
import LegacyScene from './components/LegacyScene'
import EvolutionScene from './components/EvolutionScene'
import ShowcaseScene from './components/ShowcaseScene'
import ExplodedScene from './components/ExplodedScene'
import CraftScene from './components/CraftScene'
import DrivingScene from './components/DrivingScene'
import FutureScene from './components/FutureScene'
import Footer from './components/Footer'

import './App.css'

gsap.registerPlugin(ScrollTrigger)

const TOTAL_FRAMES = 240
const TOTAL_EXPLODED = 240
const TOTAL_DRIFT = 240

const SCENES = [
  { id: 'hero', label: 'Reveal', frameStart: 0, frameEnd: 39 },
  { id: 'legacy', label: 'Legacy', frameStart: 40, frameEnd: 79 },
  { id: 'evolution', label: 'Evolution', frameStart: 80, frameEnd: 139 },
  { id: 'showcase', label: 'Showcase', frameStart: 140, frameEnd: 179 },
  { id: 'exploded', label: 'Blueprint', frameStart: -1, frameEnd: -1 },
  { id: 'craft', label: 'Craft', frameStart: 180, frameEnd: 209 },
  { id: 'driving', label: 'Drive', frameStart: -2, frameEnd: -2 },
  { id: 'future', label: 'Future', frameStart: 210, frameEnd: 239 },
]

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [ready, setReady] = useState(false) // staged: true after canvas paints frame 0
  const [images, setImages] = useState([])
  const [explodedImages, setExplodedImages] = useState([])
  const [driftImages, setDriftImages] = useState([])
  const [currentFrame, setCurrentFrame] = useState(0)
  const [explodedFrame, setExplodedFrame] = useState(0)
  const [driftFrame, setDriftFrame] = useState(0)
  const [activeScene, setActiveScene] = useState(0)
  const [activeCanvas, setActiveCanvas] = useState('main')
  const scrollContentRef = useRef(null)
  const lenisRef = useRef(null)

  const handleLoadComplete = useCallback((loadedImages, loadedExploded, loadedDrift) => {
    setImages(loadedImages)
    setExplodedImages(loadedExploded)
    setDriftImages(loadedDrift)
    setLoaded(true)

    // Staged entrance: wait for first frame to paint, then mark ready
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setReady(true)
      })
    })
  }, [])

  // Initialize Lenis — only after ready
  useEffect(() => {
    if (!ready) return

    const lenis = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      syncTouch: true,
    })

    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => { lenis.raf(time * 1000) })
    gsap.ticker.lagSmoothing(0)

    return () => { lenis.destroy() }
  }, [ready])

  // GSAP ScrollTrigger — only after ready
  useEffect(() => {
    if (!ready || !scrollContentRef.current) return

    // Small delay to let DOM settle before measuring
    const timer = setTimeout(() => {
      const sections = document.querySelectorAll('.scene-section')

      sections.forEach((section, index) => {
        const scene = SCENES[index]
        if (!scene) return

        if (scene.id === 'exploded') {
          ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
            onUpdate: (self) => {
              const frameIndex = Math.min(
                Math.floor(self.progress * TOTAL_EXPLODED),
                TOTAL_EXPLODED - 1
              )
              setExplodedFrame(frameIndex)
            },
            onEnter: () => { setActiveScene(index); setActiveCanvas('exploded') },
            onEnterBack: () => { setActiveScene(index); setActiveCanvas('exploded') },
            onLeave: () => setActiveCanvas('main'),
            onLeaveBack: () => setActiveCanvas('main'),
          })
          return
        }

        if (scene.id === 'driving') {
          ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
            onUpdate: (self) => {
              const frameIndex = Math.min(
                Math.floor(self.progress * TOTAL_DRIFT),
                TOTAL_DRIFT - 1
              )
              setDriftFrame(frameIndex)
            },
            onEnter: () => { setActiveScene(index); setActiveCanvas('drift') },
            onEnterBack: () => { setActiveScene(index); setActiveCanvas('drift') },
            onLeave: () => setActiveCanvas('main'),
            onLeaveBack: () => setActiveCanvas('main'),
          })
          return
        }

        const frameCount = scene.frameEnd - scene.frameStart + 1

        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
          onUpdate: (self) => {
            const frameIndex = Math.min(
              scene.frameStart + Math.floor(self.progress * frameCount),
              scene.frameEnd
            )
            setCurrentFrame(frameIndex)
          },
          onEnter: () => { setActiveScene(index); setActiveCanvas('main') },
          onEnterBack: () => { setActiveScene(index); setActiveCanvas('main') },
        })
      })

      ScrollTrigger.refresh()
    }, 100)

    return () => {
      clearTimeout(timer)
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [ready])

  return (
    <div className={`app ${ready ? 'app--ready' : ''}`}>
      <Loader onComplete={handleLoadComplete} />

      {loaded && (
        <>
          {/* Frame canvases — always mounted once loaded */}
          <FrameCanvas
            images={images}
            currentFrame={currentFrame}
            style={{ opacity: activeCanvas === 'main' ? 1 : 0 }}
          />
          <FrameCanvas
            images={explodedImages}
            currentFrame={explodedFrame}
            style={{ opacity: activeCanvas === 'exploded' ? 1 : 0 }}
          />
          <FrameCanvas
            images={driftImages}
            currentFrame={driftFrame}
            style={{ opacity: activeCanvas === 'drift' ? 1 : 0 }}
          />

          <Navbar />

          {/* Scene Progress Dots */}
          <div className="scene-progress" aria-label="Scene navigation">
            {SCENES.map((scene, i) => (
              <React.Fragment key={scene.id}>
                <div
                  className={`scene-progress__dot ${activeScene === i ? 'scene-progress__dot--active' : ''}`}
                  title={scene.label}
                />
                {i < SCENES.length - 1 && <div className="scene-progress__line" />}
              </React.Fragment>
            ))}
          </div>

          <div className="scroll-content" ref={scrollContentRef}>
            <HeroScene />
            <LegacyScene />
            <EvolutionScene />
            <ShowcaseScene />
            <ExplodedScene />
            <CraftScene />
            <DrivingScene />
            <FutureScene />
          </div>

          <Footer />
        </>
      )}
    </div>
  )
}
