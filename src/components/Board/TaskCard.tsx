import { useRef } from 'react'
import type { Task } from '../../types/task'
import { PRIORITY_COLORS } from '../../types/task'

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
  const cardRef = useRef<HTMLDivElement>(null)
  const colors = PRIORITY_COLORS[task.priority]

  return (
    <div
      ref={cardRef}
      className="group rounded-lg border bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300"
      style={{ borderColor: '#e5e5e5' }}
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={onClick}
    >
      {/* Title */}
      <h3 className="mb-3 text-[15px] font-medium leading-snug text-gray-900">
        {task.title}
      </h3>

      {/* Tags row */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {/* Priority tag */}
        <span
          className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
          style={{
            backgroundColor: colors.bg,
            color: colors.text,
          }}
        >
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>

        {/* Due date */}
        <span className="inline-flex items-center gap-1 text-[13px] text-gray-500">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDate(task.dueDate)}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">Progress</span>
          <span className="text-xs font-medium text-gray-700">{task.progress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${task.progress}%`,
              backgroundColor: task.progress === 100 ? '#10b981' : '#3b82f6',
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div 
            className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-medium text-white"
            style={{ backgroundColor: '#6366f1' }}
          >
            {task.assignee.charAt(0)}
          </div>
          <span className="text-[13px] text-gray-600">{task.assignee}</span>
        </div>
        
        {/* Hover indicator */}
        <svg 
          className="h-4 w-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  )
}
