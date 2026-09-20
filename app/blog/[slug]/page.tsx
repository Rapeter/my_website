import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { compileMDX } from 'next-mdx-remote/rsc'
import readingTime from 'reading-time'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypePrettyCode from 'rehype-pretty-code'
import { mdxComponents } from '@/components/mdx-components'
import { getPostBySlug, getPublishedPosts } from '@/lib/content/posts'

type BlogPostPageProps = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.meta.slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return { title: `${post.meta.title}｜王楷中`, description: post.meta.summary }
}

const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
})

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const posts = getPublishedPosts()
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const index = posts.findIndex((entry) => entry.meta.slug === slug)
  const newer = index > 0 ? posts[index - 1] : null
  const older = index >= 0 && index < posts.length - 1 ? posts[index + 1] : null
  const minutes = Math.max(1, Math.ceil(readingTime(post.body).minutes))
  const { content } = await compileMDX({
    source: post.body,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, rehypePrettyCode]
      }
    }
  })

  return (
    <div className="page-shell page-section reading-shell">
      <Link className="back-link" href="/blog">← 返回博客</Link>
      <header className="article-heading">
        <div className="article-heading__meta">
          <span>{post.meta.category}</span>
          {post.meta.publishedAt ? <time dateTime={post.meta.publishedAt.toISOString()}>{dateFormatter.format(post.meta.publishedAt)}</time> : null}
          <span>{minutes} 分钟阅读</span>
        </div>
        <h1>{post.meta.title}</h1>
        <p>{post.meta.summary}</p>
        <ul className="tag-list" aria-label="文章标签">
          {post.meta.tags.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>
      </header>
      <article className="prose article-prose">{content}</article>
      <nav className="article-navigation" aria-label="相邻文章">
        {newer ? <Link href={`/blog/${newer.meta.slug}`}><span>上一篇</span>{newer.meta.title}</Link> : <span />}
        {older ? <Link href={`/blog/${older.meta.slug}`}><span>下一篇</span>{older.meta.title}</Link> : <span />}
      </nav>
    </div>
  )
}
