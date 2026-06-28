import { useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import HTMLFlipBook from 'react-pageflip'

const PAGE_W = 720
const PAGE_H = 509

export default function BookViewer({ pages = [] }) {
  const bookRef = useRef(null)
  const [page, setPage] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [opened, setOpened] = useState(false)

  if (pages.length === 0) return null

  const coverSrc = pages[0]

  const handleFlip = useCallback((e) => {
    setPage(e.data)
  }, [])

  const openBook = () => setOpened(true)

  return (
    <div className="flex flex-col items-center w-full" style={{ marginTop: '40px', marginBottom: '80px' }}>
      {/* ── Closed Cover ── */}
      <AnimatePresence>
        {!opened && (
          <motion.div
            className="flex justify-center w-full perspective-1000"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, rotateY: -50, x: -80, transition: { duration: 0.55, ease: [0.33, 1, 0.68, 1] } }}
          >
            <motion.div
              className="cursor-pointer relative group"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              onClick={openBook}
              style={{
                width: PAGE_W,
                height: PAGE_H,
                maxWidth: '90vw',
                filter: isHovered
                  ? 'drop-shadow(0 22px 52px rgba(0,0,0,0.22))'
                  : 'drop-shadow(0 10px 28px rgba(0,0,0,0.10))',
                transition: 'filter 0.45s ease, transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                borderRadius: '4px 8px 8px 4px',
              }}
            >
              {/* Book edge shadow (right side) */}
              <div
                className="absolute inset-y-0 right-0 pointer-events-none"
                style={{
                  width: '6px',
                  zIndex: 2,
                  background: 'linear-gradient(to left, rgba(0,0,0,0.07), rgba(0,0,0,0.01) 60%, transparent)',
                  borderRadius: '0 8px 8px 0',
                }}
              />
              {/* Book edge shadow (left / spine side) */}
              <div
                className="absolute inset-y-0 left-0 pointer-events-none"
                style={{
                  width: '4px',
                  zIndex: 2,
                  background: 'linear-gradient(to right, rgba(0,0,0,0.05), transparent)',
                  borderRadius: '4px 0 0 4px',
                }}
              />

              <img
                src={coverSrc}
                alt="封面"
                className="w-full h-full object-cover block"
                style={{ borderRadius: '4px 8px 8px 4px' }}
                draggable={false}
              />

              {/* Hover hint: "翻开" */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <span
                  className="text-sm tracking-widest px-6 py-2 rounded-full"
                  style={{
                    background: 'rgba(0,0,0,0.5)',
                    color: '#fff',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  翻开视觉识别规范手册
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Opened Spread ── */}
      <AnimatePresence>
        {opened && (
          <motion.div
            className="flex flex-col items-center w-full"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="flex justify-center w-full px-2">
              <motion.div
                className="relative flex justify-center"
                style={{
                  width: '100%',
                  maxWidth: PAGE_W * 2,
                  filter: isHovered
                    ? 'drop-shadow(0 16px 40px rgba(0,0,0,0.18))'
                    : 'drop-shadow(0 8px 24px rgba(0,0,0,0.08))',
                  transition: 'filter 0.45s ease',
                  borderRadius: '3px 7px 7px 3px',
                }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
              >
                {/* Spine fold line */}
                <div
                  className="absolute inset-y-0 pointer-events-none"
                  style={{
                    left: '50%',
                    width: '2px',
                    transform: 'translateX(-50%)',
                    zIndex: 20,
                    background:
                      'linear-gradient(to right, transparent, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.10) 50%, rgba(0,0,0,0.03) 60%, transparent)',
                  }}
                />

                {/* Left page-stack edge */}
                <div
                  className="absolute inset-y-0 left-0 pointer-events-none"
                  style={{
                    width: '5px',
                    zIndex: 19,
                    background: 'linear-gradient(to right, rgba(0,0,0,0.06), rgba(0,0,0,0.01) 60%, transparent)',
                    borderRadius: '3px 0 0 3px',
                  }}
                />

                {/* Right page-stack edge */}
                <div
                  className="absolute inset-y-0 right-0 pointer-events-none"
                  style={{
                    width: '4px',
                    zIndex: 19,
                    background: 'linear-gradient(to left, rgba(0,0,0,0.05), rgba(0,0,0,0.01) 60%, transparent)',
                    borderRadius: '0 7px 7px 0',
                  }}
                />

                <HTMLFlipBook
                  ref={bookRef}
                  width={PAGE_W}
                  height={PAGE_H}
                  size="stretch"
                  minWidth={360}
                  maxWidth={PAGE_W}
                  minHeight={254}
                  maxHeight={PAGE_H}
                  maxShadowOpacity={0.22}
                  showCover
                  mobileScrollSupport
                  onFlip={handleFlip}
                  className="mx-auto"
                  style={{ borderRadius: '3px 7px 7px 3px' }}
                  drawShadow
                  flippingTime={650}
                  startZIndex={10}
                  autoSize
                  startPage={0}
                  swipeDistance={30}
                  clickEventForward
                  useMouseEvents
                  renderOnlyPageLengthChange
                >
                  {pages.map((pageSrc, i) => (
                    <div
                      key={i}
                      className="bg-stone-50"
                      style={{ borderRadius: i === 0 ? '3px 7px 7px 3px' : '0 5px 5px 0' }}
                    >
                      {pageSrc === '__blank__' ? (
                        <div className="w-full h-full bg-white" />
                      ) : (
                        <img
                          src={pageSrc}
                          alt={`Page ${i + 1}`}
                          className="w-full h-full object-cover block"
                          draggable={false}
                        />
                      )}
                    </div>
                  ))}
                </HTMLFlipBook>
              </motion.div>
            </div>

            {/* Page indicator */}
            <p className="text-xs mt-6 tracking-wider" style={{ color: 'var(--muted-foreground)' }}>
              {page + 1} / {pages.length}
            </p>

            {/* Controls */}
            <div className="flex gap-5 mt-4">
              <button
                type="button"
                onClick={() => bookRef.current?.pageFlip().flipPrev()}
                className="text-xs px-4 py-2 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
                style={{ border: '1px solid var(--border)', color: 'var(--muted-foreground)' }}
              >
                ← 上一页
              </button>
              <button
                type="button"
                onClick={() => bookRef.current?.pageFlip().flipNext()}
                className="text-xs px-4 py-2 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
                style={{ border: '1px solid var(--border)', color: 'var(--muted-foreground)' }}
              >
                下一页 →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
