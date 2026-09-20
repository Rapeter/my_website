import GithubSlugger from 'github-slugger'

export type TableOfContentsItem = {
  depth: 2 | 3
  text: string
  id: string
}

function plainHeadingText(value: string): string {
  return value
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/[`*_~]/g, '')
    .trim()
}

export function extractTableOfContents(source: string): TableOfContentsItem[] {
  const slugger = new GithubSlugger()
  const headings: TableOfContentsItem[] = []
  const headingPattern = /^(#{2,3})\s+(.+?)\s*#*\s*$/gm

  for (const match of source.matchAll(headingPattern)) {
    const text = plainHeadingText(match[2])
    if (!text) continue
    headings.push({
      depth: match[1].length as 2 | 3,
      text,
      id: slugger.slug(text)
    })
  }

  return headings
}
