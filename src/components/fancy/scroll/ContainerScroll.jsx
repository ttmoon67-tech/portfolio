import { useRef, useState, useEffect } from 'react'
import { useScroll, useTransform, motion } from 'framer-motion'

function Header({ translate, titleComponent }) {
  return (
    <motion.div style={{ translateY: translate }} className="max-w-4xl mx-auto text-center">
      {titleComponent}
    </motion.div>
  )
}

function Card({ rotate, scale, children }) {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        aspectRatio: '4 / 3',
        boxShadow:
          '0 0 80px rgba(0,0,0,0.5), 0 0 20px rgba(0,0,0,0.3), 0 30px 60px rgba(0,0,0,0.4)',
      }}
      className="max-w-7xl -mt-10 mx-auto w-[92%] border-[6px] border-[#3a3a3a] p-2 md:p-3 bg-[#1a1a1c] rounded-[24px]"
    >
      <div className="h-full w-full overflow-hidden rounded-[16px] bg-black">
        {children}
      </div>
    </motion.div>
  )
}

export default function ContainerScroll({ titleComponent, children, bgColor = '#030303' }) {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const scaleDimensions = () => (isMobile ? [0.7, 0.9] : [1.05, 1])

  const rotate = useTransform(scrollYProgress, [0, 1], [15, 0])
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions())
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100])

  return (
    <div ref={containerRef} className="h-[55rem] md:h-[70rem] flex items-center justify-center relative p-2 md:p-12" style={{ backgroundColor: bgColor }}>
      <div className="py-8 md:py-24 w-full relative" style={{ perspective: '1400px' }}>
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  )
}
