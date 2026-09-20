import { describe, expect, test } from 'vitest'
import type { PostEntry } from '@/lib/content/posts'
import { filterPublishedPosts } from '@/lib/content/posts'

describe('published posts', () => {
  test('removes drafts and sorts pinned posts before newer unpinned posts', () => {
    const draftPost = {
      meta: { draft: true, pinned: false, publishedAt: undefined }
    } as PostEntry
    const publicPost = {
      meta: { draft: false, pinned: false, publishedAt: new Date('2026-09-10') }
    } as PostEntry
    const pinnedPost = {
      meta: { draft: false, pinned: true, publishedAt: new Date('2026-08-01') }
    } as PostEntry

    expect(filterPublishedPosts([draftPost, publicPost, pinnedPost])).toEqual([
      pinnedPost,
      publicPost
    ])
  })
})
