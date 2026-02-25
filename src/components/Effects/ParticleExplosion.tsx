import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'

interface ParticleExplosionProps {
  readonly x: number
  readonly y: number
  readonly color: string
  readonly onComplete: () => void
}

export function ParticleExplosion({ x, y, color, onComplete }: ParticleExplosionProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const createParticles = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const particleCount = 12

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div')
      particle.style.position = 'absolute'
      particle.style.width = '4px'
      particle.style.height = '4px'
      particle.style.backgroundColor = color
      particle.style.boxShadow = `0 0 6px ${color}`
      particle.style.left = '50%'
      particle.style.top = '50%'
      container.appendChild(particle)

      const angle = (i / particleCount) * Math.PI * 2
      const distance = 30 + Math.random() * 60

      gsap.to(particle, {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        opacity: 0,
        scale: 0,
        duration: 0.6 + Math.random() * 0.4,
        ease: 'power2.out',
        onComplete: () => {
          particle.remove()
        },
      })
    }

    setTimeout(onComplete, 1000)
  }, [color, onComplete])

  useEffect(() => {
    createParticles()
  }, [createParticles])

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed z-[9998]"
      style={{ left: x, top: y }}
    />
  )
}
