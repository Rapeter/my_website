import { render, screen } from '@testing-library/react'
import ProjectsPage from '@/app/projects/page'
import ProjectDetailPage from '@/app/projects/[slug]/page'

test('orders the project index by the curated project order', () => {
  const { container } = render(<ProjectsPage />)
  const titles = Array.from(container.querySelectorAll('h2')).map((heading) => heading.textContent)

  expect(titles).toEqual(['Folio', 'Craft Agents', 'Miniclaw'])
})

test('renders Folio public evidence links safely', async () => {
  render(
    await ProjectDetailPage({
      params: Promise.resolve({ slug: 'folio' })
    })
  )

  const repository = screen.getByRole('link', { name: 'GitHub 仓库' })
  const pullRequest = screen.getByRole('link', { name: '安全工具活动时间线 PR' })

  expect(repository).toHaveAttribute('href', 'https://github.com/helsome/folio')
  expect(repository).toHaveAttribute('target', '_blank')
  expect(repository).toHaveAttribute('rel', 'noreferrer')
  expect(pullRequest).toHaveAttribute('href', 'https://github.com/helsome/folio/pull/48')
})

test('uses the not-found path for an unknown project', async () => {
  await expect(
    ProjectDetailPage({ params: Promise.resolve({ slug: 'missing-project' }) })
  ).rejects.toThrow()
})
