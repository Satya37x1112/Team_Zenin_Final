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
import F1Transition from './components/F1Transition'
import F1Scene from './components/F1Scene'
import Footer from './components/Footer'

import './App.css'

gsap.registerPlugin(ScrollTrigger)

const TOTAL_FRAMES = 240
const TOTAL_EXPLODED = 240
const TOTAL_DRIFT = 240
const TOTAL_F1 = 960

const SCENES = [
  { id: 'hero', label: 'Reveal', type: 'main', frameStart: 0, frameEnd: 39 },
  { id: 'legacy', label: 'Legacy', type: 'main', frameStart: 40, frameEnd: 79 },
  { id: 'evolution', label: 'Evolution', type: 'main', frameStart: 80, frameEnd: 139 },
  { id: 'showcase', label: 'Showcase', type: 'main', frameStart: 140, frameEnd: 179 },
  { id: 'exploded', label: 'Blueprint', type: 'exploded' },
  { id: 'craft', label: 'Craft', type: 'main', frameStart: 180, frameEnd: 209 },
  { id: 'driving', label: 'Drive', type: 'drift' },
  { id: 'future', label: 'Future', type: 'main', frameStart: 210, frameEnd: 239 },
  { id: 'f1-transition', label: 'F1', type: 'transition' },
  { id: 'f1-0', label: 'F1·1', type: 'f1', f1Start: 0, f1End: 239 },
  { id: 'f1-1', label: 'F1·2', type: 'f1', f1Start: 240, f1End: 479 },
  { id: 'f1-2', label: 'F1·3', type: 'f1', f1Start: 480, f1End: 719 },
  { id: 'f1-3', label: 'F1·4', type: 'f1', f1Start: 720, f1End: 959 },
]

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [ready, setReady] = useState(false)
  const [images, setImages] = useState([])
  const [explodedImages, setExplodedImages] = useState([])
  const [driftImages, setDriftImages] = useState([])
  const [f1Images, setF1Images] = useState([])
  const [currentFrame, setCurrentFrame] = useState(0)
  const [explodedFrame, setExplodedFrame] = useState(0)
  const [driftFrame, setDriftFrame] = useState(0)
  const [f1Frame, setF1Frame] = useState(0)
  const [activeScene, setActiveScene] = useState(0)
  const [activeCanvas, setActiveCanvas] = useState('main')
  const scrollContentRef = useRef(null)
  const lenisRef = useRef(null)

  const handleLoadComplete = useCallback((loadedMain, loadedExploded, loadedDrift, loadedF1) => {
    setImages(loadedMain)
    setExplodedImages(loadedExploded)
    setDriftImages(loadedDrift)
    setF1Images(loadedF1)
    setLoaded(true)

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setReady(true)
      })
    })
  }, [])

  // Initialize Lenis
  useEffect(() => {
    if (!ready) return

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.2,
      touchMultiplier: 1.5,
      syncTouch: true,
    })

    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => { lenis.raf(time * 1000) })
    gsap.ticker.lagSmoothing(0)

    return () => { lenis.destroy() }
  }, [ready])

  // GSAP ScrollTrigger
  useEffect(() => {
    if (!ready || !scrollContentRef.current) return

    const timer = setTimeout(() => {
      const sections = document.querySelectorAll('.scene-section')

      sections.forEach((section, index) => {
        const scene = SCENES[index]
        if (!scene) return

        // Transition = hide all canvases (pure black BG shows through)
        if (scene.type === 'transition') {
          ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            onEnter: () => { setActiveScene(index); setActiveCanvas('none') },
            onEnterBack: () => { setActiveScene(index); setActiveCanvas('none') },
            onLeaveBack: () => setActiveCanvas('main'),
          })
          return
        }

        if (scene.type === 'exploded') {
          ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.8,
            onUpdate: (self) => {
              setExplodedFrame(Math.min(
                Math.floor(self.progress * TOTAL_EXPLODED),
                TOTAL_EXPLODED - 1
              ))
            },
            onEnter: () => { setActiveScene(index); setActiveCanvas('exploded') },
            onEnterBack: () => { setActiveScene(index); setActiveCanvas('exploded') },
            onLeave: () => setActiveCanvas('main'),
            onLeaveBack: () => setActiveCanvas('main'),
          })
          return
        }

        if (scene.type === 'drift') {
          ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.8,
            onUpdate: (self) => {
              setDriftFrame(Math.min(
                Math.floor(self.progress * TOTAL_DRIFT),
                TOTAL_DRIFT - 1
              ))
            },
            onEnter: () => { setActiveScene(index); setActiveCanvas('drift') },
            onEnterBack: () => { setActiveScene(index); setActiveCanvas('drift') },
            onLeave: () => setActiveCanvas('main'),
            onLeaveBack: () => setActiveCanvas('main'),
          })
          return
        }

        if (scene.type === 'f1') {
          const count = scene.f1End - scene.f1Start + 1
          ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
            onUpdate: (self) => {
              setF1Frame(Math.min(
                scene.f1Start + Math.floor(self.progress * count),
                scene.f1End
              ))
            },
            onEnter: () => { setActiveScene(index); setActiveCanvas('f1') },
            onEnterBack: () => { setActiveScene(index); setActiveCanvas('f1') },
          })
          return
        }

        // Default: main canvas
        const frameCount = scene.frameEnd - scene.frameStart + 1
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
          onUpdate: (self) => {
            setCurrentFrame(Math.min(
              scene.frameStart + Math.floor(self.progress * frameCount),
              scene.frameEnd
            ))
          },
          onEnter: () => { setActiveScene(index); setActiveCanvas('main') },
          onEnterBack: () => { setActiveScene(index); setActiveCanvas('main') },
        })
      })

      ScrollTrigger.refresh()
    }, 150)

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
          {/* 4 frame canvases with crossfade */}
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
          <FrameCanvas
            images={f1Images}
            currentFrame={f1Frame}
            style={{ opacity: activeCanvas === 'f1' ? 1 : 0 }}
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
            <F1Transition />
            <F1Scene />
          </div>

          <Footer />
        </>
      )}
    </div>
  )
}
