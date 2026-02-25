import { useState, useRef, useEffect } from 'react'
import type { Task, ColumnId, Priority } from '../../types/task'
import type { Column as ColumnType } from '../../types/task'
import { TaskCard } from './TaskCard'

interface ColumnProps {
  readonly column: ColumnType
  readonly tasks: readonly Task[]
  readonly onDragStart: (e: React.DragEvent, taskId: string) => void
  readonly onDrop: (columnId: ColumnId) => void
  readonly onComplete: (taskId: string, rect: DOMRect) => void
  readonly onAddTask: (columnId: ColumnId, title: string, priority: Priority) => void
  readonly onTaskClick: (task: Task) => void
}

export function Column({
  column,
  tasks,
  onDragStart,
  onDrop,
  onComplete,
  onAddTask,
  onTaskClick,
}: ColumnProps) {
  const [isOver, setIsOver] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsOver(true)
  }

  const handleDragLeave = () => setIsOver(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsOver(false)
    onDrop(column.id)
  }

  const handleAddSubmit = () => {
    const trimmed = newTitle.trim()
    if (trimmed) {
      onAddTask(column.id, trimmed, 'medium')
    }
    setNewTitle('')
    setIsAdding(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddSubmit()
    if (e.key === 'Escape') {
      setNewTitle('')
      setIsAdding(false)
    }
  }

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isAdding])

  return (
    <div
      className="flex min-h-[500px] w-80 flex-shrink-0 flex-col rounded-xl transition-colors duration-200"
      style={{
        backgroundColor: isOver ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
        boxShadow: isOver ? 'inset 0 0 0 1px rgba(138, 43, 226, 0.1)' : 'none',
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Header with large display number */}
      <div className="relative px-4 py-3">
        {/* Large stroke number behind */}
        <span
          className="text-stroke pointer-events-none absolute right-4 -top-1 select-none"
          style={{ fontSize: '48px', fontWeight: 600, lineHeight: 1 }}
        >
          {String(tasks.length).padStart(2, '0')}
        </span>

        <div className="flex items-center justify-between">
          <h2
            className="text-lg font-medium"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text-main)',
            }}
          >
            {column.title}
          </h2>

          <button
            onClick={() => setIsAdding(true)}
            className="flex h-7 w-7 items-center justify-center rounded-md transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 space-y-3 overflow-y-auto px-3 pb-3">
        {/* Add task input */}
        {isAdding && (
          <div
            className="glass-card p-3"
            style={{ border: '1px solid rgba(138, 43, 226, 0.2)' }}
          >
            <input
              ref={inputRef}
              className="w-full bg-transparent text-[15px] placeholder-[var(--color-text-muted)] outline-none"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-text-main)',
              }}
              placeholder="Task name..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleAddSubmit}
            />
            <div className="mono-data mt-2 flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
              <span>Enter to save</span>
              <span>·</span>
              <span>Esc to cancel</span>
            </div>
          </div>
        )}

        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDragStart={onDragStart}
            onComplete={onComplete}
            onClick={() => onTaskClick(task)}
          />
        ))}

        {/* Empty state */}
        {tasks.length === 0 && !isAdding && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div
              className="mb-2 rounded-full p-3"
              style={{ backgroundColor: 'rgba(138, 43, 226, 0.05)' }}
            >
              <svg
                className="h-6 w-6"
                style={{ color: 'var(--color-text-muted)' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="mono-data" style={{ color: 'var(--color-text-muted)' }}>
              No tasks yet
            </p>
            <button
              onClick={() => setIsAdding(true)}
              className="gradient-text mono-data mt-2 font-bold"
            >
              Add a task
            </button>
          </div>
        )}
      </div>

      {/* Add button at bottom */}
      {!isAdding && tasks.length > 0 && (
        <div className="px-3 pb-3">
          <button
            onClick={() => setIsAdding(true)}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-[14px] transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add task
          </button>
        </div>
      )}
    </div>
  )
}
