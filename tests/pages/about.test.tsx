import { render, screen } from '@testing-library/react'
import AboutPage from '@/app/about/page'

test('summarizes education, Agent focus, and contact without reproducing the resume', () => {
  render(<AboutPage />)

  expect(screen.getAllByText(/墨尔本大学/).length).toBeGreaterThan(0)
  expect(screen.getByText(/AI Agent/)).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /Email/ })).toHaveAttribute(
    'href',
    'mailto:kaizhongw@student.unimelb.edu.au'
  )
  expect(screen.getByRole('link', { name: /GitHub/ })).toHaveAttribute(
    'href',
    'https://github.com/Rapeter'
  )
  expect(screen.queryByText(/七道闸门/)).not.toBeInTheDocument()
})
