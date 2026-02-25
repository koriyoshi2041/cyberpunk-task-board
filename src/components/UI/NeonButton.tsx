import { useRef } from 'react'
import gsap from 'gsap'

interface NeonButtonProps {
  readonly children: React.ReactNode
  readonly onClick: () => void
  readonly color?: string
  readonly className?: string
  readonly onMouseEnter?: () => void
  readonly onMouseLeave?: () => void
}

export function NeonButton({
  children,
  onClick,
  color = '#ff2d95',
  className = '',
  onMouseEnter,
  onMouseLeave,
}: NeonButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const pulseRef = useRef<gsap.core.Tween | null>(null)

  const handleMouseEnter = () => {
    if (pulseRef.current) pulseRef.current.kill()
    const el = ref.current
    if (!el) return

    gsap.to(el, {
      boxShadow: `0 0 20px ${color}88, inset 0 0 20px ${color}22`,
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.out',
    })
    onMouseEnter?.()
  }

  const handleMouseLeave = () => {
    const el = ref.current
    if (!el) return

    gsap.to(el, {
      boxShadow: `0 0 8px ${color}44`,
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    })

    pulseRef.current = gsap.to(el, {
      boxShadow: `0 0 12px ${color}66, 0 0 4px ${color}22`,
      duration: 1.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 0.5,
    })
    onMouseLeave?.()
  }

  const handleClick = () => {
    const el = ref.current
    if (!el) return

    gsap.fromTo(
      el,
      { scale: 0.95 },
      { scale: 1.05, duration: 0.15, ease: 'back.out(3)', yoyo: true, repeat: 1 }
    )
    onClick()
  }

  return (
    <button
      ref={ref}
      className={`cursor-none border font-mono text-sm tracking-wider uppercase transition-colors ${className}`}
      style={{
        borderColor: color,
        color,
        boxShadow: `0 0 8px ${color}44`,
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  )
}
