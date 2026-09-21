# SylarWang 的个人网站

面向招聘者、面试官与技术同行的个人网站，集中展示 AI Agent / AI 应用开发项目、公开协作证据、博客和当前简历。网站使用 Next.js、TypeScript 与本地 Markdown/MDX 内容文件构建，不依赖数据库、CMS 或在线 GitHub API。

## 本地运行

环境要求：Node.js 20.19.0 或更新的兼容版本、pnpm 10.33.0。

```bash
pnpm install
pnpm dev
```

打开 `http://localhost:3000`。生产环境应设置 `NEXT_PUBLIC_SITE_URL` 为完整站点地址，供 metadata、sitemap 与 robots 使用。

## 内容目录

- `content/projects/`：项目案例，支持 `.md` 与 `.mdx`。
- `content/posts/`：博客文章；草稿不会出现在列表、首页或 sitemap 中。
- `content/resumes/`：简历版本；公开页面只读取唯一一份 `current: true` 的简历。

所有内容在构建时经过 Zod 校验；字段缺失会报告具体文件和字段，避免错误内容被静默发布。

## 新增项目

在 `content/projects/` 新建文件。完整 frontmatter 示例：

```yaml
---
slug: example-agent
title: Example Agent
summary: 一句话说明它解决的问题和使用场景。
role: 个人项目
period: 2026.09 — 2026.10
status: active
tags: [TypeScript, Agent, Tool Calling]
featured: true
order: 4
cover: /images/projects/example-agent.jpg
evidence:
  - label: GitHub 仓库
    url: https://github.com/example/example-agent
    kind: github
---
```

`period`、`cover` 可省略；`status` 仅可为 `active`、`completed` 或 `learning`。正文建议沿用项目案例的六段结构：背景与问题、使用流程、系统设计、关键技术决策、验证方式、证据与链接。

## 新增与发布文章

在 `content/posts/` 新建文件。完整 frontmatter 示例：

```yaml
---
slug: agent-workflow-notes
title: 我如何拆解一个 Agent 工作流
summary: 从任务边界、工具调用到验证闭环的实践记录。
publishedAt: 2026-09-20
updatedAt: 2026-09-21
category: Agent 工程
tags: [Agent, Workflow]
draft: false
pinned: false
cover: /images/posts/agent-workflow-notes.jpg
redactCompany: false
---
```

允许的分类为 `求职复盘`、`Agent 工程`、`学习手记`。写作期间保留 `draft: true`，可以暂时省略 `publishedAt`；发布时改为 `draft: false` 并添加 `publishedAt`。`updatedAt` 与 `cover` 可省略，面试相关文章如需隐藏公司信息可使用 `redactCompany: true` 作为编辑提醒。

## 更新当前简历

在 `content/resumes/` 新建文件。完整 frontmatter 示例：

```yaml
---
version: 2026-10-ai-app
title: 王楷中
targetRole: AI 应用开发实习生
updatedAt: 2026-10-01
current: true
pdf: /resume/王楷中_AI应用开发实习生.pdf
---
```

`version` 必须符合 `YYYY-MM-slug`。新版本发布时，将旧版本改为 `current: false`，并确保所有文件中恰好只有一份 `current: true`；否则构建会失败。`pdf` 可省略，省略后页面不会显示 PDF 下载入口。证件照位于 `public/images/profile.jpg`。

## 本地质量门

提交前按顺序运行：

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

浏览器测试覆盖桌面与手机布局、主题跨页持久化、移动导航、横向溢出，以及阻断外部网络后核心页面仍可展示。

## 部署

部署前先设置 `NEXT_PUBLIC_SITE_URL`，然后按 [部署交接文档](docs/DEPLOYMENT.md) 操作。首次推送远端、连接 Vercel 或公开部署都需要站点所有者明确确认。
