import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function ScanLines() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    gsap.fromTo(
      el,
      { y: '-100%' },
      {
        y: '100%',
        duration: 8,
        ease: 'none',
        repeat: -1,
      }
    )
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden opacity-[0.03]">
      <div
        ref={ref}
        className="absolute inset-0"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
          height: '200%',
        }}
      />
    </div>
  )
}
