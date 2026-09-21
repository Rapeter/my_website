import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: '关于',
  description: '关于 SylarWang：墨尔本大学信息技术硕士在读，关注 AI Agent 与 AI 应用开发。'
}

export default function AboutPage() {
  return (
    <div className="page-shell page-section about-page">
      <header className="about-hero">
        <p className="eyebrow">ABOUT / 关于我</p>
        <h1>你好，我是 SylarWang。</h1>
        <p>一名墨尔本大学信息技术硕士在读的开发者，关注 AI Agent 如何走出演示，进入可维护、可验证的真实应用。</p>
      </header>

      <div className="about-grid">
        <section>
          <span className="about-grid__index">01 / 学习</span>
          <h2>墨尔本大学</h2>
          <p>目前就读信息技术硕士，预计 2027 年毕业；此前完成计算机与软件系统学士学习。</p>
        </section>
        <section>
          <span className="about-grid__index">02 / 方向</span>
          <h2>从 Agent 能力到产品闭环</h2>
          <p>我持续研究工作流、Tool Calling、MCP、记忆与会话一致性，以及评测和可观测性。</p>
        </section>
        <section>
          <span className="about-grid__index">03 / 做事方式</span>
          <h2>证据优先，逐步交付</h2>
          <p>我更愿意用可复现的流程、测试、公开提交和诚实的边界说明，让项目能力可以被核验。</p>
        </section>
      </div>

      <section className="about-contact">
        <div>
          <p className="section-kicker">CONTACT / 联系</p>
          <h2>如果你也在做可靠的 AI 应用，我们可以聊聊。</h2>
        </div>
        <div className="button-row">
          <a className="button button--primary" href={`mailto:${siteConfig.email}`}>Email</a>
          <a className="button button--secondary" href={siteConfig.github} target="_blank" rel="noreferrer">GitHub ↗</a>
          <Link className="button button--ghost" href="/resume">简历</Link>
        </div>
      </section>
    </div>
  )
}
