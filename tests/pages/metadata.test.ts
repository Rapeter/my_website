import { expect, test } from 'vitest'
import sitemap from '@/app/sitemap'

test('sitemap includes public routes and excludes drafts and resume history', () => {
  const entries = sitemap()
  const paths = entries.map((entry) => new URL(entry.url).pathname)

  expect(paths).toContain('/resume')
  expect(paths).toContain('/projects/folio')
  expect(paths).not.toContain('/resume/2026-09-ai-app')
  expect(paths).not.toContain('/blog/private-draft')
})
