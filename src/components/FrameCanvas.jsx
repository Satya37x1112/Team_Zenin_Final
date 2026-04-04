import React, { useRef, useEffect, useCallback } from 'react'

export default function FrameCanvas({ images, currentFrame, style = {} }) {
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const animFrameRef = useRef(null)
  const lastFrameRef = useRef(-1)

  const drawFrame = useCallback((frameIndex) => {
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    if (!canvas || !ctx) return
    const img = images[frameIndex]
    if (!img || !img.complete || !img.naturalWidth) return

    if (lastFrameRef.current === frameIndex) return
    lastFrameRef.current = frameIndex

    const cw = canvas.width
    const ch = canvas.height
    const iw = img.naturalWidth
    const ih = img.naturalHeight

    // Cover fit
    const scale = Math.max(cw / iw, ch / ih)
    const sw = iw * scale
    const sh = ih * scale
    const sx = (cw - sw) / 2
    const sy = (ch - sh) / 2

    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(img, sx, sy, sw, sh)
  }, [images])

  // Setup canvas and draw first frame immediately
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      // Cache the context — avoids repeated getContext calls
      const ctx = canvas.getContext('2d', { alpha: false })
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctxRef.current = ctx
      lastFrameRef.current = -1
      drawFrame(currentFrame)
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [currentFrame, drawFrame])

  // Draw on frame change
  useEffect(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    animFrameRef.current = requestAnimationFrame(() => {
      drawFrame(currentFrame)
    })
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [currentFrame, drawFrame])

  return (
    <div className="frame-canvas-container" style={{
      ...style,
      transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      <canvas ref={canvasRef} />
    </div>
  )
}
