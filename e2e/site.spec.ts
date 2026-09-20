import { expect, test } from '@playwright/test'

test('stored dark theme survives navigation', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('theme', 'dark'))
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  const menu = page.getByRole('button', { name: '打开主导航' })
  if (await menu.isVisible()) await menu.click()
  await page.getByRole('navigation', { name: '主导航' }).getByRole('link', { name: '项目' }).click()
  await expect(page).toHaveURL(/\/projects$/)
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
})

test('mobile pages do not overflow horizontally', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })

  for (const path of ['/', '/projects', '/projects/folio', '/blog', '/resume', '/about']) {
    await page.goto(path)
    const sizes = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth
    }))
    expect(sizes.scroll, `${path} should stay within the viewport`).toBeLessThanOrEqual(sizes.client)
  }
})

test('mobile navigation exposes its state accessibly', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const menu = page.getByRole('button', { name: '打开主导航' })
  await expect(menu).toHaveAttribute('aria-expanded', 'false')
  await menu.click()
  await expect(page.getByRole('button', { name: '关闭主导航' })).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByRole('navigation', { name: '主导航' }).getByRole('link', { name: '简历' })).toBeVisible()
})

test('core pages render without external network access', async ({ page, baseURL }) => {
  const localOrigin = new URL(baseURL!).origin
  await page.route('**/*', async (route) => {
    const requestOrigin = new URL(route.request().url()).origin
    if (requestOrigin !== localOrigin) await route.abort()
    else await route.continue()
  })

  await page.goto('/')
  await expect(page.getByRole('heading', { name: /AI Agent.*AI 应用开发/ })).toBeVisible()
  await page.goto('/projects/folio')
  await expect(page.getByRole('heading', { name: 'Folio' })).toBeVisible()
  await page.goto('/blog')
  await expect(page.getByText(/第一篇文章正在准备中/)).toBeVisible()
  await page.goto('/resume')
  await expect(page.getByRole('heading', { name: '王楷中' })).toBeVisible()
})
