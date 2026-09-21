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

  for (const width of [320, 375, 390]) {
    await page.setViewportSize({ width, height: 844 })
    await page.goto('/')
    await page.getByRole('button', { name: 'WeChat' }).click()
    const openSizes = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth
    }))
    expect(openSizes.scroll, `open WeChat card should fit a ${width}px viewport`).toBeLessThanOrEqual(openSizes.client)
  }
})

test('page labels use a sans-serif signpost with a short blue rule', async ({ page }) => {
  await page.goto('/projects')
  const label = page.locator('.eyebrow')

  await expect(label).toHaveText('PROJECTS / 项目')
  const style = await label.evaluate((element) => {
    const labelStyle = getComputedStyle(element)
    const ruleStyle = getComputedStyle(element, '::before')
    return {
      fontFamily: labelStyle.fontFamily.toLowerCase(),
      ruleWidth: Number.parseFloat(ruleStyle.width),
      ruleColor: ruleStyle.backgroundColor
    }
  })

  expect(style.fontFamily).not.toMatch(/monospace|menlo|consolas/)
  expect(style.ruleWidth).toBeGreaterThanOrEqual(20)
  expect(style.ruleColor).not.toBe('rgba(0, 0, 0, 0)')
})

test('desktop hover and repeated click control the WeChat card', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('desktop'), 'desktop interaction only')
  await page.goto('/')
  const trigger = page.getByRole('button', { name: 'WeChat' })
  const card = page.getByRole('dialog', { name: '微信二维码' })

  await trigger.hover()
  await expect(card).toBeVisible()
  await expect(page.getByRole('img', { name: 'SylarWang 的微信名片二维码' })).toBeVisible()

  const triggerBox = await trigger.boundingBox()
  const cardBox = await card.boundingBox()
  expect(triggerBox).not.toBeNull()
  expect(cardBox).not.toBeNull()
  await page.mouse.move(triggerBox!.x + triggerBox!.width / 2, triggerBox!.y - 1)
  await expect(card).toBeVisible()
  await page.mouse.move(
    triggerBox!.x + triggerBox!.width / 2,
    (cardBox!.y + cardBox!.height + triggerBox!.y) / 2
  )
  await expect(card).toBeVisible()
  await page.mouse.move(cardBox!.x + cardBox!.width / 2, cardBox!.y + cardBox!.height / 2)
  await expect(card).toBeVisible()

  await trigger.hover()
  await trigger.click()
  await trigger.click()
  await expect(card).toBeHidden()
})

test('mobile click opens and closes the WeChat card', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('mobile'), 'mobile interaction only')
  await page.goto('/')
  const trigger = page.getByRole('button', { name: 'WeChat' })
  const card = page.getByRole('dialog', { name: '微信二维码' })

  await trigger.click()
  await expect(card).toBeVisible()
  await trigger.click()
  await expect(card).toBeHidden()
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
  await page.getByRole('button', { name: 'WeChat' }).click()
  const wechatImage = page.getByRole('img', { name: 'SylarWang 的微信名片二维码' })
  await expect(wechatImage).toBeVisible()
  await expect.poll(() => wechatImage.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)
  await page.goto('/projects/folio')
  await expect(page.getByRole('heading', { name: 'Folio' })).toBeVisible()
  await page.goto('/blog')
  await expect(page.getByRole('heading', { name: '博客', exact: true })).toBeVisible()
  await page.goto('/resume')
  await expect(page.getByRole('heading', { name: '王楷中' })).toBeVisible()
})

test('dark theme resume remains readable when printed', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('theme', 'dark'))
  await page.goto('/resume')
  await page.emulateMedia({ media: 'print' })

  const paragraph = page.locator('.resume-body p').first()
  await expect(paragraph).toBeVisible()
  expect(await paragraph.evaluate((element) => getComputedStyle(element).color)).toBe('rgb(0, 0, 0)')
})

test('project cards can be opened from the card surface', async ({ page }) => {
  await page.goto('/projects')
  const card = page.locator('.project-card').first()
  const box = await card.boundingBox()
  expect(box).not.toBeNull()
  await page.mouse.click(box!.x + box!.width - 24, box!.y + 24)
  await expect(page).toHaveURL(/\/projects\/folio$/)
})
