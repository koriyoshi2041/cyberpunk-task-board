import { useState, useRef, useCallback, type MouseEvent, type ReactNode } from 'react'

interface HolographicCardProps {
  readonly children: ReactNode
  readonly className?: string
  readonly onClick?: () => void
  readonly draggable?: boolean
  readonly onDragStart?: (e: React.DragEvent) => void
}

export function HolographicCard({
  children,
  className = '',
  onClick,
  draggable,
  onDragStart,
}: HolographicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }, [])

  return (
    <div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={onClick}
      draggable={draggable}
      onDragStart={onDragStart}
    >
      {/* Holographic glow layer */}
      <div
        className="pointer-events-none absolute -inset-[2px] rounded-xl"
        style={{
          opacity: isHovering ? 1 : 0,
          transition: 'opacity 0.3s ease',
          background: `radial-gradient(
            300px circle at ${mousePos.x}px ${mousePos.y}px,
            rgba(138, 43, 226, 0.15),
            rgba(65, 105, 225, 0.1),
            transparent 60%
          )`,
          willChange: 'opacity',
          transform: 'translateZ(0)',
        }}
      />
      {/* Card content with glassmorphism */}
      <div className="glass-card relative p-6">
        {children}
      </div>
    </div>
  )
}
