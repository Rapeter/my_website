import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'

test('presents the role and primary navigation', () => {
  render(<HomePage />)

  expect(screen.getByRole('heading', { name: /AI Agent/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: '项目' })).toHaveAttribute('href', '/projects')
  expect(screen.getByRole('link', { name: '简历' })).toHaveAttribute('href', '/resume')
})
