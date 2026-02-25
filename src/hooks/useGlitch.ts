import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'

export function useGlitch(autoPlay = false, interval = 4000) {
  const ref = useRef<HTMLElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const triggerGlitch = useCallback(() => {
    const el = ref.current
    if (!el) return

    const tl = gsap.timeline()

    tl.to(el, {
      skewX: () => gsap.utils.random(-3, 3),
      x: () => gsap.utils.random(-2, 2),
      duration: 0.05,
      ease: 'power4.inOut',
    })
      .to(el, {
        skewX: () => gsap.utils.random(-2, 2),
        x: () => gsap.utils.random(-3, 3),
        filter: 'hue-rotate(90deg)',
        duration: 0.05,
        ease: 'power4.inOut',
      })
      .to(el, {
        skewX: 0,
        x: 0,
        filter: 'hue-rotate(0deg)',
        duration: 0.05,
        ease: 'power4.inOut',
      })
  }, [])

  useEffect(() => {
    if (!autoPlay) return

    const scheduleNext = () => {
      const randomDelay = interval + Math.random() * interval
      timeoutRef.current = setTimeout(() => {
        triggerGlitch()
        scheduleNext()
      }, randomDelay)
    }

    scheduleNext()

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [autoPlay, interval, triggerGlitch])

  return { ref, triggerGlitch }
}
