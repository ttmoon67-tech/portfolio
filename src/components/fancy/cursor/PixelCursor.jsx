import { useEffect, useRef } from 'react'

const PIXEL_SIZE = 4
const TRAIL_LENGTH = 18
const LIFE_DECAY = 0.008
const FPS = 30
const FRAME_INTERVAL = 1000 / FPS

export default function PixelCursor() {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: -100, y: -100 })
  const trailRef = useRef([])
  const lastFrameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    let raf

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    const draw = (timestamp) => {
      raf = requestAnimationFrame(draw)

      // Throttle to ~30 FPS
      if (timestamp - lastFrameRef.current < FRAME_INTERVAL) return
      lastFrameRef.current = timestamp

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const { x, y } = mouseRef.current

      trailRef.current.push({ x, y, life: 1 })
      if (trailRef.current.length > TRAIL_LENGTH) trailRef.current.shift()

      for (let i = 0; i < trailRef.current.length; i++) {
        const t = trailRef.current[i]
        t.life -= LIFE_DECAY
        if (t.life <= 0) continue

        const alpha = t.life * 0.65
        const px = Math.round(t.x / PIXEL_SIZE) * PIXEL_SIZE
        const py = Math.round(t.y / PIXEL_SIZE) * PIXEL_SIZE

        // Main pixel
        ctx.fillStyle = `rgba(119, 164, 226, ${alpha})`
        ctx.fillRect(px, py, PIXEL_SIZE + t.life * 2, PIXEL_SIZE + t.life * 2)

        // Single scatter pixel (reduced from 3)
        if (i % 2 === 0) {
          const ox = (Math.random() - 0.5) * 14 * t.life
          const oy = (Math.random() - 0.5) * 14 * t.life
          ctx.fillStyle = `rgba(119, 164, 226, ${alpha * 0.3})`
          ctx.fillRect(
            Math.round((t.x + ox) / 3) * 3,
            Math.round((t.y + oy) / 3) * 3,
            3,
            3
          )
        }
      }

      trailRef.current = trailRef.current.filter(t => t.life > 0)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 999,
        pointerEvents: 'none',
        display: 'block',
        willChange: 'transform',
      }}
    />
  )
}
