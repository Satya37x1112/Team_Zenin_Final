import React, { useRef, useEffect, useCallback } from 'react'

export default function FrameCanvas({ images, currentFrame, style = {} }) {
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const lastFrameRef = useRef(-1)
  const currentFrameRef = useRef(currentFrame)
  const rafRef = useRef(null)
  // Smoothing: track a floating-point "display frame" that lerps toward the target
  const displayFrameRef = useRef(currentFrame)
  const isRunningRef = useRef(false)

  currentFrameRef.current = currentFrame

  const coverFit = useCallback((ctx, img, cw, ch) => {
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
    const sw = img.naturalWidth * scale
    const sh = img.naturalHeight * scale
    ctx.drawImage(img, (cw - sw) / 2, (ch - sh) / 2, sw, sh)
  }, [])

  const drawBlended = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    if (!canvas || !ctx) return

    const target = currentFrameRef.current
    const display = displayFrameRef.current
    const cw = canvas.width
    const ch = canvas.height

    // Lerp the display frame toward target for smooth motion
    const diff = target - display
    const newDisplay = Math.abs(diff) < 0.05 ? target : display + diff * 0.25

    displayFrameRef.current = newDisplay

    const frameA = Math.floor(newDisplay)
    const frameB = Math.min(frameA + 1, images.length - 1)
    const blend = newDisplay - frameA // 0..1 fractional blend

    const imgA = images[frameA]
    const imgB = images[frameB]

    if (!imgA || !imgA.complete || !imgA.naturalWidth) return

    ctx.clearRect(0, 0, cw, ch)

    if (blend < 0.01 || frameA === frameB || !imgB || !imgB.complete) {
      // Single frame — no blend needed
      coverFit(ctx, imgA, cw, ch)
    } else {
      // Crossfade: draw frame A, then overlay frame B with alpha
      coverFit(ctx, imgA, cw, ch)
      ctx.globalAlpha = blend
      coverFit(ctx, imgB, cw, ch)
      ctx.globalAlpha = 1.0
    }

    // Keep animating if we haven't reached target yet
    if (Math.abs(target - newDisplay) > 0.01) {
      rafRef.current = requestAnimationFrame(drawBlended)
    } else {
      isRunningRef.current = false
    }
  }, [images, coverFit])

  // Kick off the render loop whenever target frame changes
  const startLoop = useCallback(() => {
    if (!isRunningRef.current) {
      isRunningRef.current = true
      rafRef.current = requestAnimationFrame(drawBlended)
    }
  }, [drawBlended])

  // Setup canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      const ctx = canvas.getContext('2d', { alpha: false })
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctxRef.current = ctx
      lastFrameRef.current = -1
      // Immediately draw current frame on resize
      displayFrameRef.current = currentFrameRef.current
      drawBlended()
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [drawBlended])

  // On frame change, start smooth animation loop
  useEffect(() => {
    startLoop()
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [currentFrame, startLoop])

  return (
    <div className="frame-canvas-container" style={{
      ...style,
      transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      <canvas ref={canvasRef} />
    </div>
  )
}
