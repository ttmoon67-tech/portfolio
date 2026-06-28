import { useState, useRef, useEffect } from 'react'
import FaultyTerminal from '@/components/fancy/terminal/FaultyTerminal'

export default function Project5Banner() {
  const [paused, setPaused] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setPaused(!entry.isIntersecting),
      { threshold: 0.05 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="w-full relative" style={{ height: '100vh', overflow: 'hidden' }}>
      {/* FaultyTerminal background — pauses when scrolled away */}
      <div className="absolute inset-0">
        <FaultyTerminal
          scale={2.6}
          digitSize={1.2}
          scanlineIntensity={0.5}
          glitchAmount={1}
          flickerAmount={1}
          noiseAmp={1}
          chromaticAberration={0}
          dither={0}
          curvature={0.1}
          tint="#77a4e2"
          mouseReact
          mouseStrength={0.4}
          brightness={0.6}
          pause={paused}
          dpr={1}
          pageLoadAnimation={false}
        />
      </div>

      {/* Centered white text */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <h1
          className="text-white tracking-widest text-center"
          style={{
            fontFamily: "'Alibaba PuHuiTi', 'PingFang SC', 'Microsoft YaHei', sans-serif",
            fontWeight: 300,
            fontSize: 'clamp(2rem, 5vw, 4.5rem)',
            letterSpacing: '0.15em',
          }}
        >
          Welcome to the Tiny World
        </h1>
      </div>
    </div>
  )
}
