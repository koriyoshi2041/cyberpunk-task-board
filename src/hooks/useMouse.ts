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

  useEffect(() => {
    const cursor = cursorRef.current
    const outer = cursorOuterRef.current
    if (!cursor || !outer) return

    const onMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out',
      })
      gsap.to(outer, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    window.addEventListener('mousemove', onMove)
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
