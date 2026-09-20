import Link from 'next/link'
import type { ProjectEntry } from '@/lib/content/projects'

const statusLabels = {
  active: '持续迭代',
  completed: '阶段完成',
  learning: '研习中'
} as const

export function ProjectCard({ project }: { project: ProjectEntry }) {
  const { meta } = project

  return (
    <article className="project-card">
      {meta.cover ? <img className="project-card__cover" src={meta.cover} alt="" /> : null}
      <div className="project-card__topline">
        <span className="status-dot" data-status={meta.status}>{statusLabels[meta.status]}</span>
        <span>{meta.role}</span>
        {meta.period ? <span>{meta.period}</span> : null}
      </div>
      <h2><Link href={`/projects/${meta.slug}`}>{meta.title}</Link></h2>
      <p>{meta.summary}</p>
      <ul className="tag-list" aria-label={`${meta.title} 技术标签`}>
        {meta.tags.map((tag) => <li key={tag}>{tag}</li>)}
      </ul>
      <Link className="text-link" href={`/projects/${meta.slug}`}>
        查看案例 <span aria-hidden="true">↗</span>
      </Link>
    </article>
  )
}
