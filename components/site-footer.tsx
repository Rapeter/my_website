import { siteConfig } from '@/lib/site-config'
import { WechatContact } from '@/components/wechat-contact'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <strong>{siteConfig.brandName}</strong>
          <p>AI Agent / AI 应用开发</p>
          <small>© {new Date().getFullYear()} {siteConfig.brandName}</small>
        </div>
        <ul className="site-footer__contacts" aria-label="联系方式">
          <li>
            <span className="site-footer__label">Email</span>
            <span className="site-footer__value">{siteConfig.email}</span>
          </li>
          <li>
            <span className="site-footer__label">GitHub</span>
            <a className="site-footer__value" href={siteConfig.github} target="_blank" rel="noreferrer">
              {siteConfig.github}
            </a>
          </li>
          <li>
            <span className="site-footer__label">WeChat</span>
            <WechatContact
              imageSrc={siteConfig.wechatImage}
              dialogLabel="微信二维码"
              imageAlt="SylarWang 的微信名片二维码"
            />
          </li>
        </ul>
      </div>
    </footer>
  )
}
