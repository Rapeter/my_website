'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { siteConfig } from '@/lib/site-config'
import { ThemeToggle } from '@/components/theme-toggle'

export function SiteHeader() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-brand" href="/" aria-label={`${siteConfig.name}首页`}>
          <span className="site-brand__mark" aria-hidden="true">R/</span>
          <span>{siteConfig.name}</span>
        </Link>

        <button
          className="menu-button"
          type="button"
          aria-expanded={isOpen}
          aria-controls="main-navigation"
          onClick={() => setIsOpen((value) => !value)}
        >
          <span aria-hidden="true">{isOpen ? '关闭' : '菜单'}</span>
          <span className="sr-only">{isOpen ? '关闭主导航' : '打开主导航'}</span>
        </button>

        <div className={`site-header__panel${isOpen ? ' is-open' : ''}`}>
          <nav id="main-navigation" aria-label="主导航">
            <ul className="site-navigation">
              {siteConfig.navigation.map((item) => {
                const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
