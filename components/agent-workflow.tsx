const steps = ['用户问题', '工具调用', '证据整理', '研究结论']

export function AgentWorkflow() {
  return (
    <ol className="agent-workflow" aria-label="Folio Agent 工作流">
      {steps.map((step, index) => (
        <li key={step}>
          <span className="agent-workflow__index">0{index + 1}</span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  )
}
