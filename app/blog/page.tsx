import type { Metadata } from 'next'
import { ArticleCard } from '@/components/article-card'
import { getPublishedPosts, type PostEntry } from '@/lib/content/posts'

export const metadata: Metadata = {
  title: '博客',
  description: '记录求职复盘、Agent 工程实践与学习过程中的认知变化。'
}

const categories = ['求职复盘', 'Agent 工程', '学习手记'] as const

export function BlogIndex({ posts }: { posts: PostEntry[] }) {
  return (
    <div className="page-shell page-section">
      <header className="page-heading">
        <p className="eyebrow">WRITING / 博客</p>
        <h1>博客</h1>
        <p>记录真实的求职经历、Agent 工程实践，以及学习过程中发生变化的判断。</p>
      </header>

      {posts.length === 0 ? (
        <div className="blog-empty">
          <span>COMING SOON / 即将更新</span>
          <h2>第一篇文章正在准备中</h2>
          <p>先保持诚实的空白。之后会从面试复盘、Agent 工作流与学习感悟开始更新。</p>
        </div>
      ) : (
        <div className="blog-categories">
          {categories.map((category) => {
            const categoryPosts = posts.filter((post) => post.meta.category === category)
            if (categoryPosts.length === 0) return null
            return (
              <section key={category} aria-labelledby={`category-${category}`}>
                <h2 id={`category-${category}`}>{category}</h2>
                <div className="article-grid">
                  {categoryPosts.map((post) => <ArticleCard key={post.meta.slug} post={post} />)}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function BlogPage() {
  return <BlogIndex posts={getPublishedPosts()} />
}
