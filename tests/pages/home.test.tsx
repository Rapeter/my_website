import { render, screen } from '@testing-library/react'
import { HomeContent } from '@/app/page'
import { getAllProjects } from '@/lib/content/projects'
import type { PostEntry } from '@/lib/content/posts'

test('shows identity, evidence, and honest article state with no posts', () => {
  render(<HomeContent projects={getAllProjects()} posts={[]} />)

  expect(screen.getByRole('heading', { name: /AI Agent.*AI 应用开发/i })).toBeInTheDocument()
  expect(screen.getAllByText('Folio').length).toBeGreaterThan(0)
  expect(screen.getByText(/持续记录的方向/)).toBeInTheDocument()
  expect(screen.queryByText(/篇文章|访问量|项目数量/)).not.toBeInTheDocument()
})

test('replaces the empty state with only the three newest published posts', () => {
  const posts = ['最新文章', '第二篇', '第三篇', '不应出现'].map((title, index) => ({
    meta: {
      slug: `post-${index + 1}`,
      title,
      summary: `${title}摘要`,
      publishedAt: new Date(`2026-09-${10 - index}`),
      category: '学习手记',
      tags: ['学习'],
      draft: false,
      pinned: false,
      redactCompany: false
    },
    body: '',
    sourcePath: `content/posts/post-${index + 1}.mdx`
  })) as PostEntry[]

  render(<HomeContent projects={getAllProjects()} posts={posts} />)

  expect(screen.queryByText(/持续记录的方向/)).not.toBeInTheDocument()
  expect(screen.getByRole('heading', { name: '最新文章' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: '第二篇' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: '第三篇' })).toBeInTheDocument()
  expect(screen.queryByRole('heading', { name: '不应出现' })).not.toBeInTheDocument()
})

test('recent posts are ordered by date even when an older article is pinned', () => {
  const posts = [
    { title: '旧置顶文章', date: '2026-01-01', pinned: true },
    { title: '最新文章', date: '2026-09-10', pinned: false },
    { title: '第二篇', date: '2026-09-09', pinned: false },
    { title: '第三篇', date: '2026-09-08', pinned: false }
  ].map(({ title, date, pinned }, index) => ({
    meta: {
      slug: `dated-${index + 1}`,
      title,
      summary: `${title}摘要`,
      publishedAt: new Date(date),
      category: '学习手记',
      tags: ['学习'],
      draft: false,
      pinned,
      redactCompany: false
    },
    body: '',
    sourcePath: `content/posts/dated-${index + 1}.mdx`
  })) as PostEntry[]

  render(<HomeContent projects={getAllProjects()} posts={posts} />)

  expect(screen.getByRole('heading', { name: '最新文章' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: '第二篇' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: '第三篇' })).toBeInTheDocument()
  expect(screen.queryByRole('heading', { name: '旧置顶文章' })).not.toBeInTheDocument()
})
