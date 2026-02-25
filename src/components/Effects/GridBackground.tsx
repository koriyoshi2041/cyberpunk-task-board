import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function GridBackground() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    gsap.to(el, {
      backgroundPosition: '40px 40px',
      duration: 20,
      ease: 'none',
      repeat: -1,
    })
  }, [])

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.08]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(157, 78, 221, 0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(157, 78, 221, 0.3) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        backgroundPosition: '0px 0px',
      }}
    />
  )
}
