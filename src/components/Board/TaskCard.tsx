import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import type { Task } from '../../types/task'
import { PRIORITY_COLORS } from '../../types/task'

interface TaskCardProps {
  readonly task: Task
  readonly onDragStart: (e: React.DragEvent, taskId: string) => void
  readonly onComplete: (taskId: string, rect: DOMRect) => void
  readonly onMouseEnterCard: () => void
  readonly onMouseLeaveCard: () => void
  readonly index: number
}

function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr).getTime()
  const now = Date.now()
  return Math.ceil((target - now) / 86400000)
}

function getCountdownColor(days: number): string {
  if (days < 0) return '#ff2d95'
  if (days <= 3) return '#ffe66d'
  return '#4a4a6a'
}

export function TaskCard({
  task,
  onDragStart,
  onComplete,
  onMouseEnterCard,
  onMouseLeaveCard,
  index,
}: TaskCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const glowColor = PRIORITY_COLORS[task.priority]
  const daysLeft = getDaysUntil(task.dueDate)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    gsap.fromTo(
      el,
      { opacity: 0, y: 20, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: 'back.out(1.4)',
        delay: 0.1 * index + 0.5,
      }
    )
  }, [index])

  const handleMouseEnter = () => {
    const el = cardRef.current
    if (!el) return

    gsap.to(el, {
      y: -4,
      boxShadow: `0 8px 30px rgba(0,0,0,0.08), 0 0 15px ${glowColor}55`,
      borderColor: glowColor,
      duration: 0.3,
      ease: 'power2.out',
    })
    onMouseEnterCard()
  }

  const handleMouseLeave = () => {
    const el = cardRef.current
    if (!el) return

    gsap.to(el, {
      y: 0,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      borderColor: 'rgba(157, 78, 221, 0.15)',
      duration: 0.3,
      ease: 'power2.out',
    })
    onMouseLeaveCard()
  }

  const handleDragStart = (e: React.DragEvent) => {
    const el = cardRef.current
    if (!el) return

    gsap.to(el, {
      rotation: 2,
      scale: 1.05,
      boxShadow: `0 20px 40px rgba(0,0,0,0.15), 0 0 25px ${glowColor}66`,
      duration: 0.2,
    })
    onDragStart(e, task.id)
  }

  const handleDragEnd = () => {
    const el = cardRef.current
    if (!el) return

    gsap.to(el, {
      rotation: 0,
      scale: 1,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      duration: 0.3,
      ease: 'back.out(1.7)',
    })
  }

  const handleDoubleClick = () => {
    if (task.columnId !== 'done') return

    const el = cardRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()

    const tl = gsap.timeline({
      onComplete: () => onComplete(task.id, rect),
    })

    tl.to(el, { x: -3, duration: 0.04 })
      .to(el, { x: 3, duration: 0.04 })
      .to(el, { x: -2, filter: 'hue-rotate(90deg)', duration: 0.04 })
      .to(el, { x: 2, filter: 'hue-rotate(-90deg)', duration: 0.04 })
      .to(el, { x: 0, filter: 'hue-rotate(0deg)', duration: 0.04 })
      .to(el, { opacity: 0, scale: 0.8, y: -10, duration: 0.3 })
  }

  return (
    <div
      ref={cardRef}
      className="group relative cursor-none border p-3 opacity-0"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderColor: 'rgba(157, 78, 221, 0.15)',
        backdropFilter: 'blur(4px)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onDoubleClick={handleDoubleClick}
    >
      <div className="mb-2 flex items-start justify-between">
        <h3
          className="font-mono text-xs font-medium leading-tight tracking-wide"
          style={{ color: '#1a1a2e' }}
        >
          {task.title}
        </h3>
      </div>

      <div className="mb-2 flex items-center gap-2">
        <span
          className="inline-block rounded-sm px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest"
          style={{
            backgroundColor: `${glowColor}18`,
            color: glowColor,
            border: `1px solid ${glowColor}33`,
          }}
        >
          {task.priority}
        </span>
        <span
          className="font-mono text-[9px] tracking-wider"
          style={{ color: getCountdownColor(daysLeft) }}
        >
          {daysLeft < 0 ? `OVERDUE ${Math.abs(daysLeft)}d` : `${daysLeft}d left`}
        </span>
      </div>

      <div className="mb-2 h-1 w-full overflow-hidden" style={{ backgroundColor: 'rgba(157,78,221,0.1)' }}>
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${task.progress}%`,
            backgroundColor: glowColor,
            boxShadow: `0 0 8px ${glowColor}88`,
          }}
        />
      </div>

      <div className="flex items-center justify-between">
        <div
          className="flex h-5 w-5 items-center justify-center rounded-full font-mono text-[8px] font-bold"
          style={{
            backgroundColor: `${glowColor}20`,
            color: glowColor,
            border: `1px solid ${glowColor}44`,
          }}
        >
          {task.assignee}
        </div>
        <span className="font-mono text-[8px] tracking-wider" style={{ color: '#9d4edd' }}>
          {task.progress}%
        </span>
      </div>

      <div
        className="absolute top-0 right-0 h-0 w-0"
        style={{
          borderTop: `8px solid ${glowColor}44`,
          borderLeft: '8px solid transparent',
        }}
      />
    </div>
  )
}
