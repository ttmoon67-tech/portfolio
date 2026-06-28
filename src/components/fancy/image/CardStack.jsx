import { useState, useCallback, useEffect, useRef } from "react"
import { motion } from "framer-motion"

export default function CardStack({ images = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const lastNavTime = useRef(0)
  const cooldown = 400

  const navigate = useCallback(
    (dir) => {
      const now = Date.now()
      if (now - lastNavTime.current < cooldown) return
      lastNavTime.current = now
      setCurrentIndex((prev) => {
        if (dir > 0) return prev === images.length - 1 ? 0 : prev + 1
        return prev === 0 ? images.length - 1 : prev - 1
      })
    },
    [images.length]
  )

  const handleDragEnd = (_, info) => {
    if (info.offset.y < -50) navigate(1)
    else if (info.offset.y > 50) navigate(-1)
  }

  const handleWheel = useCallback(
    (e) => {
      if (Math.abs(e.deltaY) > 30) {
        if (e.deltaY > 0) navigate(1)
        else navigate(-1)
      }
    },
    [navigate]
  )

  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: true })
    return () => window.removeEventListener("wheel", handleWheel)
  }, [handleWheel])

  const getCardStyle = (index) => {
    const total = images.length
    let diff = index - currentIndex
    if (diff > total / 2) diff -= total
    if (diff < -total / 2) diff += total

    if (diff === 0) return { y: 0, scale: 1, opacity: 1, zIndex: 5, rotateX: 0 }
    if (diff === -1) return { y: -120, scale: 0.85, opacity: 0.35, zIndex: 4, rotateX: 5 }
    if (diff === -2) return { y: -200, scale: 0.72, opacity: 0.15, zIndex: 3, rotateX: 10 }
    if (diff === 1) return { y: 120, scale: 0.85, opacity: 0.35, zIndex: 4, rotateX: -5 }
    if (diff === 2) return { y: 200, scale: 0.72, opacity: 0.15, zIndex: 3, rotateX: -10 }
    return { y: diff > 0 ? 280 : -280, scale: 0.6, opacity: 0, zIndex: 0, rotateX: diff > 0 ? -15 : 15 }
  }

  const isVisible = (index) => {
    const total = images.length
    let diff = index - currentIndex
    if (diff > total / 2) diff -= total
    if (diff < -total / 2) diff += total
    return Math.abs(diff) <= 2
  }

  return (
    <div className="relative flex items-center justify-center overflow-hidden" style={{ height: '65vh', backgroundColor: 'var(--background)' }}>
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/2 rounded-full blur-3xl"
          style={{ width: '600px', height: '600px', transform: 'translate(-50%, -50%)', backgroundColor: 'var(--foreground)', opacity: 0.02 }}
        />
      </div>

      {/* Card stack */}
      <div className="relative flex items-center justify-center" style={{ height: '500px', width: '700px', maxWidth: '95vw', perspective: '1500px' }}>
        {images.map((image, index) => {
          if (!isVisible(index)) return null
          const style = getCardStyle(index)
          const isCurrent = index === currentIndex

          return (
            <motion.div
              key={image.id || index}
              className="absolute"
              style={{ cursor: isCurrent ? 'grab' : 'default', transformStyle: 'preserve-3d', zIndex: style.zIndex }}
              animate={{ y: style.y, scale: style.scale, opacity: style.opacity, rotateX: style.rotateX }}
              transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 1 }}
              drag={isCurrent ? 'y' : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
            >
              <div className="relative" style={{ maxWidth: '75vw', maxHeight: '55vh' }}>
                <img
                  src={image.src}
                  alt={image.title || ''}
                  className="block"
                  draggable={false}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '75vh',
                    width: 'auto',
                    height: 'auto',
                    filter: isCurrent
                      ? 'drop-shadow(0 25px 50px rgba(61,60,79,0.2))'
                      : 'drop-shadow(0 10px 30px rgba(61,60,79,0.12))',
                  }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Navigation dots — right side */}
      <div className="absolute right-8 top-1/2 flex flex-col gap-2" style={{ transform: 'translateY(-50%)' }}>
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className="rounded-full transition-all duration-300"
            style={{
              width: '8px',
              height: index === currentIndex ? '24px' : '8px',
              backgroundColor: index === currentIndex ? 'var(--foreground)' : 'rgba(61,60,79,0.3)',
            }}
            aria-label={`Go to ${index + 1}`}
          />
        ))}
      </div>

      {/* Counter — left side */}
      <div className="absolute left-8 top-1/2" style={{ transform: 'translateY(-50%)' }}>
        <div className="flex flex-col items-center">
          <span className="text-4xl font-light tabular-nums" style={{ color: 'var(--foreground)' }}>
            {String(currentIndex + 1).padStart(2, '0')}
          </span>
          <div className="my-2" style={{ width: '32px', height: '1px', backgroundColor: 'rgba(61,60,79,0.2)' }} />
          <span className="text-sm tabular-nums" style={{ color: 'var(--muted-foreground)' }}>
            {String(images.length).padStart(2, '0')}
          </span>
        </div>
      </div>

    </div>
  )
}
