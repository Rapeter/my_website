import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="page-shell not-found-page">
      <p className="eyebrow">404 / 页面未找到</p>
      <h1>这里没有找到对应内容。</h1>
      <p>链接可能已经变化，或者内容仍在准备中。你可以从项目案例或博客继续浏览。</p>
      <div className="button-row">
        <Link className="button button--primary" href="/projects">查看项目</Link>
        <Link className="button button--secondary" href="/blog">进入博客</Link>
      </div>
    </div>
  )
}
