import type { MetadataRoute } from 'next'
import { getPublishedPosts } from '@/lib/content/posts'
import { getAllProjects } from '@/lib/content/projects'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')
  const staticPaths = ['/', '/projects', '/blog', '/resume', '/about']
  const projectPaths = getAllProjects().map((project) => `/projects/${project.meta.slug}`)
  const postPaths = getPublishedPosts().map((post) => `/blog/${post.meta.slug}`)

  return [...staticPaths, ...projectPaths, ...postPaths].map((path) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : path.split('/').length === 2 ? 0.8 : 0.7
  }))
}
