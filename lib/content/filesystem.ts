import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import type { z } from 'zod'

export type RawContentFile = {
  body: string
  data: Record<string, unknown>
  sourcePath: string
}

export function readContentFiles(directory: string): RawContentFile[] {
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.mdx?$/.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b))
    .map((filename) => readContentFile(path.join(directory, filename)))
}

export function readContentFile(sourcePath: string): RawContentFile {
  const parsed = matter(readFileSync(sourcePath, 'utf8'))

  return {
    body: parsed.content.trim(),
    data: parsed.data as Record<string, unknown>,
    sourcePath
  }
}

export function parseContentMeta<T>(
  schema: z.ZodType<T>,
  data: Record<string, unknown>,
  sourcePath: string
): T {
  const result = schema.safeParse(data)
  if (result.success) return result.data

  const issue = result.error.issues[0]
  const field = issue.path.length > 0 ? issue.path.join('.') : 'frontmatter'
  throw new Error(`Invalid content in ${sourcePath}: ${field} ${issue.message}`)
}
