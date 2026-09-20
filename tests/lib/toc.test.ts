import { extractTableOfContents } from '@/lib/content/toc'

test('extracts level-two and level-three headings with stable duplicate slugs', () => {
  const source = `
# 不进入目录

## 第一个标题

### 重复标题

### 重复标题

#### 不进入目录
`

  expect(extractTableOfContents(source)).toEqual([
    { depth: 2, text: '第一个标题', id: '第一个标题' },
    { depth: 3, text: '重复标题', id: '重复标题' },
    { depth: 3, text: '重复标题', id: '重复标题-1' }
  ])
})
