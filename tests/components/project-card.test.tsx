import { render, screen } from '@testing-library/react'
import { ProjectCard } from '@/components/project-card'

test('renders a project without an image or date', () => {
  render(
    <ProjectCard
      project={{
        meta: {
          slug: 'miniclaw',
          title: 'Miniclaw',
          summary: '自托管多渠道 Agent 工作台与记忆治理',
          role: '个人项目 / 开源参考实现',
          status: 'active',
          tags: ['Agent', 'Memory'],
          featured: true,
          order: 3,
          evidence: []
        },
        body: '',
        sourcePath: 'content/projects/miniclaw.mdx'
      }}
    />
  )

  expect(screen.getByRole('heading', { name: 'Miniclaw' })).toBeInTheDocument()
  expect(screen.queryByRole('img')).not.toBeInTheDocument()
  expect(screen.queryByText(/待补|unknown/i)).not.toBeInTheDocument()
  expect(screen.getByRole('link', { name: /查看案例/ })).toHaveAttribute(
    'href',
    '/projects/miniclaw'
  )
})
