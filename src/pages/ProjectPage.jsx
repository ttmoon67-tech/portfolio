import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ProjectTemplate from './ProjectTemplate'
import projectData from '@/data/projectData'

export default function ProjectPage() {
  const { id } = useParams()
  const project = projectData.find((p) => p.id === Number(id))

  // 切换项目时滚回顶部
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (!project) {
    return (
      <div className="w-screen min-h-screen flex flex-col items-center justify-center bg-[var(--background)]">
        <p className="text-xl text-stone-500 mb-4">项目未找到</p>
        <a href="/" className="text-sm text-stone-400 hover:text-stone-600 underline">
          返回首页
        </a>
      </div>
    )
  }

  // 下一个项目（循环）
  const currentIdx = projectData.indexOf(project)
  const nextProject = projectData[(currentIdx + 1) % projectData.length]

  return (
    <ProjectTemplate
      title={project.title}
      subtitle={project.subtitle}
      banner={project.banner}
      content={project.content}
      textContent={project.textContent}
      birds={project.birds}
      scatteredBirds={project.scatteredBirds}
      collectBoard={project.collectBoard || null}
      signs={project.signs || []}
      graphics={project.graphics || []}
      design={project.design || null}
      book={project.book || null}
      video={project.video || null}
      noSidebar={project.noSidebar || false}
      splashCursor={project.splashCursor || false}
      dynamicBanner={project.dynamicBanner || false}
      contentScale={project.contentScale || 1}
      darkVideo={project.darkVideo || false}
      pixelCursor={project.pixelCursor || false}
      gridscanBanner={project.gridscanBanner || false}
      pageBg={project.pageBg || null}
      links={project.links || []}
      folder={project.folder || null}
      threeViews={project.threeViews || null}
      modelingImage={project.modelingImage || null}
      model3d={project.model3d || null}
      poster={project.poster || null}
      nextProject={nextProject ? { id: nextProject.id, title: nextProject.title } : null}
      scrollBanner={project.scrollBanner || false}
      scrollBannerTitle={project.scrollBannerTitle || ''}
    />
  )
}
