import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="page-shell home-intro">
      <p className="eyebrow"><span aria-hidden="true">$</span> open_to_work --role agent-engineer</p>
      <h1>AI Agent 开发工程师</h1>
      <p className="home-intro__lead">
        我是王楷中，关注工作流、工具调用与 AI 应用落地。这里记录我做过的项目、正在形成的方法，以及持续更新的求职成长轨迹。
      </p>
      <div className="button-row">
        <Link className="button button--primary" href="/projects">项目</Link>
        <Link className="button button--secondary" href="/resume">简历</Link>
      </div>
      <div className="signal-line" aria-label="当前方向">
        <span>Agent workflow</span>
        <span>Tool use</span>
        <span>Product delivery</span>
      </div>
    </div>
  )
}
