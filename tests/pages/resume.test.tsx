import { render, screen } from '@testing-library/react'
import { ResumeDocument, resumeBodyForDisplay } from '@/components/resume-document'
import type { ResumeEntry } from '@/lib/content/resumes'

const currentResume: ResumeEntry = {
  meta: {
    version: '2026-09-ai-app',
    title: '王楷中',
    targetRole: 'AI 应用开发实习生',
    updatedAt: new Date('2026-09-01'),
    current: true
  },
  body: '',
  sourcePath: 'content/resumes/2026-09-ai-app.md'
}

test('renders only the current resume without a version selector', () => {
  render(<ResumeDocument resume={currentResume} />)

  expect(screen.getByRole('heading', { name: '王楷中' })).toBeInTheDocument()
  expect(screen.getByText('AI 应用开发实习生')).toBeInTheDocument()
  expect(screen.queryByLabelText(/简历版本/)).not.toBeInTheDocument()
})

test('omits the download action when no PDF exists', () => {
  render(<ResumeDocument resume={currentResume} />)

  expect(screen.queryByRole('link', { name: /PDF/ })).not.toBeInTheDocument()
})

test('shows the download action only when the current resume has a PDF', () => {
  render(
    <ResumeDocument
      resume={{ ...currentResume, meta: { ...currentResume.meta, pdf: '/resume.pdf' } }}
    />
  )

  expect(screen.getByRole('link', { name: /PDF/ })).toHaveAttribute('href', '/resume.pdf')
})

test('omits the unresolved Miniclaw period from the displayed body', () => {
  const displayed = resumeBodyForDisplay('# 王楷中\n\n## 项目经历\n\nMiniclaw\n[时间待补]\n技术栈')

  expect(displayed).toContain('Miniclaw')
  expect(displayed).not.toContain('时间待补')
})
