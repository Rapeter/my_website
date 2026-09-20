import Link from 'next/link'
import type { PostEntry } from '@/lib/content/posts'

const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: 'UTC'
})

export function ArticleCard({ post }: { post: PostEntry }) {
  return (
    <article className="article-card">
      <div className="article-card__meta">
        <span>{post.meta.category}</span>
        {post.meta.publishedAt ? <time dateTime={post.meta.publishedAt.toISOString()}>{dateFormatter.format(post.meta.publishedAt)}</time> : null}
      </div>
      <h3><Link href={`/blog/${post.meta.slug}`}>{post.meta.title}</Link></h3>
      <p>{post.meta.summary}</p>
      <Link className="text-link" href={`/blog/${post.meta.slug}`}>阅读全文 →</Link>
    </article>
  )
}
