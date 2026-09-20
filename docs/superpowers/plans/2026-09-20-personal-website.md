# Personal Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Wang Kaizhong's responsive personal website for AI Agent / AI application job seeking, with project case studies, an MDX blog, a latest-only online resume, and an about page.

**Architecture:** Use a Next.js App Router application with statically generated public content. Local Markdown/MDX files are parsed through a typed content layer, validated with Zod at build time, and rendered by focused page components; GitHub is linked as evidence but is never a runtime dependency for core pages.

**Tech Stack:** Next.js 16.3.5, React 19.3, TypeScript 5.9, pnpm, CSS custom properties, `next-mdx-remote`, `gray-matter`, Zod, Vitest, Testing Library, Playwright

**Spec:** `docs/superpowers/specs/2026-09-20-personal-website-design.md`

## Global Constraints

- Primary positioning: `AI Agent / AI 应用开发｜求职中`.
- Resume target role: `AI 应用开发实习生`.
- Public routes: `/`, `/projects`, `/projects/[slug]`, `/blog`, `/blog/[slug]`, `/resume`, `/about`.
- Initial project case studies: Folio, Craft Agents, Miniclaw.
- `/resume` exposes exactly one current version; historical versions have no public route.
- Blog content is local MDX; drafts never appear in production output or the sitemap.
- Core pages must not fetch GitHub or any other third-party service at runtime.
- Light theme is the default; dark theme and reduced-motion preferences are supported.
- No login, database, comments, analytics, live GitHub data, friend links, music, gallery, or CMS in the first release.
- Public claims must come from the supplied resume, the Folio repository, or another explicit user-provided source.

## Review Focus

- Invalid project, post, or resume frontmatter must fail with the source filename and invalid field.
- Zero published posts must render an honest empty state without fabricated articles.
- Zero or multiple current resume versions must fail before a public resume page is built.
- Missing optional project dates and images must render cleanly without placeholder text or broken images.
- GitHub or another external link being unavailable must not prevent any core page from rendering.

---

## File Structure

```text
app/
  about/page.tsx                 About page
  blog/[slug]/page.tsx           Blog article route
  blog/page.tsx                  Blog index and empty state
  projects/[slug]/page.tsx       Project case-study route
  projects/page.tsx              Project index
  resume/page.tsx                Current resume route
  globals.css                    Theme tokens, layout, responsive and print rules
  icon.svg                       Site-specific favicon
  layout.tsx                     Global metadata, theme bootstrap, header and footer
  not-found.tsx                  Site-wide 404
  page.tsx                       Home page
  robots.ts                      Crawler rules
  sitemap.ts                     Public route sitemap
components/
  agent-workflow.tsx             Folio workflow visual
  article-card.tsx               Blog summary card
  empty-blog-state.tsx           Honest no-article state
  mdx-components.tsx             Safe MDX component map
  project-card.tsx               Project summary card
  resume-document.tsx            Resume presentation
  site-footer.tsx                Footer
  site-header.tsx                Desktop and mobile navigation
  theme-toggle.tsx               Theme preference control
content/
  posts/.gitkeep                 Empty initial blog directory
  projects/craft-agents.mdx      Craft Agents case study
  projects/folio.mdx             Folio case study
  projects/miniclaw.mdx          Miniclaw case study
  resumes/2026-09-ai-app.md      Current resume source
lib/content/
  filesystem.ts                  File discovery and frontmatter extraction
  posts.ts                       Post parsing, filtering and ordering
  projects.ts                    Project parsing and ordering
  resumes.ts                     Resume parsing and current-version selection
  schemas.ts                     Zod schemas and exported content types
lib/
  site-config.ts                 Site identity, navigation and external links
public/images/
  profile.jpg                    Supplied resume photo
tests/
  content/*.test.ts              Content validation and selection tests
  components/*.test.tsx          Component behavior tests
  pages/*.test.tsx               Page composition tests
e2e/site.spec.ts                 Cross-route, responsive and theme browser tests
docs/
  DEPLOYMENT.md                  Deployment and content publishing instructions
.github/workflows/ci.yml         Continuous integration gate
```

### Task 1: Application Foundation and Global Shell

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next-env.d.ts`
- Create: `next.config.ts`
- Create: `eslint.config.mjs`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `playwright.config.ts`
- Create: `.gitignore`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`
- Create: `components/site-header.tsx`
- Create: `components/site-footer.tsx`
- Create: `components/theme-toggle.tsx`
- Create: `lib/site-config.ts`
- Test: `tests/pages/app-shell.test.tsx`

**Interfaces:**
- Consumes: The approved identity and navigation labels from the spec.
- Produces: `siteConfig`, `SiteHeader`, `SiteFooter`, `ThemeToggle`, global theme tokens, and a working root layout used by every later task.

- [ ] **Step 1: Initialize source control at the site root**

Run:

```powershell
git init -b main
```

Expected: an empty `main` branch is created while the existing `docs/` directory remains unchanged.

- [ ] **Step 2: Create the package manifest and install the runtime dependencies**

Create `package.json` with these scripts:

```json
{
  "name": "kaizhong-portfolio",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  }
}
```

Run:

```powershell
pnpm add next@16.3.5 react@19.3.0 react-dom@19.3.0 next-mdx-remote gray-matter zod reading-time remark-gfm rehype-slug rehype-pretty-code
pnpm add -D typescript@~5.9.3 @types/node @types/react @types/react-dom eslint eslint-config-next vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test
```

Expected: `pnpm-lock.yaml` is created and all commands exit successfully.

- [ ] **Step 3: Add strict TypeScript, lint, Vitest, and Playwright configuration**

Use strict TypeScript and the `@/*` path alias in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", ".next/types/**/*.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

Configure Vitest for `jsdom`, load `vitest.setup.ts`, and include `tests/**/*.test.{ts,tsx}`. Configure Playwright to start `pnpm dev` on `http://127.0.0.1:3000` and test Chromium at desktop and mobile widths.

- [ ] **Step 4: Write the failing shell test**

Create `tests/pages/app-shell.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'

test('presents the role and primary navigation', () => {
  render(<HomePage />)

  expect(screen.getByRole('heading', { name: /AI Agent/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: '项目' })).toHaveAttribute('href', '/projects')
  expect(screen.getByRole('link', { name: '简历' })).toHaveAttribute('href', '/resume')
})
```

- [ ] **Step 5: Run the shell test and verify the red state**

Run:

```powershell
pnpm test -- tests/pages/app-shell.test.tsx
```

Expected: FAIL because `app/page.tsx` and the shared shell do not exist.

- [ ] **Step 6: Implement the global identity, navigation, and theme shell**

Create `lib/site-config.ts`:

```ts
export const siteConfig = {
  name: '王楷中',
  handle: 'Rapeter',
  title: '王楷中｜AI Agent / AI 应用开发',
  description: '关注 Agent 工作流、工具调用、记忆治理与 AI 应用落地。',
  email: 'kaizhongw@student.unimelb.edu.au',
  github: 'https://github.com/Rapeter',
  navigation: [
    { href: '/', label: '首页' },
    { href: '/projects', label: '项目' },
    { href: '/blog', label: '博客' },
    { href: '/resume', label: '简历' },
    { href: '/about', label: '关于' }
  ]
} as const
```

Implement `SiteHeader` with semantic `<nav aria-label="主导航">`, a mobile disclosure button, and active-link styling. Implement `ThemeToggle` as a client component that stores `light`, `dark`, or `system` in `localStorage` and updates `document.documentElement.dataset.theme`. Add an inline bootstrap script in `app/layout.tsx` so the stored/system theme applies before paint.

Add these base tokens to `app/globals.css`:

```css
:root {
  color-scheme: light;
  --background: #fafaf7;
  --surface: #ffffff;
  --foreground: #171717;
  --muted: #686868;
  --border: #deded8;
  --accent: #2563eb;
  --accent-contrast: #ffffff;
  --content-width: 1120px;
  --reading-width: 720px;
}

:root[data-theme='dark'] {
  color-scheme: dark;
  --background: #181a1b;
  --surface: #202224;
  --foreground: #f3f3ef;
  --muted: #a8aaac;
  --border: #383a3c;
  --accent: #6ea8fe;
  --accent-contrast: #0d1117;
}
```

Create a minimal `app/page.tsx` with the final hero heading, positioning copy, and links to `/projects` and `/resume`. Do not add temporary lorem ipsum or invented metrics.

- [ ] **Step 7: Run foundation verification**

Run:

```powershell
pnpm test -- tests/pages/app-shell.test.tsx
pnpm typecheck
pnpm build
```

Expected: all three commands pass and the root route is generated.

- [ ] **Step 8: Commit the foundation**

```powershell
git add package.json pnpm-lock.yaml tsconfig.json next-env.d.ts next.config.ts eslint.config.mjs vitest.config.ts vitest.setup.ts playwright.config.ts .gitignore app components lib tests
git commit -m "feat: establish portfolio application shell"
```

### Task 2: Typed Content Layer

**Files:**
- Create: `lib/content/schemas.ts`
- Create: `lib/content/filesystem.ts`
- Create: `lib/content/projects.ts`
- Create: `lib/content/posts.ts`
- Create: `lib/content/resumes.ts`
- Create: `content/posts/.gitkeep`
- Create: `content/projects/.gitkeep`
- Create: `content/resumes/.gitkeep`
- Test: `tests/content/schemas.test.ts`
- Test: `tests/content/posts.test.ts`
- Test: `tests/content/resumes.test.ts`

**Interfaces:**
- Consumes: Local `.md` and `.mdx` files with YAML frontmatter.
- Produces: `ProjectEntry`, `PostEntry`, `ResumeEntry`; `parseProjectFile(sourcePath: string): ProjectEntry`; `parsePostFile(sourcePath: string): PostEntry`; `parseResumeFile(sourcePath: string): ResumeEntry`; `filterPublishedPosts(posts: PostEntry[]): PostEntry[]`; `selectCurrentResume(resumes: ResumeEntry[]): ResumeEntry`; `getAllProjects(): ProjectEntry[]`; `getProjectBySlug(slug: string): ProjectEntry | null`; `getPublishedPosts(): PostEntry[]`; `getPostBySlug(slug: string): PostEntry | null`; and `getCurrentResume(): ResumeEntry`.

- [ ] **Step 1: Write failing schema and resume-selection tests**

Create tests that pin the highest-risk inputs:

```ts
import { describe, expect, test } from 'vitest'
import { projectSchema, postSchema } from '@/lib/content/schemas'
import { selectCurrentResume } from '@/lib/content/resumes'

describe('content contracts', () => {
  test('reports a missing project title', () => {
    const result = projectSchema.safeParse({ slug: 'folio', summary: 'x' })
    expect(result.success).toBe(false)
    expect(result.error?.issues.some(issue => issue.path.join('.') === 'title')).toBe(true)
  })

  test('requires a publication date for a public post', () => {
    const result = postSchema.safeParse({
      slug: 'agent-notes',
      title: 'Agent Notes',
      summary: 'Notes',
      category: 'Agent 工程',
      tags: ['Agent'],
      draft: false
    })
    expect(result.success).toBe(false)
  })

  test('rejects zero and multiple current resumes', () => {
    expect(() => selectCurrentResume([])).toThrow(/exactly one current resume/i)
    expect(() => selectCurrentResume([
      { meta: { version: 'a', current: true } },
      { meta: { version: 'b', current: true } }
    ] as never)).toThrow(/exactly one current resume/i)
  })
})
```

- [ ] **Step 2: Run the content tests and verify the red state**

Run:

```powershell
pnpm test -- tests/content
```

Expected: FAIL because the schemas and selection functions do not exist.

- [ ] **Step 3: Implement the schemas and exported types**

Create schemas with these exact fields:

```ts
import { z } from 'zod'

const evidenceLinkSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
  kind: z.enum(['github', 'pull-request', 'demo', 'article'])
})

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  summary: z.string().min(1),
  role: z.string().min(1),
  period: z.string().min(1).optional(),
  status: z.enum(['active', 'completed', 'learning']),
  tags: z.array(z.string().min(1)).min(1),
  featured: z.boolean().default(false),
  order: z.number().int().nonnegative(),
  cover: z.string().min(1).optional(),
  evidence: z.array(evidenceLinkSchema).default([])
})

export const postSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  summary: z.string().min(1),
  publishedAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  category: z.enum(['求职复盘', 'Agent 工程', '学习手记']),
  tags: z.array(z.string().min(1)).min(1),
  draft: z.boolean().default(true),
  pinned: z.boolean().default(false),
  cover: z.string().min(1).optional(),
  redactCompany: z.boolean().default(false)
}).superRefine((value, context) => {
  if (!value.draft && !value.publishedAt) {
    context.addIssue({ code: 'custom', path: ['publishedAt'], message: 'Public posts require publishedAt' })
  }
})

export const resumeSchema = z.object({
  version: z.string().regex(/^\d{4}-\d{2}-[a-z0-9-]+$/),
  title: z.string().min(1),
  targetRole: z.string().min(1),
  updatedAt: z.coerce.date(),
  current: z.boolean(),
  pdf: z.string().min(1).optional()
})

export type ProjectMeta = z.infer<typeof projectSchema>
export type PostMeta = z.infer<typeof postSchema>
export type ResumeMeta = z.infer<typeof resumeSchema>
export type ContentEntry<T> = { meta: T; body: string; sourcePath: string }
```

- [ ] **Step 4: Implement file parsing with source-aware errors**

`lib/content/filesystem.ts` must expose:

```ts
export function readContentFiles(directory: string): Array<{
  body: string
  data: Record<string, unknown>
  sourcePath: string
}>
```

Use `fs.readdirSync`, accept `.md` and `.mdx`, parse with `gray-matter`, and sort filenames for deterministic builds. Wrap Zod errors in each domain loader as:

```ts
throw new Error(`Invalid content in ${sourcePath}: ${issue.path.join('.')} ${issue.message}`)
```

The project loader sorts by `order`. The post loader removes drafts, then sorts pinned posts first and dates descending. `selectCurrentResume()` throws unless the input contains exactly one `meta.current === true` entry.

- [ ] **Step 5: Add tests for draft filtering, optional dates, and source-aware errors**

Add assertions that:

```ts
expect(filterPublishedPosts([draftPost, publicPost])).toEqual([publicPost])
expect(projectSchema.parse(projectWithoutPeriod).period).toBeUndefined()
expect(() => parseProject(invalidFixture)).toThrow(/invalid-project\.md: title/i)
```

- [ ] **Step 6: Run content-layer verification**

Run:

```powershell
pnpm test -- tests/content
pnpm typecheck
```

Expected: all content tests and type checking pass.

- [ ] **Step 7: Commit the content layer**

```powershell
git add lib/content content tests/content
git commit -m "feat: add validated local content layer"
```

### Task 3: Project Case Studies

**Files:**
- Create: `content/projects/folio.mdx`
- Create: `content/projects/craft-agents.mdx`
- Create: `content/projects/miniclaw.mdx`
- Create: `components/project-card.tsx`
- Create: `components/agent-workflow.tsx`
- Create: `components/mdx-components.tsx`
- Create: `app/projects/page.tsx`
- Create: `app/projects/[slug]/page.tsx`
- Test: `tests/pages/projects.test.tsx`
- Test: `tests/components/project-card.test.tsx`

**Interfaces:**
- Consumes: `getAllProjects()` and `getProjectBySlug(slug)` from Task 2.
- Produces: a project index, statically generated detail routes, `ProjectCard`, `AgentWorkflow`, and the shared `mdxComponents` map.

- [ ] **Step 1: Write failing project presentation tests**

```tsx
import { render, screen } from '@testing-library/react'
import { ProjectCard } from '@/components/project-card'

test('renders a project without an image or date', () => {
  render(<ProjectCard project={{
    meta: {
      slug: 'miniclaw',
      title: 'Miniclaw',
      summary: '自托管多渠道 Agent 工作台与记忆治理',
      role: '个人项目 / 开源参考实现',
      status: 'active',
      tags: ['Agent', 'Memory'],
      featured: true,
      order: 3,
      evidence: []
    },
    body: '',
    sourcePath: 'content/projects/miniclaw.mdx'
  }} />)

  expect(screen.getByRole('heading', { name: 'Miniclaw' })).toBeInTheDocument()
  expect(screen.queryByRole('img')).not.toBeInTheDocument()
  expect(screen.queryByText(/待补|unknown/i)).not.toBeInTheDocument()
})
```

- [ ] **Step 2: Run the project tests and verify the red state**

Run:

```powershell
pnpm test -- tests/pages/projects.test.tsx tests/components/project-card.test.tsx
```

Expected: FAIL because project components and routes do not exist.

- [ ] **Step 3: Add the three verified project sources**

Use these frontmatter records:

```yaml
# content/projects/folio.mdx
slug: folio
title: Folio
summary: 本地优先的 AI 投资研究工作台，使用 Agent 推进证据化研究、风险分析与投资论点维护。
role: 项目合作者
status: active
tags: [TypeScript, Electron, React, Pi Agent, Tool Calling, Evaluation]
featured: true
order: 1
evidence:
  - label: GitHub 仓库
    url: https://github.com/helsome/folio
    kind: github
  - label: 安全工具活动时间线 PR
    url: https://github.com/helsome/folio/pull/48
    kind: pull-request
```

```yaml
# content/projects/craft-agents.mdx
slug: craft-agents
title: Craft Agents
summary: 面向多模型后端与多端交互场景的 Agent 应用架构研习与参考实现。
role: 个人项目
period: 2026.01 — 2026.03
status: completed
tags: [TypeScript, Bun, Electron, React, MCP, Claude Agent SDK]
featured: true
order: 2
evidence: []
```

```yaml
# content/projects/miniclaw.mdx
slug: miniclaw
title: Miniclaw
summary: 支持多渠道接入、Agent 身份与工作区管理、结构化记忆和工程化验证的自托管工作台。
role: 个人项目 / 开源参考实现
status: active
tags: [TypeScript, Hono, SQLite, React, WebSocket, Pi Agent Runtime]
featured: true
order: 3
evidence: []
```

Write each MDX body using the exact headings `背景与问题`, `使用流程`, `系统设计`, `关键技术决策`, `验证方式`, and `证据与链接`. Populate Craft Agents and Miniclaw only from the supplied resume bullets. Populate Folio from the public repository README and the public PR; describe the personal role as `项目合作者` without inventing ownership percentages or performance claims.

- [ ] **Step 4: Implement project cards and routes**

`ProjectCard` renders the title, summary, role, optional period, tags, and a details link. It renders an image only when `meta.cover` exists. `app/projects/page.tsx` lists all projects. `app/projects/[slug]/page.tsx` uses `generateStaticParams()`, calls `notFound()` for an unknown slug, and renders MDX using `MDXRemote` with `mdxComponents`.

`AgentWorkflow` renders four labeled steps with semantic ordered-list markup:

```tsx
const steps = ['用户问题', '工具调用', '证据整理', '研究结论']
```

Use it only in the Folio content through the MDX component map.

- [ ] **Step 5: Add route and evidence-link tests**

Assert that the project index orders `Folio`, `Craft Agents`, then `Miniclaw`; Folio renders both public evidence links; a missing project calls the not-found path; and external evidence links use `target="_blank"` with `rel="noreferrer"`.

- [ ] **Step 6: Run project verification**

```powershell
pnpm test -- tests/pages/projects.test.tsx tests/components/project-card.test.tsx
pnpm typecheck
pnpm build
```

Expected: tests pass and the three project routes appear in the build output.

- [ ] **Step 7: Commit the project system**

```powershell
git add content/projects components app/projects tests/pages/projects.test.tsx tests/components/project-card.test.tsx
git commit -m "feat: add agent project case studies"
```

### Task 4: Home Page Composition

**Files:**
- Modify: `app/page.tsx`
- Create: `components/article-card.tsx`
- Create: `components/empty-blog-state.tsx`
- Test: `tests/pages/home.test.tsx`

**Interfaces:**
- Consumes: `getAllProjects()`, `getPublishedPosts()`, `ProjectCard`, `ArticleCard`, and `siteConfig`.
- Produces: the final home page information hierarchy and reusable honest-empty-state component.

- [ ] **Step 1: Write the failing home-page tests**

```tsx
import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'

test('shows identity, evidence, and honest article state', async () => {
  render(await HomePage())

  expect(screen.getByRole('heading', { name: /AI Agent.*AI 应用开发/i })).toBeInTheDocument()
  expect(screen.getByText('Folio')).toBeInTheDocument()
  expect(screen.getByText(/准备写作的方向/)).toBeInTheDocument()
  expect(screen.queryByText(/篇文章|访问量|项目数量/)).not.toBeInTheDocument()
})
```

- [ ] **Step 2: Run the home-page test and verify the red state**

Run:

```powershell
pnpm test -- tests/pages/home.test.tsx
```

Expected: FAIL because the full home composition and empty article state are absent.

- [ ] **Step 3: Implement the final home sections**

Build the page in this order:

1. Hero with `AI Agent / AI 应用开发｜求职中`, supporting copy, and project/resume/GitHub actions.
2. Four capability items: workflow design, tool integration, memory/session governance, evaluation/reliability.
3. Featured projects sourced from `featured === true` entries, with Folio first.
4. Open-source evidence with Folio and PR #48.
5. Recent published posts, or `EmptyBlogState` when the list is empty.
6. Resume call-to-action mentioning the University of Melbourne and the target internship role.

`EmptyBlogState` must show these topics as intentions rather than published articles:

```ts
['面试经历与求职复盘', 'Agent 工作流与工具调用', '学习过程中的认知变化']
```

- [ ] **Step 4: Verify home behavior with and without posts**

Add one test with an empty post list and one with three in-memory published posts. Assert that the empty state disappears when real posts exist and only the newest three are rendered.

- [ ] **Step 5: Run home verification**

```powershell
pnpm test -- tests/pages/home.test.tsx
pnpm typecheck
```

Expected: both home-page states pass.

- [ ] **Step 6: Commit the home page**

```powershell
git add app/page.tsx components/article-card.tsx components/empty-blog-state.tsx tests/pages/home.test.tsx
git commit -m "feat: build evidence-led portfolio home page"
```

### Task 5: MDX Blog and Reading Experience

**Files:**
- Create: `app/blog/page.tsx`
- Create: `app/blog/[slug]/page.tsx`
- Modify: `components/mdx-components.tsx`
- Modify: `components/article-card.tsx`
- Modify: `app/globals.css`
- Test: `tests/pages/blog.test.tsx`
- Test: `tests/components/mdx-components.test.tsx`

**Interfaces:**
- Consumes: `getPublishedPosts()`, `getPostBySlug(slug)`, and `mdxComponents`.
- Produces: public blog index, static article routes, reading-time metadata, heading anchors, code rendering, and adjacent-post navigation.

- [ ] **Step 1: Write failing blog-list and MDX tests**

```tsx
test('shows an honest empty state when there are no public posts', () => {
  render(<BlogIndex posts={[]} />)
  expect(screen.getByText(/第一篇文章正在准备中/)).toBeInTheDocument()
  expect(screen.queryByRole('article')).not.toBeInTheDocument()
})

test('external MDX links open safely', () => {
  const ExternalLink = mdxComponents.a!
  render(<ExternalLink href="https://example.com">资料</ExternalLink>)
  expect(screen.getByRole('link', { name: '资料' })).toHaveAttribute('rel', 'noreferrer')
})
```

- [ ] **Step 2: Run the blog tests and verify the red state**

Run:

```powershell
pnpm test -- tests/pages/blog.test.tsx tests/components/mdx-components.test.tsx
```

Expected: FAIL because the blog routes and finalized MDX components do not exist.

- [ ] **Step 3: Implement the blog index and article route**

The index groups posts by category only when at least one post exists. The article route renders title, summary, dates, category, tags, calculated reading time, body, and previous/next links. `generateStaticParams()` returns only published slugs. `generateMetadata()` uses the article title and summary.

Configure MDX rendering with:

```ts
const mdxOptions = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [rehypeSlug, rehypePrettyCode]
}
```

Map headings, links, code, blockquotes, tables, and images to accessible components. Do not permit an MDX image without non-empty alt text.

- [ ] **Step 4: Add reading layout and reduced-motion-safe styles**

Limit prose to `--reading-width`, keep code blocks horizontally scrollable inside their own bounds, keep body text at least 16px, and provide visible heading anchor focus styles. Disable nonessential transitions inside `@media (prefers-reduced-motion: reduce)`.

- [ ] **Step 5: Verify draft exclusion and zero-post builds**

Add a draft fixture under `tests/fixtures/posts/draft.mdx` and assert it appears in neither `getPublishedPosts()` nor generated static parameters. Run a production build while `content/posts/` contains no public article.

Run:

```powershell
pnpm test -- tests/content/posts.test.ts tests/pages/blog.test.tsx tests/components/mdx-components.test.tsx
pnpm build
```

Expected: tests pass, build succeeds, and `/blog` is generated without article routes.

- [ ] **Step 6: Commit the blog**

```powershell
git add app/blog components app/globals.css tests/pages/blog.test.tsx tests/components/mdx-components.test.tsx tests/fixtures/posts
git commit -m "feat: add validated MDX blog experience"
```

### Task 6: Latest-Only Online Resume

**Files:**
- Create: `content/resumes/2026-09-ai-app.md`
- Create: `components/resume-document.tsx`
- Create: `app/resume/page.tsx`
- Modify: `app/globals.css`
- Create: `public/images/profile.jpg`
- Test: `tests/pages/resume.test.tsx`

**Interfaces:**
- Consumes: `getCurrentResume()` and the user-supplied Markdown at `C:/Users/71865/Desktop/resume/王楷中_简历.md`.
- Produces: `/resume`, print-ready resume styling, optional PDF rendering behavior, and no historical-version navigation.

- [ ] **Step 1: Write the failing resume-page tests**

```tsx
test('renders only the current resume without a version selector', () => {
  render(<ResumeDocument resume={currentResume} />)
  expect(screen.getByRole('heading', { name: '王楷中' })).toBeInTheDocument()
  expect(screen.getByText('AI 应用开发实习生')).toBeInTheDocument()
  expect(screen.queryByLabelText(/简历版本/)).not.toBeInTheDocument()
})

test('omits the download action when no PDF exists', () => {
  render(<ResumeDocument resume={resumeWithoutPdf} />)
  expect(screen.queryByRole('link', { name: /PDF/ })).not.toBeInTheDocument()
})
```

- [ ] **Step 2: Run the resume tests and verify the red state**

Run:

```powershell
pnpm test -- tests/pages/resume.test.tsx
```

Expected: FAIL because resume presentation code does not exist.

- [ ] **Step 3: Convert the supplied resume into the current content version**

Use this frontmatter and preserve the supplied body content exactly, except remove the original inline `<img>` tag because the page component owns the portrait:

```yaml
version: 2026-09-ai-app
title: 王楷中
targetRole: AI 应用开发实习生
updatedAt: 2026-09-01
current: true
```

Do not display `[时间待补]` for Miniclaw. Omit that period from the rendered resume until a real date is supplied.

Copy the provided photo:

```powershell
Copy-Item -LiteralPath 'C:\Users\71865\Desktop\resume\resume_photo.jpg' -Destination 'E:\github\自己的网站\public\images\profile.jpg'
```

- [ ] **Step 4: Implement the resume page and print rules**

Render contact details, education, projects, and skills using semantic sections and lists. Render the PDF link only when `meta.pdf` is present. Add:

```css
@media print {
  .site-header,
  .site-footer,
  .theme-toggle,
  .resume-actions { display: none !important; }

  .resume-page {
    width: auto;
    max-width: none;
    margin: 0;
    color: #000;
    background: #fff;
  }
}
```

- [ ] **Step 5: Verify current-version enforcement and printing structure**

Run:

```powershell
pnpm test -- tests/content/resumes.test.ts tests/pages/resume.test.tsx
pnpm typecheck
pnpm build
```

Expected: all tests pass; `/resume` is generated; no historical resume route or version control appears.

- [ ] **Step 6: Commit the resume**

```powershell
git add content/resumes components/resume-document.tsx app/resume public/images/profile.jpg app/globals.css tests/pages/resume.test.tsx
git commit -m "feat: publish latest online resume"
```

### Task 7: About Page, Metadata, Favicon, Sitemap, and 404

**Files:**
- Create: `app/about/page.tsx`
- Create: `app/not-found.tsx`
- Create: `app/robots.ts`
- Create: `app/sitemap.ts`
- Create: `app/icon.svg`
- Modify: `app/layout.tsx`
- Modify: `app/projects/[slug]/page.tsx`
- Modify: `app/blog/[slug]/page.tsx`
- Modify: `app/resume/page.tsx`
- Test: `tests/pages/metadata.test.ts`
- Test: `tests/pages/about.test.tsx`

**Interfaces:**
- Consumes: `siteConfig`, public project slugs, public post slugs, and current resume metadata.
- Produces: complete page metadata, public-only sitemap entries, crawler rules, a site-specific favicon, a concise about page, and a useful 404.

- [ ] **Step 1: Write failing sitemap and about-page tests**

```ts
test('sitemap includes public routes and excludes drafts and resume history', async () => {
  const entries = await sitemap()
  const paths = entries.map(entry => new URL(entry.url).pathname)
  expect(paths).toContain('/resume')
  expect(paths).toContain('/projects/folio')
  expect(paths).not.toContain('/resume/2026-09-ai-app')
  expect(paths).not.toContain('/blog/draft')
})
```

The about-page test must assert the University of Melbourne education, AI Agent focus, and contact links without duplicating the complete resume.

- [ ] **Step 2: Run the metadata tests and verify the red state**

```powershell
pnpm test -- tests/pages/metadata.test.ts tests/pages/about.test.tsx
```

Expected: FAIL because the routes and metadata functions do not exist.

- [ ] **Step 3: Implement metadata and public indexing rules**

Set root metadata in `app/layout.tsx`:

```ts
export const metadata: Metadata = {
  title: { default: siteConfig.title, template: `%s｜${siteConfig.name}` },
  description: siteConfig.description,
  authors: [{ name: siteConfig.name, url: siteConfig.github }],
  icons: { icon: '/icon.svg' }
}
```

Each project, post, and resume page supplies its own title and description. `robots.ts` permits normal crawling. `sitemap.ts` includes static routes, projects, and published posts only.

Create `app/icon.svg` as a simple `K`/node motif using the site blue, with no generated social card because the user did not request one.

- [ ] **Step 4: Implement about and not-found pages**

The about page covers the two University of Melbourne degrees, the AI Agent engineering interests, current job-seeking state, and email/GitHub links. The 404 page links back to `/projects` and `/blog`.

- [ ] **Step 5: Run metadata verification**

```powershell
pnpm test -- tests/pages/metadata.test.ts tests/pages/about.test.tsx
pnpm typecheck
pnpm build
```

Expected: tests pass and build output includes the favicon, robots file, sitemap, about page, and 404 handling.

- [ ] **Step 6: Commit discovery and metadata work**

```powershell
git add app/about app/not-found.tsx app/robots.ts app/sitemap.ts app/icon.svg app/layout.tsx app/projects app/blog app/resume tests/pages
git commit -m "feat: complete profile metadata and discovery routes"
```

### Task 8: Responsive, Theme, Accessibility, and External-Failure Verification

**Files:**
- Modify: `app/globals.css`
- Modify: `components/site-header.tsx`
- Modify: `components/theme-toggle.tsx`
- Create: `e2e/site.spec.ts`
- Test: `tests/components/theme-toggle.test.tsx`

**Interfaces:**
- Consumes: every public route and shared component from Tasks 1–7.
- Produces: verified mobile/desktop layouts, persisted theme behavior, keyboard-accessible navigation, reduced-motion behavior, and proof that external services are not required.

- [ ] **Step 1: Write failing theme and browser tests**

```ts
test('stored dark theme survives navigation', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('theme', 'dark'))
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.getByRole('link', { name: '项目' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
})

test('mobile pages do not overflow horizontally', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  for (const path of ['/', '/projects', '/projects/folio', '/blog', '/resume', '/about']) {
    await page.goto(path)
    const sizes = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }))
    expect(sizes.scroll).toBeLessThanOrEqual(sizes.client)
  }
})
```

Add a route-blocking test that aborts all requests whose origin is not the local test server, then verifies the home, Folio, blog, and resume pages still render.

- [ ] **Step 2: Run the new checks and verify the red state**

```powershell
pnpm test -- tests/components/theme-toggle.test.tsx
pnpm exec playwright install chromium
pnpm test:e2e
```

Expected: at least one assertion fails before responsive and theme persistence work is complete.

- [ ] **Step 3: Complete responsive and accessible interactions**

Ensure:

- the mobile menu uses a real button with `aria-expanded` and `aria-controls`;
- focus is visible on links and buttons;
- theme changes persist in `localStorage` and respect system preference when set to `system`;
- cards never require hover to reveal essential content;
- touch targets are at least 44px high on coarse pointers;
- prose and project layouts collapse to one column below 760px;
- animations are disabled for `prefers-reduced-motion: reduce`;
- long code and URLs wrap or scroll within their own container rather than the page.

- [ ] **Step 4: Run the full local quality gate**

```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

Expected: every command exits successfully. The external-request blocking test proves that GitHub downtime cannot break core rendering.

- [ ] **Step 5: Commit responsive and accessibility work**

```powershell
git add app/globals.css components/site-header.tsx components/theme-toggle.tsx e2e tests/components/theme-toggle.test.tsx
git commit -m "test: verify responsive and accessible portfolio flows"
```

### Task 9: CI, Content Documentation, and Deployment Handoff

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `README.md`
- Create: `docs/DEPLOYMENT.md`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: the complete application and test commands.
- Produces: repeatable CI checks, a clear authoring workflow, and a deployment procedure that can be executed after the user authorizes external publication.

- [ ] **Step 1: Add the continuous integration workflow**

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10.33.0
      - uses: actions/setup-node@v4
        with:
          node-version: 20.17.0
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build
      - run: pnpm exec playwright install --with-deps chromium
      - run: pnpm test:e2e
```

- [ ] **Step 2: Document content authoring and resume updates**

`README.md` must explain:

- local setup with `pnpm install` and `pnpm dev`;
- project, post, and resume content directories;
- required frontmatter fields with one complete example for each content type;
- how to publish a post by changing `draft: true` to `draft: false` and adding `publishedAt`;
- how to replace the current resume by setting exactly one version to `current: true`;
- the full local quality gate command sequence.

- [ ] **Step 3: Document the deployment procedure**

`docs/DEPLOYMENT.md` must specify:

1. Push the verified `main` branch to the user's GitHub repository.
2. Import that repository into Vercel as a Next.js project.
3. Use `pnpm build` as the build command and leave the default `.next` output handling.
4. Deploy a preview and verify `/`, `/projects/folio`, `/blog`, `/resume`, `/about`, `/sitemap.xml`, and `/robots.txt`.
5. Promote the verified preview to production.
6. Add a custom domain only after the production URL works.

The implementation agent must stop for user authorization before pushing to a remote repository, connecting an external account, or deploying publicly.

- [ ] **Step 4: Run final verification from a clean dependency state**

Run:

```powershell
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
git status --short
```

Expected: every check passes. `git status --short` lists only intentional documentation or workflow changes before the final commit.

- [ ] **Step 5: Commit delivery infrastructure**

```powershell
git add .github/workflows/ci.yml README.md docs/DEPLOYMENT.md .gitignore
git commit -m "chore: document and automate portfolio delivery"
```

- [ ] **Step 6: Review the branch before any external publication**

Run:

```powershell
git log --oneline --decorate -9
git diff --stat main~8..main
```

Expected: the history shows focused commits for the shell, content layer, projects, home, blog, resume, metadata, quality, and delivery. Request user approval before the first remote push or deployment.
