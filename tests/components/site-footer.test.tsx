import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SiteFooter } from '@/components/site-footer'
import { siteConfig } from '@/lib/site-config'

test('shows the full email as plain text and the full GitHub URL as an external link', () => {
  render(<SiteFooter />)

  const email = screen.getByText(siteConfig.email)
  const github = screen.getByRole('link', { name: siteConfig.github })

  expect(email.closest('a')).toBeNull()
  expect(github).toHaveAttribute('href', siteConfig.github)
  expect(github).toHaveAttribute('target', '_blank')
})

test('toggles the WeChat card with repeated clicks', async () => {
  const user = userEvent.setup()
  render(<SiteFooter />)
  const trigger = screen.getByRole('button', { name: 'WeChat' })

  expect(trigger).toHaveAttribute('aria-expanded', 'false')
  expect(screen.queryByRole('dialog', { name: '微信二维码' })).not.toBeInTheDocument()

  await user.click(trigger)
  expect(trigger).toHaveAttribute('aria-expanded', 'true')
  expect(screen.getByRole('dialog', { name: '微信二维码' })).toBeInTheDocument()
  expect(screen.getByRole('img', { name: 'SylarWang 的微信名片二维码' })).toHaveAttribute(
    'src',
    expect.stringContaining('wechat-card.jpg')
  )

  await user.click(trigger)
  expect(trigger).toHaveAttribute('aria-expanded', 'false')
  expect(screen.queryByRole('dialog', { name: '微信二维码' })).not.toBeInTheDocument()
})

test('opens on hover and keyboard focus, then closes when each leaves', () => {
  render(<SiteFooter />)
  const trigger = screen.getByRole('button', { name: 'WeChat' })

  fireEvent.pointerEnter(trigger)
  expect(screen.getByRole('dialog', { name: '微信二维码' })).toBeInTheDocument()
  fireEvent.pointerLeave(trigger)
  expect(screen.queryByRole('dialog', { name: '微信二维码' })).not.toBeInTheDocument()

  fireEvent.focus(trigger)
  expect(screen.getByRole('dialog', { name: '微信二维码' })).toBeInTheDocument()
  fireEvent.blur(trigger, { relatedTarget: document.body })
  expect(screen.queryByRole('dialog', { name: '微信二维码' })).not.toBeInTheDocument()
})

test('closes the WeChat card with Escape or an outside click', async () => {
  const user = userEvent.setup()
  render(
    <>
      <SiteFooter />
      <button type="button">页脚外部</button>
    </>
  )
  const trigger = screen.getByRole('button', { name: 'WeChat' })

  await user.click(trigger)
  await user.keyboard('{Escape}')
  expect(trigger).toHaveAttribute('aria-expanded', 'false')
  expect(screen.queryByRole('dialog', { name: '微信二维码' })).not.toBeInTheDocument()

  await user.click(trigger)
  await user.click(screen.getByRole('button', { name: '页脚外部' }))
  expect(trigger).toHaveAttribute('aria-expanded', 'false')
  expect(screen.queryByRole('dialog', { name: '微信二维码' })).not.toBeInTheDocument()
})
