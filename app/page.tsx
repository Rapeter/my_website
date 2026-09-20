import Link from 'next/link'
import { ArticleCard } from '@/components/article-card'
import { EmptyBlogState } from '@/components/empty-blog-state'
import { ProjectCard } from '@/components/project-card'
import { getPublishedPosts, type PostEntry } from '@/lib/content/posts'
import { getAllProjects, type ProjectEntry } from '@/lib/content/projects'
import { siteConfig } from '@/lib/site-config'

const capabilities = [
  { code: '01', title: '工作流设计', description: '把模糊任务拆成可执行、可恢复、可验证的 Agent 路径。' },
  { code: '02', title: '工具与能力接入', description: '围绕 Tool Calling、MCP 与能力注册整理可靠的调用边界。' },
  { code: '03', title: '记忆与会话治理', description: '处理身份、工作区、运行会话与长期知识之间的一致性。' },
  { code: '04', title: '评测与可靠性', description: '用契约、回归用例和可观测证据验证真实运行行为。' }
]

export function HomeContent({ projects, posts }: { projects: ProjectEntry[]; posts: PostEntry[] }) {
  const featuredProjects = projects.filter((project) => project.meta.featured)
  const recentPosts = posts.slice(0, 3)

  return (
    <>
      <section className="page-shell home-intro">
        <p className="eyebrow"><span aria-hidden="true">$</span> open_to_work --role ai-application-intern</p>
        <h1>AI Agent /<br />AI 应用开发<span className="home-intro__status">｜求职中</span></h1>
        <p className="home-intro__lead">
          我是王楷中，关注工作流、工具调用与应用落地。我尝试把 Agent 从“能回答”推进到“能可靠完成任务”，并用项目、测试和公开记录证明过程。
        </p>
        <div className="button-row">
          <Link className="button button--primary" href="/projects">项目</Link>
          <Link className="button button--secondary" href="/resume">简历</Link>
          <a className="button button--ghost" href={siteConfig.github} target="_blank" rel="noreferrer">GitHub ↗</a>
        </div>
        <div className="signal-line" aria-label="当前方向">
          <span>Agent workflow</span><span>Tool use</span><span>Memory</span><span>Evaluation</span>
        </div>
      </section>

      <section className="home-band">
        <div className="page-shell section-layout">
          <header className="section-heading">
            <p className="section-kicker">FOCUS / 关注方向</p>
            <h2>我正在建立的能力</h2>
          </header>
          <ol className="capability-grid">
            {capabilities.map((item) => (
              <li key={item.code}>
                <span>{item.code}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="page-shell home-section">
        <header className="section-heading section-heading--row">
          <div><p className="section-kicker">WORK / 项目</p><h2>精选案例</h2></div>
          <Link className="text-link" href="/projects">查看全部项目 →</Link>
        </header>
        <div className="project-grid">
          {featuredProjects.map((project) => <ProjectCard key={project.meta.slug} project={project} />)}
        </div>
      </section>

      <section className="page-shell home-section evidence-section">
        <div className="evidence-section__copy">
          <p className="section-kicker">OPEN SOURCE / 公开证据</p>
          <h2>协作不是一句标签，<br />而是一条可核验的记录。</h2>
          <p>我以项目合作者身份参与 Folio，并提交了安全工具活动时间线：让用户看懂 Agent 正在做什么，同时不暴露原始参数、错误文本和内部工具标识。</p>
        </div>
        <div className="evidence-card">
          <span className="evidence-card__repo">helsome / folio</span>
          <h3>Folio</h3>
          <p>本地优先的 AI 投资研究工作台</p>
          <a href="https://github.com/helsome/folio" target="_blank" rel="noreferrer">查看 GitHub 仓库 ↗</a>
          <a href="https://github.com/helsome/folio/pull/48" target="_blank" rel="noreferrer">查看 PR #48 ↗</a>
        </div>
      </section>

      <section className="home-band">
        <div className="page-shell home-section">
          <header className="section-heading section-heading--row">
            <div><p className="section-kicker">NOTES / 写作</p><h2>最近文章</h2></div>
            <Link className="text-link" href="/blog">进入博客 →</Link>
          </header>
          {recentPosts.length > 0 ? (
            <div className="article-grid">
              {recentPosts.map((post) => <ArticleCard key={post.meta.slug} post={post} />)}
            </div>
          ) : <EmptyBlogState />}
        </div>
      </section>

      <section className="page-shell resume-cta">
        <div>
          <p className="section-kicker">NEXT / 下一站</p>
          <h2>正在寻找 AI 应用开发实习机会</h2>
          <p>墨尔本大学信息技术硕士在读，希望进入重视产品落地、工程验证与真实用户价值的团队。</p>
        </div>
        <Link className="button button--primary" href="/resume">阅读完整简历</Link>
      </section>
    </>
  )
}

export default async function HomePage() {
  return <HomeContent projects={getAllProjects()} posts={getPublishedPosts()} />
}
