import { render, screen } from '@testing-library/react'
import path from 'node:path'
import { BlogIndex } from '@/app/blog/page'
import { buildStaticParams } from '@/app/blog/[slug]/page'
import { filterPublishedPosts, parsePostFile } from '@/lib/content/posts'

test('shows an honest empty state when there are no public posts', () => {
  render(<BlogIndex posts={[]} />)

  expect(screen.getByText(/第一篇文章正在准备中/)).toBeInTheDocument()
  expect(screen.queryByRole('article')).not.toBeInTheDocument()
})

test('builds routes from public fixtures while excluding drafts', () => {
  const draft = parsePostFile(path.join(process.cwd(), 'tests', 'fixtures', 'posts', 'draft.mdx'))
  const published = parsePostFile(path.join(process.cwd(), 'tests', 'fixtures', 'posts', 'published.mdx'))

  expect(filterPublishedPosts([draft])).toEqual([])
  expect(buildStaticParams([draft, published])).toEqual([{ slug: 'published-note' }])
})
