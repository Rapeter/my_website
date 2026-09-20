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

test('keeps rich heading anchor labels readable', () => {
  const Heading = mdxComponents.h2!

  render(
    <Heading id="rich-heading">
      <strong>粗体</strong>
      <code>code</code>
    </Heading>
  )

  expect(screen.getByRole('link', { name: '链接到 粗体code' })).toBeInTheDocument()
})
