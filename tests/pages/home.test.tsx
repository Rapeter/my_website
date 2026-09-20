import { render, screen } from '@testing-library/react'
import HomePage, { HomeContent } from '@/app/page'
import { getAllProjects } from '@/lib/content/projects'
import type { PostEntry } from '@/lib/content/posts'

test('shows identity, evidence, and honest article state', async () => {
  render(await HomePage())

  expect(screen.getByRole('heading', { name: /AI Agent.*AI 应用开发/i })).toBeInTheDocument()
  expect(screen.getAllByText('Folio').length).toBeGreaterThan(0)
  expect(screen.getByText(/准备写作的方向/)).toBeInTheDocument()
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

  expect(screen.queryByText(/准备写作的方向/)).not.toBeInTheDocument()
  expect(screen.getByRole('heading', { name: '最新文章' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: '第二篇' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: '第三篇' })).toBeInTheDocument()
  expect(screen.queryByRole('heading', { name: '不应出现' })).not.toBeInTheDocument()
})
