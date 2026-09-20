# 部署交接

当前项目使用标准 Next.js 构建。这样即使 `content/posts/` 中暂时没有公开文章，动态文章路由也能保持诚实的零内容状态；现有首页、项目、博客索引、简历和关于页仍会预渲染。建议部署到 Vercel 等支持 Next.js 的平台，而不是仅接受静态文件的托管服务。

## 发布前条件

- 本地质量门全部通过。
- `main` 分支只包含已经确认的内容。
- 生产域名或 Vercel 预览地址已确定，用于设置 `NEXT_PUBLIC_SITE_URL`。
- 已获得网站所有者对远端推送、账号连接和公开发布的明确授权。

## 首次部署步骤

1. 将已经验证的 `main` 分支推送到网站所有者指定的 GitHub 仓库。
2. 在 Vercel 中导入该仓库，并选择 Next.js 项目预设。
3. 将构建命令设为 `pnpm build`，保留 Vercel 对 `.next` 输出的默认处理，不填写自定义输出目录。
4. 在项目环境变量中添加 `NEXT_PUBLIC_SITE_URL`。首次预览可填预览地址；正式上线前改成最终生产地址并重新部署。
5. 创建 Preview Deployment，并逐项检查：
   - `/`
   - `/projects/folio`
   - `/blog`
   - `/resume`
   - `/about`
   - `/sitemap.xml`
   - `/robots.txt`
6. 同时检查浅色、深色、桌面与手机视口，确认外部 GitHub 链接和邮件链接正确。
7. 预览验收通过后，将该版本提升为 Production Deployment。
8. 只有生产地址工作正常后再绑定自定义域名；域名生效后，把 `NEXT_PUBLIC_SITE_URL` 更新为自定义域名并重新部署。

## 发布后检查

- `sitemap.xml` 中的每个 URL 都使用生产域名，不包含 `localhost`。
- `robots.txt` 指向生产 sitemap。
- `/resume` 只展示一份当前简历，不出现历史版本选择。
- 草稿文章不出现在博客、首页、静态参数或 sitemap 中。
- GitHub 或其他外部服务不可用时，站点核心内容仍可阅读。

## 边界

本文档只描述部署流程。自动化执行不得在未授权的情况下推送远端仓库、连接 GitHub/Vercel 账号、创建项目、绑定域名或公开发布。
