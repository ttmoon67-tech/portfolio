/**
 * 项目数据配置中心
 *
 * 添加新项目或修改现有项目只需编辑这个文件：
 *   title   — 项目标题
 *   sections — 左侧分类，每个 section 有 label 和对应的封面图
 *
 * 图片请放在 public/projects/ 目录下。
 */

const BASE = import.meta.env.BASE_URL

const projectData = [
  {
    id: 1,
    title: '0-1出海咖啡器具品牌众筹项目',
    banner: `${BASE}projects/detail/project-1/bg-1.png`,
    scrollBanner: true,
    scrollBannerTitle: 'BOOKOO品牌设计',
    pageBg: '#030303',
    noSidebar: true,
    content: [
      {
        id: 'banner',
        label: '项目总览',
        image: `${BASE}projects/detail/project-1/project-1-banner-v4.png`,
      },
      {
        id: 'think',
        label: '前期思考',
        image: `${BASE}projects/detail/project-1/project-1-01.png`,
      },
      {
        id: 'design',
        label: '设计落地',
        children: [
          { id: 'design-1', label: '01 核心传播页面设计', image: `${BASE}projects/detail/project-1/project-1-02.png` },
          { id: 'design-2', label: '02 品牌视觉延展', image: `${BASE}projects/detail/project-1/project-1-03.png` },
        ],
      },
      {
        id: 'iterate',
        label: '优化迭代',
        children: [
          { id: 'iterate-1', label: '01 广告创意设计', image: `${BASE}projects/detail/project-1/project-1-04.png` },
          { id: 'iterate-2', label: '02 页面优化', image: `${BASE}projects/detail/project-1/project-1-05.png` },
        ],
      },
      {
        id: 'harvest',
        label: '项目收获',
        image: `${BASE}projects/detail/project-1/project-1-06.png`,
      },
    ],
    // 首页弹窗封面（兼容已有）
    sections: [
      { id: 1, label: '品牌视觉', images: [`${BASE}projects/project-1.png`] },
      { id: 2, label: '产品渲染', images: [`${BASE}projects/project-1.png`] },
      { id: 3, label: '众筹页面', images: [`${BASE}projects/project-1.png`] },
      { id: 4, label: '包装设计', images: [`${BASE}projects/project-1.png`] },
    ],
    links: [
      { label: 'Kickstarter 众筹页面', url: 'https://www.kickstarter.com/projects/bookoo/bookoo-100-waterproof-see-through-bluetooth-coffee-scale/description' },
      { label: '淘宝详情页', url: 'https://e.tb.cn/h.RJRCIXoXnjYedkw?tk=5KMTghJ40Q7' },
      { label: 'Bookoo Coffee 官网', url: 'https://bookoocoffee.com' },
    ],
  },
  {
    id: 2,
    title: '儿童公园导视设计案例',
    subtitle: '广州锐丰文化公司',
    banner: `${BASE}projects/detail/project-2/project-2-banner.png`,
    textContent: [
      {
        id: 'about',
        label: '关于项目',
        body: '该公司正在打造一个儿童科普公园，其中东北角的儿童科普属于完整的一片为设计统一导视系统的区域。项目由此展开，要完成视觉化的统一不失趣味性又符合儿童学习游玩的科普东北角。',
      },
      {
        id: 'work',
        label: '工作内容',
        body: '从设计元素开始统一主视觉，围绕主视觉设计科普立牌、科普插画和公园完整的导视系统。',
      },
      {
        id: 'time',
        label: '时间',
        body: '2022.12 — 2023.3.27',
      },
    ],
    birds: [
      { id: 1, src: `${BASE}projects/detail/project-2/bird-1.png`, x: '-62px', y: '18%', size: '130px', delay: '0s' },
      { id: 2, src: `${BASE}projects/detail/project-2/bird-2.png`, x: '90%', y: '8%', size: '150px', delay: '0.6s' },
      { id: 3, src: `${BASE}projects/detail/project-2/bird-3.png`, x: '75%', y: '48%', size: '120px', delay: '1.2s' },
      { id: 4, src: `${BASE}projects/detail/project-2/bird-4.png`, x: '2%', y: '78%', size: '110px', delay: '1.8s' },
    ],
    // 散落背景小鸟（小、半透明、随机浮动）
    scatteredBirds: [],
    // 元素提取收集板
    collectBoard: {
      photos: [
        { id: 'p1', src: `${BASE}projects/detail/project-2/elements/photo-1.png`, label: '生态环境', rotate: '-3deg', x: '0%', y: '0%' },
        { id: 'p2', src: `${BASE}projects/detail/project-2/elements/photo-2.png`, label: '植物树林', rotate: '2deg', x: '52%', y: '0%' },
        { id: 'p3', src: `${BASE}projects/detail/project-2/elements/photo-3.png`, label: '园区地形', rotate: '-2deg', x: '0%', y: '52%' },
        { id: 'p4', src: `${BASE}projects/detail/project-2/elements/photo-4.png`, label: '探索', rotate: '4deg', x: '52%', y: '52%' },
      ],
      elements: [
        { id: 'e1', src: `${BASE}projects/detail/project-2/elements/element-cloud.png`, x: '8%', y: '30%', rotate: '-6deg' },
        { id: 'e2', src: `${BASE}projects/detail/project-2/elements/element-tree.png`, x: '28%', y: '20%', rotate: '5deg' },
        { id: 'e3', src: `${BASE}projects/detail/project-2/elements/element-outline.png`, x: '50%', y: '25%', rotate: '-4deg' },
        { id: 'e4', src: `${BASE}projects/detail/project-2/elements/element-lake.png`, x: '68%', y: '15%', rotate: '3deg' },
        { id: 'e5', src: `${BASE}projects/detail/project-2/elements/element-question.png`, x: '88%', y: '28%', rotate: '8deg' },
      ],
    },
    design: {
      signs: [
        { label: '科普立牌', src: `${BASE}projects/detail/project-2/design/sign-1.png` },
        { label: '科普立牌', src: `${BASE}projects/detail/project-2/design/sign-2.png` },
        { label: '科普立牌', src: `${BASE}projects/detail/project-2/design/sign-3.png` },
        { label: '实际尺寸', src: `${BASE}projects/detail/project-2/design/sign-4.png` },
      ],
      overview: { label: '总览导视', src: `${BASE}projects/detail/project-2/design/overview-v2.png` },
      guides: [
        { label: '主题一', src: `${BASE}projects/detail/project-2/design/guide-1.png` },
        { label: '主题二', src: `${BASE}projects/detail/project-2/design/guide-2.png` },
        { label: '主题三', src: `${BASE}projects/detail/project-2/design/guide-3.png` },
        { label: '主题四', src: `${BASE}projects/detail/project-2/design/guide-4.png` },
        { label: '主题五', src: `${BASE}projects/detail/project-2/design/guide-5.png` },
      ],
    },
    signs: [
      { id: 'composition', label: '导视组合设计', src: `${BASE}projects/detail/project-2/signs/composition-v2.png` },
      { id: 'showcase', label: '方案展示', src: `${BASE}projects/detail/project-2/signs/showcase-v3.png` },
    ],
    graphics: [
      { title: '导览地图', description: '', src: `${BASE}projects/detail/project-2/graphics/map.png`, color: '#dfd9ec', textColor: '#3d3c4f' },
      { title: '总览科普图', description: '', src: `${BASE}projects/detail/project-2/graphics/overview.png`, color: '#e6a5b8', textColor: '#4b2e36' },
      { title: '科普插画', description: '', src: `${BASE}projects/detail/project-2/graphics/illust-1.png`, color: '#8a79ab', textColor: '#f8f7fa' },
      { title: '科普插画', description: '', src: `${BASE}projects/detail/project-2/graphics/illust-2.png`, color: '#f0c88d', textColor: '#3d3c4f' },
    ],
    sections: [
      { id: 1, label: '导视系统', images: [`${BASE}projects/project-2.png`] },
      { id: 2, label: '标识设计', images: [`${BASE}projects/project-2.png`] },
      { id: 3, label: '色彩规划', images: [`${BASE}projects/project-2.png`] },
      { id: 4, label: '实地效果', images: [`${BASE}projects/project-2.png`] },
    ],
  },
  {
    id: 3,
    title: '广州黄埔长洲岛视觉识别系统',
    subtitle: '视觉设计师（实习）— 导师带队作品　·　2022.12 – 2023.03',
    textContent: [
      {
        id: 'intro',
        label: '关于项目',
        body: '为广州市黄埔区「长沙岛」从0搭建VI视觉识别系统：挖掘品牌故事内核，完成Logo延展及周边衍生品（T恤、帆布袋、贴纸）的视觉落地，从概念到实物闭环交付。     三人核心团队中独立负责视觉板块，小团队全链路把控能力的早期锻炼。',
      },
    ],
    book: [
      `${BASE}projects/detail/project-3/book/page-01.png`,
      `${BASE}projects/detail/project-3/book/page-02.png`,
      `${BASE}projects/detail/project-3/book/page-03.png`,
      `${BASE}projects/detail/project-3/book/page-04.png`,
      `${BASE}projects/detail/project-3/book/page-05.png`,
      `${BASE}projects/detail/project-3/book/page-06.png`,
      `${BASE}projects/detail/project-3/book/page-07.png`,
      `${BASE}projects/detail/project-3/book/page-08.png`,
      `${BASE}projects/detail/project-3/book/page-09.png`,
      `${BASE}projects/detail/project-3/book/page-10.png`,
      `${BASE}projects/detail/project-3/book/page-11.png`,
      `${BASE}projects/detail/project-3/book/page-12.png`,
      `${BASE}projects/detail/project-3/book/page-13.png`,
      `${BASE}projects/detail/project-3/book/page-14.png`,
      `${BASE}projects/detail/project-3/book/page-15.png`,
      `${BASE}projects/detail/project-3/book/page-16.png`,
      `${BASE}projects/detail/project-3/book/page-17.png`,
      `${BASE}projects/detail/project-3/book/page-18.png`,
      `${BASE}projects/detail/project-3/book/page-19.png`,
      `${BASE}projects/detail/project-3/book/page-20.png`,
      `${BASE}projects/detail/project-3/book/page-21.png`,
      `${BASE}projects/detail/project-3/book/page-22.png`,
      `${BASE}projects/detail/project-3/book/page-23.png`,
      `${BASE}projects/detail/project-3/book/page-24.png`,
      `${BASE}projects/detail/project-3/book/page-25.png`,
      `${BASE}projects/detail/project-3/book/page-26.png`,
      `${BASE}projects/detail/project-3/book/page-27.png`,
      `${BASE}projects/detail/project-3/book/page-28.png`,
      `${BASE}projects/detail/project-3/book/page-29.png`,
      `${BASE}projects/detail/project-3/book/page-30.png`,
      '__blank__',
    ],
    sections: [
      { id: 1, label: 'LOGO 设计', images: [`${BASE}projects/project-3.png`] },
      { id: 2, label: 'VI 延展', images: [`${BASE}projects/project-3.png`] },
      { id: 3, label: '导览地图', images: [`${BASE}projects/project-3.png`] },
      { id: 4, label: '文创周边', images: [`${BASE}projects/project-3.png`] },
    ],
  },
  {
    id: 4,
    title: '游园惊梦—《牡丹亭》视觉新媒体表达',
    subtitle: '动态海报 · 交互装置 · 影像创作 · 字体实验',
    banner: `${BASE}projects/detail/project-4/banner.png`,
    content: [
      { id: 'page-1', label: '动态海报', image: `${BASE}projects/detail/project-4/page-01.png` },
      { id: 'page-2', label: '交互装置', image: `${BASE}projects/detail/project-4/page-02.png` },
      { id: 'page-3', label: '影像创作', image: `${BASE}projects/detail/project-4/page-03.png` },
      { id: 'page-4', label: '字体实验', image: `${BASE}projects/detail/project-4/page-04.png` },
      { id: 'page-5', label: '视觉系统', image: `${BASE}projects/detail/project-4/page-05.png`, dark: true },
    ],
    noSidebar: true,
    splashCursor: true,
    video: {
      cover: `${BASE}projects/detail/project-4/Video cover image.jpg`,
      file: `${BASE}projects/detail/project-4/video.mp4`,
      youtubeUrl: 'https://www.youtube.com/watch?v=IlvxVgyhGQA',
    },
    sections: [
      { id: 1, label: '动态海报', images: [`${BASE}projects/project-4.png`] },
      { id: 2, label: '交互装置', images: [`${BASE}projects/project-4.png`] },
      { id: 3, label: '影像创作', images: [`${BASE}projects/project-4.png`] },
      { id: 4, label: '字体实验', images: [`${BASE}projects/project-4.png`] },
    ],
  },
  {
    id: 5,
    title: '小小世界—建模类作品',
    subtitle: '角色建模 · 场景设计 · 材质渲染 · 动画截图',
    banner: `${BASE}projects/detail/project-5/project-5-banner.png`,
    dynamicBanner: true,
    noSidebar: true,
    contentScale: 0.6,
    content: [
      { id: 'page-1', label: '角色建模', image: `${BASE}projects/detail/project-5/page-01.png` },
      { id: 'page-2', label: '场景设计', image: `${BASE}projects/detail/project-5/page-02.png` },
      { id: 'page-3', label: '材质渲染', image: `${BASE}projects/detail/project-5/page-03.png` },
      { id: 'page-4', label: '动画作品', image: `${BASE}projects/detail/project-5/page-04.png` },
    ],
    darkVideo: true,
    pixelCursor: true,
    video: {
      file: `${BASE}projects/detail/project-5/video.mp4`,
      cover: `${BASE}projects/detail/project-5/video-cover.jpg`,
      bilibiliId: 'BV1hPZgYPEWY',
      bilibiliUrl: 'https://www.bilibili.com/video/BV1hPZgYPEWY/',
    },
    sections: [
      { id: 1, label: '角色建模', images: [`${BASE}projects/project-5.png`] },
      { id: 2, label: '场景设计', images: [`${BASE}projects/project-5.png`] },
      { id: 3, label: '材质渲染', images: [`${BASE}projects/project-5.png`] },
      { id: 4, label: '动画截图', images: [`${BASE}projects/project-5.png`] },
    ],
  },
  {
    id: 6,
    title: '醒狮宇宙—IP作品',
    subtitle: 'IP 形象 · 角色设定 · 场景插画 · 周边产品',
    banner: `${BASE}projects/detail/project-6/project-6-banner.png`,
    gridscanBanner: true,
    pageBg: '#0A0A0F',
    textContent: [
      {
        id: 'intro',
        label: '项目介绍',
        body: '为醒狮宇宙美育小组以中小学生及其家长开拓美育性质的文创产品(包括研学材料包)以及各式体验课程。需要制作IP形象打造品牌效应。',
      },
      {
        id: 'design',
        label: '设计内容',
        body: '围绕醒狮完成IP设计，塑造品牌。需要制作，品牌logo，IP形象，根据市场调研儿童普遍对3D形象更为感兴趣，需要深化三维IP，制作相关宣传海报和衍生品周边。',
      },
      {
        id: 'time',
        label: '时间',
        body: '2024',
      },
    ],
    content: [
      { id: 'visual-design', label: '视觉设计', image: `${BASE}projects/detail/project-6/visual-design.png` },
    ],
    folder: {
      color: '#8C9CCA',
      size: 0.88,
      items: [
        `${BASE}projects/detail/project-6/card-1.png`,
        `${BASE}projects/detail/project-6/card-2.png`,
        `${BASE}projects/detail/project-6/card-3.png`,
      ],
    },
    threeViews: [
      `${BASE}projects/detail/project-6/three-views-1.png`,
      `${BASE}projects/detail/project-6/three-views-2.png`,
    ],
    modelingImage: {
      label: 'IP角色建模三视图',
      src: `${BASE}projects/detail/project-6/modeling-three-view-drawings.png`,
    },
    poster: {
      label: '宣传海报',
      src: `${BASE}projects/detail/project-6/poster.png`,
    },
    sections: [
      { id: 1, label: 'IP 形象', images: [`${BASE}projects/project-6.png`] },
      { id: 2, label: '角色设定', images: [`${BASE}projects/project-6.png`] },
      { id: 3, label: '场景插画', images: [`${BASE}projects/project-6.png`] },
      { id: 4, label: '周边产品', images: [`${BASE}projects/project-6.png`] },
    ],
  },
]

export default projectData
