import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  HoverSlider,
  TextStaggerHover,
  HoverSliderImageWrap,
  HoverSliderImage,
} from '@/components/fancy/image/ImageTrail'

const cards = [
  {
    src: '/resume-1.png',
    alt: '简历',
    style: { width: '22%', marginLeft: '-2%', marginTop: '-6%', zIndex: 11, rotate: '-6deg' },
    className: 'h-auto',
  },
  {
    src: '/装饰卡片.png',
    alt: '装饰卡片',
    style: { width: '12%', marginLeft: '-2%', marginTop: '-3%', zIndex: 13, rotate: '-4deg' },
    className: 'h-auto',
  },
  {
    src: '/项目2.png',
    alt: '项目',
    style: { width: '24%', marginLeft: '0%', marginTop: '-4%', zIndex: 12, rotate: '7deg' },
    className: 'h-auto',
  },
  {
    src: '/前言.png',
    alt: '前言',
    style: { width: '18%', marginLeft: '-1%', marginTop: '-1%', zIndex: 14, rotate: '3deg' },
    className: 'h-auto',
  },
  {
    src: '/粉色标签.png',
    alt: '粉色标签',
    style: { width: '3.6%', marginLeft: '12%', marginTop: '-6%', zIndex: 15, rotate: '20deg' },
    className: 'h-auto',
  },
]

const projects = [
  { id: 1, title: '0-1出海咖啡器具品牌众筹项目' },
  { id: 2, title: '儿童公园导视设计案例' },
  { id: 3, title: '广州黄埔长洲岛视觉识别系统' },
  { id: 4, title: '游园惊梦—《牡丹亭》视觉新媒体表达' },
  { id: 5, title: '小小世界—建模类作品' },
  { id: 6, title: '醒狮宇宙—IP作品' },
]

export default function HomePage() {
  // 首页背景音乐：首次点击页面后淡入播放，离开淡出
  const audioRef = useRef(null)
  const fadeRef = useRef(null)
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const fadeTo = (target, duration = 1500) => {
      if (fadeRef.current) clearInterval(fadeRef.current)
      const step = 30
      const delta = ((target - audio.volume) / duration) * step
      fadeRef.current = setInterval(() => {
        const next = audio.volume + delta
        if ((delta > 0 && next >= target) || (delta < 0 && next <= target)) {
          audio.volume = target
          clearInterval(fadeRef.current)
          fadeRef.current = null
        } else {
          audio.volume = next
        }
      }, step)
    }

    const playOnce = () => {
      audio.volume = 0
      audio.play().catch(() => {})
      fadeTo(0.4, 2000) // 2秒淡入到40%音量
      document.removeEventListener('click', playOnce)
    }
    document.addEventListener('click', playOnce)

    return () => {
      document.removeEventListener('click', playOnce)
      fadeTo(0, 800) // 离开时0.8秒淡出
      setTimeout(() => {
        audio.pause()
        audio.currentTime = 0
      }, 900)
    }
  }, [])

  // 首页需要看到全屏背景图，暂时透明 body
  useEffect(() => {
    const root = document.getElementById('root')
    if (!root) return
    const prev = root.style.background
    root.style.background = 'transparent'
    document.body.style.background = 'transparent'
    return () => {
      root.style.background = prev
      document.body.style.background = ''
    }
  }, [])

  const [active, setActive] = useState(null)
  const [isListVisible, setListVisible] = useState(false)
  const [navigateTo, setNavigateTo] = useState(null)
  const navigate = useNavigate()


  const handleProjectClick = useCallback((projectId) => {
    setNavigateTo(`/project/${projectId}`)
    setListVisible(false)
  }, [])

  const handleExitComplete = useCallback(() => {
    if (navigateTo) {
      navigate(navigateTo)
      setNavigateTo(null)
    }
  }, [navigateTo, navigate])

  return (
    <div style={{ display: 'grid' }}>
      {/* Full background — 完整显示，可滚动到底部 */}
      <img
        src="/bg-8.png"
        alt="背景"
        className="h-auto block"
        style={{ gridArea: '1 / 1', width: '100vw' }}
      />

      {/* Envelope */}
      <div className="flex-1 flex items-center justify-center py-12" style={{ gridArea: '1 / 1', zIndex: 10, marginTop: '-180px' }}>
        <div
          id="envelope"
          className="grid"
          style={{
            width: '55vw',
            minWidth: '700px',
            maxWidth: '1200px',
            aspectRatio: '2675 / 1865',
            overflow: 'visible',
          }}
        >

          {/* Layer 1: 信封1 */}
          <img
            src="/信封1.png"
            alt="信封底部"
            className="w-full h-full object-contain object-bottom"
            style={{ gridRow: 1, gridColumn: 1 }}
          />

          {/* Layer 2: Cards with framer-motion */}
          <div
            className="flex items-center justify-center"
            style={{
              gridRow: 1,
              gridColumn: 1,
              maxWidth: '100%',
              overflow: 'hidden',
            }}
          >
            {cards.map((card, i) => (
              <motion.img
                key={card.src}
                src={card.src}
                alt={card.alt}
                style={card.style}
                className={card.className + ' shadow-lg shadow-black/20 cursor-pointer'}
                /* Entrance: slide up with stagger */
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: 'easeOut' }}
                /* Hover: gentle scale */
                whileHover={{ scale: 1.05, zIndex: 100, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                /* Click: project card → list, others → enlarge */
                onClick={() => {
                  if (card.alt === '项目') {
                    setListVisible(true)
                  } else {
                    setActive(card)
                  }
                }}
                layoutId={
                  card.alt === '项目'
                    ? undefined
                    : card.src
                }
              />
            ))}
          </div>

          {/* Layer 3: 信封2 */}
          <motion.img
            src="/信封2.png"
            alt="信封顶层"
            style={{
              gridRow: 1,
              gridColumn: 1,
              zIndex: 20,
              width: '100%',
              marginTop: '40%',
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
          />

        </div>
      </div>

      {/* Click-to-enlarge overlay */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.img
              src={active.src}
              alt={active.alt}
              layoutId={active.src}
              className="rounded shadow-2xl cursor-default"
              style={{ maxWidth: '70vw', maxHeight: '85vh', objectFit: 'contain' }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project list overlay */}
      <AnimatePresence onExitComplete={handleExitComplete}>
        {isListVisible && (
          <motion.div
            className="fixed inset-0 z-[250] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setListVisible(false)}
          >
            {/* Semi-transparent backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Main composition */}
            <div
              className="relative flex items-center justify-center"
              style={{
                width: '900px',
                maxWidth: '95vw',
                height: '600px',
                maxHeight: '90vh',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* --- Left side: tilted decorative card --- */}
              <div className="absolute top-1/2 -translate-y-1/2 z-10" style={{ width: '432px', left: '-30px' }}>
                <motion.img
                  src="/项目2.png"
                  alt="项目卡片"
                  className="w-full h-auto shadow-xl"
                  style={{ rotate: '-6deg', transformOrigin: 'center center' }}
                  initial={{ opacity: 0, x: -50, rotate: '-14deg' }}
                  animate={{ opacity: 1, x: 0, rotate: '-6deg' }}
                  exit={{ opacity: 0, x: -30, rotate: '-4deg' }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>

              {/* --- 白纸 overlay --- */}
              <motion.div
                className="relative z-20 flex"
                style={{
                  width: '720px',
                  maxWidth: '85vw',
                  marginLeft: '100px',
                  borderRadius: '2px',
                  backgroundColor: 'var(--card)',
                  backgroundImage: [
                    `url('/白纸.png')`,
                    // Subtle paper fiber lines
                    `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139,119,85,0.015) 2px, rgba(139,119,85,0.015) 3px)`,
                    `repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(139,119,85,0.01) 3px, rgba(139,119,85,0.01) 4px)`,
                    // Soft vignette at edges
                    `radial-gradient(ellipse at center, transparent 60%, rgba(139,119,85,0.04) 100%)`,
                  ].join(', '),
                  backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%',
                  backgroundRepeat: 'no-repeat, repeat, repeat, no-repeat',
                  boxShadow: [
                    '0 20px 60px -20px rgba(0,0,0,0.35)',
                    '0 2px 8px rgba(0,0,0,0.08)',
                    'inset 0 0 0 1px rgba(255,255,255,0.6)',
                    'inset 0 1px 3px rgba(139,119,85,0.06)',
                  ].join(', '),
                }}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.96 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {/* Content on 白纸: HoverSlider links text ↔ images */}
                <HoverSlider className="relative flex w-full" style={{ padding: '36px 32px 32px 40px' }}>
                  {/* Left: Project names with stagger text effect */}
                  <div className="flex-1 flex flex-col justify-center pr-6" style={{ minWidth: 0 }}>
                    <ul className="space-y-2">
                      {projects.map((p, i) => (
                        <motion.li
                          key={p.id}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.18 + i * 0.06, duration: 0.3, ease: 'easeOut' }}
                          className="flex items-center border-b border-dashed border-stone-300/50 py-2.5"
                        >
                          {/* Project name with stagger hover */}
                          <TextStaggerHover
                            text={p.title}
                            index={i}
                            className="text-sm flex-1"
                            style={{ color: 'var(--muted-foreground)' }}
                            onClick={() => handleProjectClick(p.id)}
                          />

                          {/* Click arrow */}
                          <button
                            type="button"
                            className="ml-auto shrink-0 text-stone-300 hover:text-amber-500 transition-colors cursor-pointer"
                            onClick={() => handleProjectClick(p.id)}
                            title="查看详情"
                          >
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M6 3l5 5-5 5" />
                            </svg>
                          </button>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Right: Image trail — stacked, clipPath-reveal on hover */}
                  <div
                    className="shrink-0 flex items-center justify-center"
                    style={{ width: '260px', paddingLeft: '20px' }}
                  >
                    <div
                      className="rounded-sm overflow-hidden shadow-inner bg-white/60"
                      style={{ width: '220px', height: '220px' }}
                    >
                      <HoverSliderImageWrap className="size-full">
                        {projects.map((p, i) => (
                          <HoverSliderImage
                            key={p.id}
                            index={i}
                            src={`/projects/project-${p.id}.png`}
                            alt={p.title}
                          />
                        ))}
                      </HoverSliderImageWrap>
                    </div>
                  </div>
                </HoverSlider>
              </motion.div>

              {/* Close button */}
              <motion.button
                className="absolute -top-2 -right-2 z-30 w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setListVisible(false)}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ delay: 0.15, duration: 0.3 }}
              >
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="3" x2="13" y2="13" />
                  <line x1="13" y1="3" x2="3" y2="13" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Background music — 首次点击播放 */}
      <audio ref={audioRef} src="/bgm.mp3" loop preload="auto" />

    </div>
  )
}
