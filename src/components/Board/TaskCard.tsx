import type { Task } from '../../types/task'
import { HolographicCard } from '../UI/HolographicCard'
import { StatusTag } from '../UI/StatusTag'

interface TaskCardProps {
  readonly task: Task
  readonly onDragStart: (e: React.DragEvent, taskId: string) => void
  readonly onComplete: (taskId: string, rect: DOMRect) => void
  readonly onClick: () => void
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = Math.ceil((date.getTime() - now.getTime()) / 86400000)

  if (diff < 0) return `${Math.abs(diff)}d overdue`
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff <= 7) return `${diff} days`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function TaskCard({ task, onDragStart, onClick }: TaskCardProps) {
  return (
    <HolographicCard
      className="group"
      onClick={onClick}
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
    >
      {/* Top meta row */}
      <div className="mb-3 flex items-center justify-between">
        <StatusTag priority={task.priority} />
        <span className="mono-data text-[var(--color-text-muted)]">
          {formatDate(task.dueDate)}
        </span>
      </div>

      {/* Title */}
      <h3
        className="mb-4 text-xl font-semibold leading-snug"
        style={{
          fontFamily: 'var(--font-heading)',
          color: 'var(--color-text-main)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {task.title}
      </h3>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between">
          <span className="mono-data text-[var(--color-text-muted)]">Progress</span>
          <span className="gradient-text mono-data font-bold">
            {task.progress}%
          </span>
        </div>
        <div
          className="h-[2px] w-full overflow-hidden rounded-full"
          style={{ backgroundColor: 'var(--color-border-soft)' }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${task.progress}%`,
              background: `linear-gradient(90deg, var(--color-neon-purple), var(--color-neon-blue))`,
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t pt-3" style={{ borderColor: 'var(--color-border-soft)' }}>
        <div className="flex items-center gap-2">
          <div
            className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-medium text-white"
            style={{
              background: 'linear-gradient(135deg, var(--color-neon-purple), var(--color-neon-blue))',
            }}
          >
            {task.assignee.charAt(0)}
          </div>
          <span className="mono-data text-[var(--color-text-muted)]">{task.assignee}</span>
        </div>

        {/* Hover chevron */}
        <svg
          className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100"
          style={{ color: 'var(--color-neon-blue)' }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </HolographicCard>
  )
}
