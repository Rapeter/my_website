export type TableOfContentsItem = {
  depth: 2 | 3
  text: string
  id: string
}

type HastNode = {
  type?: string
  tagName?: string
  value?: string
  properties?: Record<string, unknown>
  children?: HastNode[]
}

function textContent(node: HastNode): string {
  if (node.type === 'text') return node.value ?? ''
  return node.children?.map(textContent).join('') ?? ''
}

export function createTableOfContentsPlugin(items: TableOfContentsItem[]) {
  return function tableOfContentsPlugin() {
    return (tree: unknown) => {
      function visit(node: HastNode) {
        if (node.type === 'element' && (node.tagName === 'h2' || node.tagName === 'h3')) {
          const id = node.properties?.id
          const text = textContent(node).trim()
          if (typeof id === 'string' && text) {
            items.push({
              depth: Number(node.tagName.slice(1)) as 2 | 3,
              text,
              id
            })
          }
        }

        node.children?.forEach(visit)
      }

      visit(tree as HastNode)
    }
  }
}
