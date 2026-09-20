import path from 'node:path'
import { parseContentMeta, readContentFile, readContentFiles } from '@/lib/content/filesystem'
import { postSchema, type ContentEntry, type PostMeta } from '@/lib/content/schemas'

export type PostEntry = ContentEntry<PostMeta>

const postsDirectory = path.join(process.cwd(), 'content', 'posts')

function parsePost(raw: ReturnType<typeof readContentFile>): PostEntry {
  return {
    meta: parseContentMeta(postSchema, raw.data, raw.sourcePath),
    body: raw.body,
    sourcePath: raw.sourcePath
  }
}

export function parsePostFile(sourcePath: string): PostEntry {
  return parsePost(readContentFile(sourcePath))
}

export function filterPublishedPosts(posts: PostEntry[]): PostEntry[] {
  return posts
    .filter((post) => !post.meta.draft)
    .sort((a, b) => {
      if (a.meta.pinned !== b.meta.pinned) return a.meta.pinned ? -1 : 1
      return (b.meta.publishedAt?.getTime() ?? 0) - (a.meta.publishedAt?.getTime() ?? 0)
    })
}

export function getPublishedPosts(): PostEntry[] {
  return filterPublishedPosts(readContentFiles(postsDirectory).map(parsePost))
}

export function getPostBySlug(slug: string): PostEntry | null {
  return getPublishedPosts().find((post) => post.meta.slug === slug) ?? null
}
