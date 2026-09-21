'use client'

import Image from 'next/image'
import { useEffect, useId, useRef, useState } from 'react'

type WechatContactProps = {
  imageSrc: string
  imageAlt: string
  dialogLabel: string
}

export function WechatContact({ imageSrc, imageAlt, dialogLabel }: WechatContactProps) {
  const generatedId = useId()
  const dialogId = `wechat-card-${generatedId.replace(/:/g, '')}`
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPinned, setIsPinned] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [hasFocus, setHasFocus] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const isOpen = isPinned || (!isDismissed && (isHovered || hasFocus))

  useEffect(() => {
    const close = () => {
      setIsPinned(false)
      setIsHovered(false)
      setHasFocus(false)
      setIsDismissed(true)
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) close()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      close()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div
      className="wechat-contact"
      ref={containerRef}
      onPointerEnter={() => {
        setIsHovered(true)
        setIsDismissed(false)
      }}
      onPointerLeave={() => setIsHovered(false)}
      onFocusCapture={() => {
        setHasFocus(true)
        setIsDismissed(false)
      }}
      onBlurCapture={(event) => {
        if (!containerRef.current?.contains(event.relatedTarget as Node | null)) setHasFocus(false)
      }}
    >
      <button
        className="wechat-contact__trigger"
        type="button"
        aria-expanded={isOpen}
        aria-controls={dialogId}
        aria-haspopup="dialog"
        onClick={() => {
          setIsPinned((current) => {
            if (current) setIsDismissed(true)
            return !current
          })
        }}
      >
        WeChat
      </button>

      {isOpen ? (
        <div className="wechat-contact__popover" id={dialogId} role="dialog" aria-label={dialogLabel}>
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={888}
            height={1131}
            sizes="(max-width: 480px) calc(100vw - 2rem), 288px"
          />
        </div>
      ) : null}
    </div>
  )
}
