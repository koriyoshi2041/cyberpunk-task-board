import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'

interface CursorState {
  readonly text: string
  readonly scale: number
}

export function useMouse() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorOuterRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef<CursorState>({ text: '', scale: 1 })
  const quickToXRef = useRef<gsap.QuickToFunc | null>(null)
  const quickToYRef = useRef<gsap.QuickToFunc | null>(null)
  const quickToXOuterRef = useRef<gsap.QuickToFunc | null>(null)
  const quickToYOuterRef = useRef<gsap.QuickToFunc | null>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const outer = cursorOuterRef.current
    if (!cursor || !outer) return

    // Use gsap.quickTo for better performance
    quickToXRef.current = gsap.quickTo(cursor, 'x', { duration: 0.1, ease: 'power2.out' })
    quickToYRef.current = gsap.quickTo(cursor, 'y', { duration: 0.1, ease: 'power2.out' })
    quickToXOuterRef.current = gsap.quickTo(outer, 'x', { duration: 0.25, ease: 'power2.out' })
    quickToYOuterRef.current = gsap.quickTo(outer, 'y', { duration: 0.25, ease: 'power2.out' })

    const onMove = (e: MouseEvent) => {
      quickToXRef.current?.(e.clientX)
      quickToYRef.current?.(e.clientY)
      quickToXOuterRef.current?.(e.clientX)
      quickToYOuterRef.current?.(e.clientY)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const setCursorState = useCallback((text: string, scale: number) => {
    stateRef.current = { text, scale }
    const outer = cursorOuterRef.current
    if (!outer) return

    const label = outer.querySelector('.cursor-label') as HTMLElement | null
    if (label) {
      label.textContent = text
      label.style.opacity = text ? '1' : '0'
    }

    gsap.to(outer, {
      scale,
      duration: 0.3,
      ease: 'back.out(1.7)',
    })
  }, [])

  const resetCursor = useCallback(() => {
    setCursorState('', 1)
  }, [setCursorState])

  return { cursorRef, cursorOuterRef, setCursorState, resetCursor }
}
