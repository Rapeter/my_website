import { z } from 'zod'

const evidenceLinkSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
  kind: z.enum(['github', 'pull-request', 'demo', 'article'])
})

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  summary: z.string().min(1),
  role: z.string().min(1),
  period: z.string().min(1).optional(),
  status: z.enum(['active', 'completed', 'learning']),
  tags: z.array(z.string().min(1)).min(1),
  featured: z.boolean().default(false),
  order: z.number().int().nonnegative(),
  cover: z.string().min(1).optional(),
  evidence: z.array(evidenceLinkSchema).default([])
})

export const postSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    title: z.string().min(1),
    summary: z.string().min(1),
    publishedAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    category: z.enum(['求职复盘', 'Agent 工程', '学习手记']),
    tags: z.array(z.string().min(1)).min(1),
    draft: z.boolean().default(true),
    pinned: z.boolean().default(false),
    cover: z.string().min(1).optional(),
    redactCompany: z.boolean().default(false)
  })
  .superRefine((value, context) => {
    if (!value.draft && !value.publishedAt) {
      context.addIssue({
        code: 'custom',
        path: ['publishedAt'],
        message: 'Public posts require publishedAt'
      })
    }
  })

export const resumeSchema = z.object({
  version: z.string().regex(/^\d{4}-\d{2}-[a-z0-9-]+$/),
  title: z.string().min(1),
  targetRole: z.string().min(1),
  updatedAt: z.coerce.date(),
  current: z.boolean(),
  pdf: z.string().min(1).optional()
})

export type ProjectMeta = z.infer<typeof projectSchema>
export type PostMeta = z.infer<typeof postSchema>
export type ResumeMeta = z.infer<typeof resumeSchema>
export type ContentEntry<T> = { meta: T; body: string; sourcePath: string }
