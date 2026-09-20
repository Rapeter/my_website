import { render, screen } from '@testing-library/react'
import { mdxComponents } from '@/components/mdx-components'

test('external MDX links open safely', () => {
  const ExternalLink = mdxComponents.a!
  render(<ExternalLink href="https://example.com">资料</ExternalLink>)

  expect(screen.getByRole('link', { name: '资料' })).toHaveAttribute('target', '_blank')
  expect(screen.getByRole('link', { name: '资料' })).toHaveAttribute('rel', 'noreferrer')
})

test('rejects MDX images without meaningful alt text', () => {
  const Image = mdxComponents.img!

  expect(() => render(<Image src="/diagram.png" alt="" />)).toThrow(/alt text/i)
})
