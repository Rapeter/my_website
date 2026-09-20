import type { ReactNode } from 'react'
import type { ResumeEntry } from '@/lib/content/resumes'
import { siteConfig } from '@/lib/site-config'

export function resumeBodyForDisplay(body: string) {
  const educationStart = body.indexOf('## 教育经历')
  const sections = educationStart >= 0 ? body.slice(educationStart) : body
  return sections
    .split('\n')
    .filter((line) => line.trim() !== '[时间待补]')
    .join('\n')
}

export function ResumeDocument({ resume, children }: { resume: ResumeEntry; children?: ReactNode }) {
  return (
    <article className="resume-page">
      <header className="resume-header">
        <div className="resume-header__identity">
          <p className="section-kicker">RESUME / 当前简历</p>
          <h1>{resume.meta.title}</h1>
          <p className="resume-role">{resume.meta.targetRole}</p>
          <address>
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            <a href={siteConfig.github} target="_blank" rel="noreferrer">github.com/{siteConfig.handle}</a>
          </address>
        </div>
        <img className="resume-photo" src="/images/profile.jpg" alt="王楷中证件照" width="118" height="148" />
      </header>

      <div className="resume-actions">
        <a href={`mailto:${siteConfig.email}`}>联系我</a>
        {resume.meta.pdf ? <a href={resume.meta.pdf} download>下载 PDF</a> : null}
      </div>

      {children ? <div className="resume-body prose">{children}</div> : null}
    </article>
  )
}
