import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { HomeContent } from '@/app/page'
import ProjectsPage from '@/app/projects/page'
import { BlogIndex } from '@/app/blog/page'
import AboutPage from '@/app/about/page'
import NotFound from '@/app/not-found'
import { metadata as rootMetadata } from '@/app/layout'
import { metadata as resumeMetadata } from '@/app/resume/page'
import { SiteHeader } from '@/components/site-header'
import { getAllProjects } from '@/lib/content/projects'
import { siteConfig } from '@/lib/site-config'

vi.mock('next/navigation', () => ({ usePathname: () => '/' }))
vi.mock('@/components/theme-toggle', () => ({ ThemeToggle: () => null }))

afterEach(cleanup)

describe('public brand identity', () => {
  test('uses SylarWang in the header and site metadata', () => {
    render(<SiteHeader />)

    expect(screen.getByRole('link', { name: 'SylarWang首页' })).toHaveTextContent('SylarWang')
    expect(screen.queryByText('R/')).not.toBeInTheDocument()
    expect(siteConfig.brandName).toBe('SylarWang')
    expect(siteConfig.legalName).toBe('王楷中')
    expect(rootMetadata.title).toEqual({
      default: 'SylarWang｜AI Agent / AI 应用开发',
      template: '%s｜SylarWang'
    })
    expect(rootMetadata.authors).toEqual([{ name: 'SylarWang', url: 'https://github.com/Rapeter' }])
  })

  test('keeps an absolute legal-name title for the resume', () => {
    expect(resumeMetadata.title).toEqual({
      absolute: '王楷中｜AI 应用开发实习生简历'
    })
  })
})

describe('stable bilingual page labels', () => {
  test('home removes temporary job-seeking copy', () => {
    render(<HomeContent projects={getAllProjects()} posts={[]} />)

    expect(screen.getByText('AI AGENT / 应用开发')).toBeInTheDocument()
    expect(screen.getByText(/我是 SylarWang/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '从项目与经历，了解我的技术方向' })).toBeInTheDocument()
    expect(screen.queryByText(/求职中|open_to_work|正在寻找.*实习机会/)).not.toBeInTheDocument()
    expect(screen.queryByText(/我是王楷中/)).not.toBeInTheDocument()
  })

  test.each([
    ['projects', <ProjectsPage key="projects" />, 'PROJECTS / 项目', /ls \.\/projects/],
    ['blog', <BlogIndex key="blog" posts={[]} />, 'WRITING / 博客', /find \.\/notes/],
    ['about', <AboutPage key="about" />, 'ABOUT / 关于我', /whoami/],
    ['not found', <NotFound key="not-found" />, '404 / 页面未找到', /status --code 404/]
  ])('%s page uses its stable label', (_name, page, label, oldCopy) => {
    render(page)

    expect(screen.getByText(label)).toBeInTheDocument()
    expect(screen.queryByText(oldCopy)).not.toBeInTheDocument()
  })

  test('about and blog avoid temporary job-search status while retaining the blog category', () => {
    const { rerender } = render(<AboutPage />)
    expect(screen.getByRole('heading', { name: '你好，我是 SylarWang。' })).toBeInTheDocument()
    expect(screen.queryByText(/正在寻找实习机会|正在寻找 AI 应用开发实习机会/)).not.toBeInTheDocument()

    rerender(<BlogIndex posts={[]} />)
    expect(screen.getByText('COMING SOON / 即将更新')).toBeInTheDocument()
    expect(screen.queryByText(/我还在求职阶段/)).not.toBeInTheDocument()
  })
})
