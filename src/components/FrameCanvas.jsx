import React, { useRef, useEffect, useCallback } from 'react'

export default function FrameCanvas({ images, currentFrame, style = {} }) {
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const animFrameRef = useRef(null)
  const lastFrameRef = useRef(-1)
  const currentFrameRef = useRef(currentFrame)

  // Keep ref in sync
  currentFrameRef.current = currentFrame

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

  // Setup canvas ONCE — separate from frame drawing
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      // Use DPR of 1 for performance (4 canvases running)
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      const ctx = canvas.getContext('2d', { alpha: false })
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctxRef.current = ctx
      lastFrameRef.current = -1
      drawFrame(currentFrameRef.current)
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [drawFrame]) // no currentFrame dependency!

  // Draw on frame change — fires on every scroll update
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
