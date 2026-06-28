import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import CardStack from '@/components/fancy/image/CardStack'
import BookViewer from '@/components/fancy/image/BookViewer'
import SplashCursor from '@/components/fancy/cursor/SplashCursor'
import PixelCursor from '@/components/fancy/cursor/PixelCursor'
import Project5Banner from '@/components/fancy/terminal/Project5Banner'
import Project6Banner from '@/components/fancy/terminal/Project6Banner'
import Folder from '@/components/fancy/folder/Folder'
import ModelViewer from '@/components/fancy/model/ModelViewer'
import ContainerScroll from '@/components/fancy/scroll/ContainerScroll'


/* ─── Sway bird on hover ─── */
function SwayBird({ src, size = '120px', x, y, delay = '0s' }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y, width: size, transform: 'translate(-50%, -50%)' }}
      animate={{ rotate: [-3, 3, -3] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay }}
      whileHover={{ rotate: [-12, 12, -12, 12, 0], scale: 1.15, transition: { duration: 0.7, ease: 'easeInOut' } }}
    >
      <img src={src} alt="" className="w-full h-auto block pointer-events-auto" style={{ cursor: 'default' }} />
    </motion.div>
  )
}

/* ─── Scattered background bird ─── */
function ScatteredBird({ src, size = '50px', x, y, opacity = 0.15, delay = '0s' }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y, width: size, opacity, transform: 'translate(-50%, -50%)' }}
      animate={{ y: ['0%', '-12%', '0%', '8%', '0%'], rotate: [-2, 4, -2] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      <img src={src} alt="" className="w-full h-auto block" />
    </motion.div>
  )
}

/* ─── Flat nav from content tree ─── */
function flattenContent(content) {
  const flat = []
  content.forEach((s) => {
    flat.push({ id: s.id, label: s.label })
    if (s.children) s.children.forEach((c) => flat.push({ id: c.id, label: c.label, indent: true }))
  })
  return flat
}

/* ─── Scroll-spy hook ─── */
function useActiveSection(sectionIds) {
  const [active, setActive] = useState(sectionIds[0] || null)
  useEffect(() => {
    if (sectionIds.length === 0) return
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) setActive(visible[0].target.id)
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    )
    sectionIds.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [sectionIds])
  return active
}

/* ─── Guide tab switcher ─── */
function GuideTabs({ guides }) {
  const [active, setActive] = useState(0)
  return (
    <div className="flex flex-col items-center">
      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap justify-center">
        {guides.map((g, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className="text-xs px-4 py-1.5 rounded-full transition-colors"
            style={{
              backgroundColor: i === active ? 'var(--primary)' : 'transparent',
              color: i === active ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
              border: i === active ? '1px solid var(--primary)' : '1px solid var(--border)',
            }}
          >
            {g.label}
          </button>
        ))}
      </div>
      {/* Stack all images, crossfade via opacity */}
      <div className="max-w-3xl w-full relative">
        {guides.map((g, i) => (
          <img
            key={i}
            src={g.src}
            alt={g.label}
            className="w-full h-auto block transition-opacity duration-300"
            style={{
              opacity: i === active ? 1 : 0,
              position: i === active ? 'relative' : 'absolute',
              inset: i === active ? 'auto' : 0,
            }}
            loading="lazy"
          />
        ))}
      </div>
    </div>
  )
}

/* ─── Sign section with click-to-zoom ─── */
function SignSection({ signs }) {
  const [zoomed, setZoomed] = useState(null)
  return (
    <div className="w-full pb-16 relative z-10" style={{ marginTop: '100px' }}>
      {signs.map((sign) => (
        <motion.div
          key={sign.id}
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h2 className="text-base tracking-wider mb-8">{sign.label}</h2>
          <div className="max-w-5xl mx-auto cursor-zoom-in" onClick={() => setZoomed(sign)}>
            <img src={sign.src} alt={sign.label} className="w-full h-auto block" loading="lazy" />
          </div>
        </motion.div>
      ))}
      {/* Lightbox */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomed(null)}
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 text-xl transition-colors"
              onClick={() => setZoomed(null)}
            >
              ✕
            </button>
            <img
              src={zoomed.src}
              alt={zoomed.label}
              className="max-w-full max-h-full object-contain cursor-zoom-out"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Lazy Bilibili iframe — only loads when visible ─── */
function BilibiliEmbed({ bvid }) {
  const [load, setLoad] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setLoad(true); obs.disconnect() } },
      { rootMargin: '200px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="relative w-full overflow-hidden rounded-lg shadow-lg" style={{ aspectRatio: '16/9', backgroundColor: '#000' }}>
      {load && (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`//player.bilibili.com/player.html?bvid=${bvid}&page=1&high_quality=1`}
          scrolling="no"
          frameBorder="no"
          allowFullScreen
          title="Bilibili 视频"
        />
      )}
    </div>
  )
}

/* ─── Video section with local / YouTube / Bilibili ─── */
function VideoSection({ video, fullWidth = false }) {
  return (
    <div className={`w-full ${fullWidth ? 'px-0' : 'max-w-4xl mx-auto px-4'} pb-16 relative z-10`} style={{ marginTop: '80px' }}>
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Bilibili embed (lazy) */}
        {video.bilibiliId ? (
          <BilibiliEmbed bvid={video.bilibiliId} />
        ) : video.file ? (
          /* Local video player */
          <div className="relative w-full overflow-hidden rounded-lg shadow-lg" style={{ aspectRatio: '16/9', backgroundColor: '#000' }}>
            <video
              className="absolute inset-0 w-full h-full"
              src={video.file}
              poster={video.cover}
              controls
              playsInline
              preload="metadata"
            >
              您的浏览器不支持视频播放
            </video>
          </div>
        ) : null}

        {/* YouTube link */}
        {video.youtubeUrl && (
          <p className="text-center mt-4">
            <a
              href={video.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm transition-colors"
              style={{ color: 'var(--muted-foreground)' }}
              onMouseEnter={(e) => (e.target.style.color = 'var(--foreground)')}
              onMouseLeave={(e) => (e.target.style.color = 'var(--muted-foreground)')}
            >
              <svg className="w-3.5 h-3.5 mr-2" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3h7v7M14 2L3 13" /></svg>
              在 YouTube 观看
            </a>
          </p>
        )}

        {/* Bilibili link */}
        {video.bilibiliUrl && (
          <p className="text-center mt-4">
            <a
              href={video.bilibiliUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm transition-colors"
              style={{ color: video.file || video.bilibiliId ? '#aaa' : 'var(--muted-foreground)' }}
              onMouseEnter={(e) => (e.target.style.color = video.file || video.bilibiliId ? '#fff' : 'var(--foreground)')}
              onMouseLeave={(e) => (e.target.style.color = video.file || video.bilibiliId ? '#aaa' : 'var(--muted-foreground)')}
            >
              <svg className="w-3.5 h-3.5 mr-2" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3h7v7M14 2L3 13" /></svg>
              在 Bilibili 观看
            </a>
          </p>
        )}
      </motion.div>
    </div>
  )
}

/* ─── Main Template ─── */
export default function ProjectTemplate({ title, subtitle, banner, content = [], textContent = [], birds = [], scatteredBirds = [], collectBoard = null, signs = [], graphics = [], design = null, book = null, video = null, noSidebar = false, splashCursor = false, dynamicBanner = false, contentScale = 1, darkVideo = false, pixelCursor = false, gridscanBanner = false, pageBg = null, links = [], folder = null, threeViews = null, modelingImage = null, model3d = null, poster = null, nextProject = null, scrollBanner = false, scrollBannerTitle = '' }) {
  const contentRef = useRef(null)
  const boardRef = useRef(null)
  const hasTextLayout = textContent.length > 0 || birds.length > 0 || collectBoard
  const flatNav = flattenContent(content)
  const sectionIds = flatNav.map((s) => s.id)
  const activeId = useActiveSection(sectionIds)

  // Split content at first dark section
  const firstDarkIdx = content.findIndex((s) => s.dark)
  const hasDarkSection = firstDarkIdx !== -1
  const lightContent = hasDarkSection ? content.slice(0, firstDarkIdx) : content
  const darkContent = hasDarkSection ? content.slice(firstDarkIdx) : []

  const scrollTo = (id) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }) }

  return (
    <div className="w-full flex flex-col items-center relative" style={{ backgroundColor: pageBg || 'var(--background)', minHeight: '100vh' }}>
      {/* Splash cursor effect */}
      {splashCursor && <SplashCursor RAINBOW_MODE={false} COLOR="#9CFFFA" />}
      {pixelCursor && <PixelCursor />}

      {/* Scattered background birds */}
      {scatteredBirds.map((b) => <ScatteredBird key={b.id} {...b} />)}

      {/* Banner */}
      {scrollBanner ? (
        <ContainerScroll
          bgColor="#030303"
          titleComponent={
            <div className="flex flex-col items-center gap-3">
              <p className="text-lg md:text-2xl tracking-[0.25em] font-medium" style={{ color: '#aaa' }}>
                {scrollBannerTitle || 'BOOKOO品牌设计'}
              </p>
              <h1 className="text-4xl md:text-6xl font-bold tracking-wide" style={{ color: '#fff' }}>
                {title}
              </h1>
            </div>
          }
        >
          <img src={banner} alt={`${title} banner`} className="w-full h-full object-contain rounded-lg" />
        </ContainerScroll>
      ) : gridscanBanner ? (
        <Project6Banner />
      ) : dynamicBanner ? (
        <Project5Banner />
      ) : banner ? (
        <div className="w-full relative z-10">
          <img src={banner} alt={`${title} banner`} className="w-full h-auto block" />
        </div>
      ) : null}

      {/* Title */}
      <div className="w-full max-w-6xl mx-auto px-8 pt-12 pb-6 relative z-10">
        <Link to="/" className="inline-flex items-center text-sm mb-4 transition-colors" style={{ color: pageBg ? '#888' : 'var(--muted-foreground)' }}
          onMouseEnter={(e) => (e.target.style.color = pageBg ? '#fff' : 'var(--foreground)')}
          onMouseLeave={(e) => (e.target.style.color = pageBg ? '#888' : 'var(--muted-foreground)')}>
          <svg className="w-4 h-4 mr-1" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 3l-5 5 5 5" /></svg>
          返回首页
        </Link>
        {!scrollBanner && (
          <h1 className="text-2xl tracking-wider" style={pageBg ? { color: '#fff' } : undefined}>{title}</h1>
        )}
        {!scrollBanner && subtitle && <p className="text-sm mt-1 tracking-wide" style={pageBg ? { fontWeight: 400, color: '#aaa' } : { fontWeight: 400 }}>{subtitle}</p>}
      </div>

      {/* ─── Text + Birds (Project 2 etc.) ─── */}
      {hasTextLayout && (
        <div className="w-full max-w-2xl mx-auto px-8 pb-12 relative z-10 flex flex-col gap-20 text-center">
          {textContent.map((section) => (
            <motion.div key={section.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, ease: 'easeOut' }}>
              <h2 className="text-base mb-3 tracking-wider" style={pageBg ? { color: '#fff' } : undefined}>{section.label}</h2>
              <p className="text-sm leading-relaxed max-w-lg mx-auto" style={pageBg ? { color: '#aaa' } : undefined}>{section.body}</p>
            </motion.div>
          ))}

          {/* Birds stay in the text area only */}
          {birds.map((bird) => <SwayBird key={bird.id} {...bird} />)}
        </div>
      )}

      {/* ─── Book viewer (wide layout, outside text column) ─── */}
      {book && (
        <div className="w-full max-w-6xl mx-auto px-4 pb-20 relative z-10">
          <BookViewer pages={book} />
        </div>
      )}

      {/* ─── Collect board — 元素提取 ─── */}
      {collectBoard && (
        <div className="w-full pb-16 relative z-10" style={{ marginTop: '100px' }}>
          {/* Dot-grid paper background — full width */}
          <div
            className="relative"
            style={{
              backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              backgroundColor: 'var(--card)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            }}
          >
            {/* Inner content — this is the drag boundary */}
            <div
              ref={boardRef}
              className="relative mx-auto"
              style={{ maxWidth: '1100px', padding: '44px 32px 64px' }}
            >
              <h2 className="text-base tracking-wider text-center mb-12">元素提取</h2>

              {/* Photos row */}
              <div className="flex justify-center items-start gap-8" style={{ position: 'relative', zIndex: 1 }}>
                {collectBoard.photos.map((photo) => (
                  <div key={photo.id} className="shrink-0 flex flex-col items-center" style={{ width: '200px' }}>
                    <motion.div
                      className="rounded-sm overflow-hidden shadow-sm w-full"
                      style={{ rotate: photo.rotate, filter: 'grayscale(100%)' }}
                      whileHover={{ scale: 1.04, rotate: '0deg', zIndex: 3, filter: 'grayscale(70%)' }}
                      transition={{ duration: 0.3 }}
                    >
                      <img src={photo.src} alt={photo.label} className="w-full h-auto block" />
                    </motion.div>
                    <p className="text-xs mt-3 text-center" style={{ color: 'var(--muted-foreground)' }}>{photo.label}</p>
                  </div>
                ))}
              </div>

              {/* Draggable elements — pixel constraints, no ref */}
              <div className="relative" style={{ height: '200px', marginTop: '44px', overflow: 'hidden' }}>
                {collectBoard.elements.map((el) => (
                  <motion.div
                    key={el.id}
                    className="absolute"
                    style={{ left: el.x, top: '15%', zIndex: 10, cursor: 'grab' }}
                    drag
                    dragConstraints={{ top: 0, left: 0, right: 960, bottom: 160 }}
                    dragElastic={0}
                    dragMomentum={false}
                    dragTransition={{ bounceStiffness: 800, bounceDamping: 40, power: 0 }}
                    whileHover={{ scale: 1.2, zIndex: 20 }}
                    whileDrag={{ scale: 1.3, zIndex: 30, cursor: 'grabbing' }}
                    transition={{ duration: 0.2 }}
                  >
                    <img
                      src={el.src}
                      alt=""
                      className="block select-none"
                      draggable="false"
                      style={{
                        height: 'auto',
                        maxWidth: el.id === 'e4' ? '48px' : el.id === 'e1' ? '136px' : el.id === 'e3' ? '112px' : '80px',
                        filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.2))',
                        rotate: el.rotate,
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Sign sections: 导视组合设计 + 方案展示 ─── */}
      {signs.length > 0 && <SignSection signs={signs} />}

      {/* ─── Graphics: 图形设计 card stack ─── */}
      {graphics.length > 0 && (
        <div className="relative z-10" style={{ marginTop: '40px' }}>
          <h2 className="text-base tracking-wider text-center mb-12">图形设计</h2>
          <CardStack images={graphics} />
        </div>
      )}

      {/* ─── Design: 设计落地 ─── */}
      {design && (
        <div className="w-full max-w-5xl mx-auto px-8 pb-16 relative z-10" style={{ marginTop: '100px' }}>
          <h2 className="text-base tracking-wider text-center mb-16">设计落地</h2>

          {/* 科普立牌 — 3 small cards grid */}
          <div className="mb-6 max-w-3xl mx-auto">
            <h3 className="text-sm tracking-wide text-center mb-8" style={{ color: 'var(--muted-foreground)' }}>科普立牌</h3>
            <div className="grid grid-cols-3 gap-6">
              {design.signs.slice(0, 3).map((item, i) => (
                <motion.div
                  key={i}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                >
                  <img src={item.src} alt={item.label} className="w-full h-auto block" loading="lazy" />
                  <p className="text-xs mt-2 text-center" style={{ color: 'var(--muted-foreground)' }}>{item.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
          {/* sign-4 — full width, aligned with overview */}
          <div className="mb-20 max-w-3xl mx-auto">
            <motion.div
              style={{ transform: 'scale(1.2)', transformOrigin: 'top center' }}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <img src={design.signs[3].src} alt={design.signs[3].label} className="w-full h-auto block" loading="lazy" />
              <p className="text-xs mt-2 text-center" style={{ color: 'var(--muted-foreground)' }}>{design.signs[3].label}</p>
            </motion.div>
          </div>

          {/* 总览导视 */}
          <div className="mb-20">
            <h3 className="text-sm tracking-wide text-center mb-8" style={{ color: 'var(--muted-foreground)' }}>总览导视</h3>
            <motion.div
              className="max-w-3xl mx-auto"
              style={{ transform: 'scale(1.2)', transformOrigin: 'top center' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <img src={design.overview.src} alt={design.overview.label} className="w-full h-auto block" loading="lazy" />
            </motion.div>
          </div>

          {/* 五个主题导视路牌 — tab switcher */}
          <div>
            <h3 className="text-sm tracking-wide text-center mb-8" style={{ color: 'var(--muted-foreground)' }}>五个主题区域导视路牌</h3>
            <GuideTabs guides={design.guides} />
          </div>
        </div>
      )}

      {/* ─── Content images after text (Project 6 etc.) ─── */}
      {hasTextLayout && content.length > 0 && (
        <div className="w-full max-w-4xl mx-auto px-8 relative z-10 flex flex-col items-center" style={{ gap: '60px' }}>
          {content.map((section, i) => (
            <div key={section.id} className="w-full">
              {section.image && (
                <section id={section.id} className="scroll-mt-10">
                  <h2 className="text-base tracking-wider text-center mb-6" style={pageBg ? { color: '#fff' } : undefined}>{section.label}</h2>
                  <img src={section.image} alt={section.label} className="w-full h-auto block" loading={i === 0 ? 'eager' : 'lazy'} />
                </section>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ─── Folder component (Project 6 etc.) ─── */}
      {folder && (
        <div className="w-full max-w-4xl mx-auto px-8 pb-24 relative z-10 flex flex-col items-center" style={{ marginTop: '140px' }}>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <Folder
              color={folder.color || '#8C9CCA'}
              size={folder.size || 2}
              items={folder.items.map((src, i) => (
                <img key={i} src={src} alt={`card-${i + 1}`} loading="lazy" />
              ))}
            />
          </div>
        </div>
      )}

      {/* ─── Three Views side-by-side (Project 6 etc.) ─── */}
      {threeViews && threeViews.length > 0 && (
        <div className="w-full max-w-5xl mx-auto px-8 pb-24 relative z-10" style={{ marginTop: '30px' }}>
          <h2 className="text-base tracking-wider text-center mb-6" style={pageBg ? { color: '#fff' } : undefined}>IP形象设计</h2>
          <div className="flex gap-6 justify-center">
            {threeViews.map((src, i) => (
              <div key={i} className="flex-1 max-w-[48%]">
                <img src={src} alt={`三视图 ${i + 1}`} className="w-full h-auto block" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Modeling Image (Project 6 etc.) ─── */}
      {modelingImage && (
        <div className="w-full max-w-4xl mx-auto px-8 relative z-10 flex flex-col items-center" style={{ marginTop: '60px' }}>
          <h2 className="text-base tracking-wider text-center mb-6" style={pageBg ? { color: '#fff' } : undefined}>{modelingImage.label}</h2>
          <img src={modelingImage.src} alt={modelingImage.label} className="w-full h-auto block" loading="lazy" style={{ mixBlendMode: pageBg ? 'lighten' : undefined, width: '42%', margin: '0 auto'}} />
        </div>
      )}

      {/* ─── 3D Model Viewer (Project 6 etc.) ─── */}
      {model3d && (
        <div className="w-full max-w-5xl mx-auto px-8 pb-24 relative z-10" style={{ marginTop: '60px' }}>
          <h2 className="text-base tracking-wider text-center mb-6" style={pageBg ? { color: '#fff' } : undefined}>{model3d.label}</h2>
          <ModelViewer src={model3d.src} height="500px" bgColor={pageBg || '#0A0A0F'} />
        </div>
      )}

      {/* ─── Poster (Project 6 etc.) ─── */}
      {poster && (
        <div className="w-full max-w-5xl mx-auto px-8 pb-20 relative z-10" style={{ marginTop: '60px' }}>
          <h2 className="text-base tracking-wider text-center mb-6" style={pageBg ? { color: '#fff' } : undefined}>{poster.label}</h2>
          <div className="rounded-lg overflow-hidden" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
            <img src={poster.src} alt={poster.label} className="w-full h-auto block" loading="lazy" />
          </div>
        </div>
      )}

      {/* ─── Image Content + Sidebar (Project 1 etc.) ─── */}
      {!hasTextLayout && content.length > 0 && (
        <div className={`w-full ${noSidebar ? 'max-w-none px-0' : 'max-w-6xl mx-auto px-8'} ${(hasDarkSection || darkVideo) ? 'pb-0' : 'pb-24'} relative z-10 ${noSidebar ? '' : 'flex gap-10'}`}>
          {/* Sticky sidebar — hidden when noSidebar */}
          {!noSidebar && (
            <nav className="w-48 shrink-0 hidden md:block">
              <ul className="sticky flex flex-col gap-1" style={{ top: '40px' }}>
                {flatNav.map((item) => {
                  const isActive = activeId === item.id
                  return (
                    <li key={item.id} className={item.indent ? 'pl-5' : ''}>
                      <button type="button" onClick={() => scrollTo(item.id)}
                        className="block w-full text-left text-sm py-1.5 px-2 rounded transition-colors"
                        style={{ color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)', fontWeight: isActive ? 600 : 400, backgroundColor: isActive ? 'var(--secondary)' : 'transparent' }}>
                        {item.label}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </nav>
          )}
          {/* Images — light sections */}
          <div ref={contentRef} className={noSidebar ? 'w-full flex flex-col items-center' : 'flex-1 min-w-0'}>
            {lightContent.map((section) => (
              <div key={section.id} style={noSidebar && contentScale !== 1 ? { width: `${contentScale * 100}%` } : undefined}>
                {section.image && (
                  <motion.section
                    id={section.id}
                    className={noSidebar ? '' : 'mb-12 scroll-mt-10'}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  >
                    <div className={noSidebar ? '' : 'bg-white rounded-md shadow-sm overflow-hidden'}>
                      <img src={section.image} alt={section.label} className="w-full h-auto block" loading="eager" onError={(e) => { e.target.src = e.target.src }} />
                    </div>
                  </motion.section>
                )}
                {section.children && section.children.map((child) => (
                  <motion.section
                    key={child.id}
                    id={child.id}
                    className={noSidebar ? '' : 'mb-12 scroll-mt-10'}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  >
                    <div className={noSidebar ? '' : 'bg-white rounded-md shadow-sm overflow-hidden'}>
                      <img src={child.image} alt={child.label} className="w-full h-auto block" loading="lazy" onError={(e) => { e.target.src = e.target.src }} />
                    </div>
                  </motion.section>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Dark sections + Video ── */}
      {hasDarkSection && (
        <div className="w-full relative z-10" style={{ backgroundColor: '#030303' }}>
          <div className={noSidebar ? 'w-full flex flex-col items-center' : 'max-w-6xl mx-auto px-8'}>
            {darkContent.map((section) => (
              <div key={section.id} style={noSidebar && contentScale !== 1 ? { width: `${contentScale * 100}%` } : undefined}>
                {section.image && (
                  <motion.section
                    id={section.id}
                    className={noSidebar ? '' : 'mb-12 scroll-mt-10'}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  >
                    <img src={section.image} alt={section.label} className="w-full h-auto block" loading="eager" onError={(e) => { e.target.src = e.target.src }} />
                  </motion.section>
                )}
                {section.children && section.children.map((child) => (
                  <motion.section
                    key={child.id}
                    id={child.id}
                    className={noSidebar ? '' : 'mb-12 scroll-mt-10'}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  >
                    <img src={child.image} alt={child.label} className="w-full h-auto block" loading="eager" onError={(e) => { e.target.src = e.target.src }} />
                  </motion.section>
                ))}
              </div>
            ))}
          </div>
          <div style={noSidebar && contentScale !== 1 ? { width: `${Math.min(contentScale * 1.4, 1) * 100}%` } : undefined}>
            {video && <VideoSection video={video} />}
          </div>
        </div>
      )}

      {/* ── Video on dark background (no dark content, but darkVideo set) ── */}
      {!hasDarkSection && darkVideo && video && (
        <div className="w-full relative z-10 flex flex-col items-center" style={{ backgroundColor: '#030303' }}>
          <div style={{ width: '60%' }}>
            <VideoSection video={video} fullWidth />
          </div>
        </div>
      )}

      {/* ── Video (normal background) ── */}
      {!hasDarkSection && !darkVideo && video && <VideoSection video={video} />}

      {/* Links */}
      {links.length > 0 && (
        <motion.div className="w-full max-w-4xl mx-auto px-8 pb-16 relative z-10 mt-8 pt-8 border-t" style={{ borderColor: 'var(--border)' }}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
          <h3 className="text-sm font-semibold mb-4 tracking-wide" style={{ color: 'var(--foreground)' }}>相关链接</h3>
          <ul className="space-y-2">
            {links.map((link, i) => (
              <li key={i}>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm transition-colors"
                  style={{ color: 'var(--muted-foreground)' }}
                  onMouseEnter={(e) => (e.target.style.color = 'var(--foreground)')}
                  onMouseLeave={(e) => (e.target.style.color = 'var(--muted-foreground)')}>
                  <svg className="w-3.5 h-3.5 mr-2 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3h7v7M14 2L3 13" /></svg>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* ─── Next Project Navigation ─── */}
      {nextProject && (
        <div className="w-full relative z-10" style={{ borderTop: '1px solid', borderColor: pageBg ? 'rgba(255,255,255,0.1)' : 'var(--border)' }}>
          <div className="max-w-6xl mx-auto px-8 py-12 flex items-center justify-center">
            <Link
              to={`/project/${nextProject.id}`}
              className="group flex items-center gap-3 text-sm tracking-wide transition-colors"
              style={{ color: pageBg ? '#888' : 'var(--muted-foreground)' }}
              onMouseEnter={(e) => (e.target.style.color = pageBg ? '#fff' : 'var(--foreground)')}
              onMouseLeave={(e) => (e.target.style.color = pageBg ? '#888' : 'var(--muted-foreground)')}
            >
              <span style={{ color: pageBg ? '#555' : 'var(--muted-foreground)' }}>下一个项目</span>
              <span className="transition-transform group-hover:translate-x-1">{nextProject.title}</span>
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 3l5 5-5 5" />
              </svg>
            </Link>
          </div>
        </div>
      )}

      {/* ─── Copyright */}
      <div className="w-full relative z-10" style={{ borderTop: '1px solid', borderColor: pageBg ? 'rgba(255,255,255,0.06)' : 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-8 py-6 text-center">
          <p className="text-xs" style={{ color: pageBg ? '#444' : 'var(--muted-foreground)' }}>© 2025 yyting</p>
        </div>
      </div>
    </div>
  )
}
