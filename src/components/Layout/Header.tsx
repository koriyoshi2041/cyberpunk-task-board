import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { GlitchText } from '../UI/GlitchText'

interface HeaderProps {
  readonly onAddTask: () => void
  readonly onMouseEnterButton: () => void
  readonly onMouseLeaveButton: () => void
}

export function Header({ onAddTask, onMouseEnterButton, onMouseLeaveButton }: HeaderProps) {
  const headerRef = useRef<HTMLElement>(null)
  const [titleRevealed, setTitleRevealed] = useState(false)

  useEffect(() => {
    const el = headerRef.current
    if (!el) return

    gsap.fromTo(
      el,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.3 }
    )

    const timer = setTimeout(() => setTitleRevealed(true), 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <header
      ref={headerRef}
      className="relative flex items-center justify-between border-b px-6 py-4"
      style={{
        borderColor: 'rgba(157, 78, 221, 0.2)',
        backgroundColor: 'rgba(248, 249, 250, 0.8)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="flex items-center gap-4">
        <div
          className="flex items-center gap-2 font-mono text-xs tracking-wider"
          style={{ color: '#7c3aed' }}
        >
          <span className="inline-block h-2 w-2 animate-pulse rounded-full" style={{ backgroundColor: '#00fff0', boxShadow: '0 0 8px rgba(0,255,240,0.6)' }} />
          <span>SYS</span>
        </div>
        <GlitchText as="h1" className="font-mono text-lg font-bold tracking-widest" autoPlay>
          <span style={{ color: '#111827' }}>{'[ '}</span>
          <span style={{ color: '#ff2d95' }}>TASK_BOARD</span>
          <span style={{ color: '#4a4a6a' }}> v2.077</span>
          <span style={{ color: '#111827' }}>{' ]'}</span>
        </GlitchText>
        {titleRevealed && (
          <span
            className="animate-pulse font-mono text-[10px] tracking-wider"
            style={{ color: '#00fff0' }}
          >
            CONNECTED
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          className="cursor-none border px-3 py-1.5 font-mono text-xs tracking-wider transition-all hover:scale-105"
          style={{
            borderColor: '#ff2d95',
            color: '#ff2d95',
            boxShadow: '0 0 8px rgba(255,45,149,0.3)',
          }}
          onClick={onAddTask}
          onMouseEnter={onMouseEnterButton}
          onMouseLeave={onMouseLeaveButton}
        >
          [+] NEW_TASK
        </button>
        <div
          className="flex items-center gap-1 font-mono text-xs"
          style={{ color: '#4a4a6a' }}
        >
          <span className="cursor-none border px-2 py-1 transition-colors hover:border-[#7c3aed]" style={{ borderColor: 'rgba(157,78,221,0.3)' }}>
            ⚙
          </span>
          <span className="cursor-none border px-2 py-1 transition-colors hover:border-[#7c3aed]" style={{ borderColor: 'rgba(157,78,221,0.3)' }}>
            ◉
          </span>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 h-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent, #ff2d95, #00fff0, #7c3aed, transparent)',
          width: '100%',
        }}
      />
    </header>
  )
}
