import Link from 'next/link'
import { siteConfig } from '@/lib/site-config'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p>© {new Date().getFullYear()} {siteConfig.brandName}. Built for clear, verifiable work.</p>
        <div className="site-footer__links">
          <a href={siteConfig.github} target="_blank" rel="noreferrer">GitHub</a>
          <Link href={`mailto:${siteConfig.email}`}>Email</Link>
        </div>
      </div>
    </footer>
  )
}
