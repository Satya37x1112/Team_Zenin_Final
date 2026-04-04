import React, { useState, useEffect } from 'react'

const TOTAL_FRAMES = 240
const TOTAL_EXPLODED = 240
const TOTAL_DRIFT = 240

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const totalToLoad = TOTAL_FRAMES + TOTAL_EXPLODED + TOTAL_DRIFT
    let loadedCount = 0
    const mainImages = []
    const explodedImages = []
    const driftImages = []

    const checkComplete = () => {
      loadedCount++
      const pct = Math.round((loadedCount / totalToLoad) * 100)
      setProgress(pct)

      if (loadedCount >= totalToLoad) {
        // Let progress bar fill visually
        setTimeout(() => {
          setLoaded(true)
          // Wait for CSS fade-out transition (1.5s) to complete
          // before signaling the app to mount content
          setTimeout(() => onComplete(mainImages, explodedImages, driftImages), 1800)
        }, 300)
      }
    }

    // Load main frames
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image()
      const num = String(i).padStart(3, '0')
      img.src = `/frames/ezgif-frame-${num}.jpg`
      img.onload = checkComplete
      img.onerror = checkComplete
      mainImages[i - 1] = img
    }

    // Load exploded frames
    for (let i = 1; i <= TOTAL_EXPLODED; i++) {
      const img = new Image()
      const num = String(i).padStart(3, '0')
      img.src = `/exploded/ezgif-frame-${num}.jpg`
      img.onload = checkComplete
      img.onerror = checkComplete
      explodedImages[i - 1] = img
    }

    // Load drift frames
    for (let i = 1; i <= TOTAL_DRIFT; i++) {
      const img = new Image()
      const num = String(i).padStart(3, '0')
      img.src = `/drift/ezgif-frame-${num}.jpg`
      img.onload = checkComplete
      img.onerror = checkComplete
      driftImages[i - 1] = img
    }
  }, [onComplete])

  return (
    <div className={`loader ${loaded ? 'loader--hidden' : ''}`}>
      <div className="loader__brand">
        FER<span>RA</span>RI
      </div>

      <div className="loader__tagline">The Art of Speed</div>

      <div className="loader__progress-container">
        <div
          className="loader__progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="loader__text">
        Loading experience... <span>{progress}%</span>
      </div>
    </div>
  )
}
