const plannedTopics = [
  '面试经历与求职复盘',
  'Agent 工作流与工具调用',
  '学习过程中的认知变化'
]

export function EmptyBlogState() {
  return (
    <div className="empty-blog-state">
      <div>
        <span className="empty-blog-state__prompt" aria-hidden="true">writing_queue[]</span>
        <h3>文章正在路上</h3>
        <p>我还在求职和学习阶段，不用虚构的文章数量填满这里。准备写作的方向：</p>
      </div>
      <ul>
        {plannedTopics.map((topic) => <li key={topic}>{topic}</li>)}
      </ul>
    </div>
  )
}
