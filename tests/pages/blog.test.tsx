import { render, screen } from '@testing-library/react'
import path from 'node:path'
import { BlogIndex } from '@/app/blog/page'
import { generateStaticParams } from '@/app/blog/[slug]/page'
import { filterPublishedPosts, parsePostFile } from '@/lib/content/posts'

test('shows an honest empty state when there are no public posts', () => {
  render(<BlogIndex posts={[]} />)

  expect(screen.getByText(/第一篇文章正在准备中/)).toBeInTheDocument()
  expect(screen.queryByRole('article')).not.toBeInTheDocument()
})

test('excludes draft fixtures from publication and static routes', () => {
  const draft = parsePostFile(path.join(process.cwd(), 'tests', 'fixtures', 'posts', 'draft.mdx'))

  expect(filterPublishedPosts([draft])).toEqual([])
  expect(generateStaticParams()).toEqual([])
})
