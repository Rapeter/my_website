import type { Metadata } from 'next'
import { ProjectCard } from '@/components/project-card'
import { getAllProjects } from '@/lib/content/projects'

export const metadata: Metadata = {
  title: '项目｜王楷中',
  description: 'AI Agent、工具调用、记忆治理与应用落地相关项目案例。'
}

export default function ProjectsPage() {
  const projects = getAllProjects()

  return (
    <div className="page-shell page-section">
      <header className="page-heading">
        <p className="eyebrow"><span aria-hidden="true">$</span> ls ./projects</p>
        <h1>项目案例</h1>
        <p>从问题、工作流和技术决策出发，展示我如何把 Agent 能力推进到可验证的应用里。</p>
      </header>
      <div className="project-grid">
        {projects.map((project) => <ProjectCard key={project.meta.slug} project={project} />)}
      </div>
    </div>
  )
}
