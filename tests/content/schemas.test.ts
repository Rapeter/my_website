import { describe, expect, test } from 'vitest'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { projectSchema, postSchema } from '@/lib/content/schemas'
import { parseProjectFile } from '@/lib/content/projects'

describe('content contracts', () => {
  test('reports a missing project title', () => {
    const result = projectSchema.safeParse({ slug: 'folio', summary: 'x' })

    expect(result.success).toBe(false)
    expect(result.error?.issues.some((issue) => issue.path.join('.') === 'title')).toBe(true)
  })

  test('requires a publication date for a public post', () => {
    const result = postSchema.safeParse({
      slug: 'agent-notes',
      title: 'Agent Notes',
      summary: 'Notes',
      category: 'Agent 工程',
      tags: ['Agent'],
      draft: false
    })

    expect(result.success).toBe(false)
  })

  test('keeps the project period optional', () => {
    const project = projectSchema.parse({
      slug: 'folio',
      title: 'Folio',
      summary: 'A local AI product workspace',
      role: '项目合作者',
      status: 'active',
      tags: ['Agent'],
      order: 1
    })

    expect(project.period).toBeUndefined()
  })

  test('includes the source filename in validation errors', () => {
    const directory = mkdtempSync(path.join(tmpdir(), 'portfolio-content-'))
    const sourcePath = path.join(directory, 'invalid-project.md')
    writeFileSync(sourcePath, '---\nslug: invalid-project\nsummary: Missing a title\n---\nBody')

    try {
      expect(() => parseProjectFile(sourcePath)).toThrow(/invalid-project\.md: title/i)
    } finally {
      rmSync(directory, { recursive: true, force: true })
    }
  })
})
