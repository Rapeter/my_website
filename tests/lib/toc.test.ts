// @vitest-environment node
import { compilePostMdx } from '@/lib/content/compile-post'

test('collects the exact rendered heading ids from the MDX syntax tree', async () => {
  const source = `
# Same

## Same

\`\`\`md
## Fake
\`\`\`

## Fake

## a_b
`

  const { tableOfContents } = await compilePostMdx(source)

  expect(tableOfContents).toEqual([
    { depth: 2, text: 'Same', id: 'same-1' },
    { depth: 2, text: 'Fake', id: 'fake' },
    { depth: 2, text: 'a_b', id: 'a_b' }
  ])
})
