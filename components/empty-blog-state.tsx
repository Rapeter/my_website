const plannedTopics = [
  '面试经历与求职复盘',
  'Agent 工作流与工具调用',
  '学习过程中的认知变化'
]

export function EmptyBlogState() {
  return (
    <div className="empty-blog-state">
      <div>
        <span className="empty-blog-state__prompt">COMING SOON / 即将更新</span>
        <h3>文章正在路上</h3>
        <p>这里会持续记录项目实践、面试复盘与学习过程中的思考。持续记录的方向：</p>
      </div>
      <ul>
        {plannedTopics.map((topic) => <li key={topic}>{topic}</li>)}
      </ul>
    </div>
  )
}
