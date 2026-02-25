import { useState, useRef, useEffect } from 'react'
import type { Task, ColumnId, Priority } from '../../types/task'
import type { Column as ColumnType } from '../../types/task'
import { COLUMN_COLORS } from '../../types/task'
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
  const accentColor = COLUMN_COLORS[column.id]

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
      className={`flex min-h-[500px] w-80 flex-shrink-0 flex-col rounded-xl transition-colors duration-200 ${
        isOver ? 'bg-blue-50' : 'bg-gray-50/50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
          <h2 className="text-[15px] font-semibold text-gray-800">{column.title}</h2>
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gray-200 px-1.5 text-xs font-medium text-gray-600">
            {tasks.length}
          </span>
        </div>
        
        <button
          onClick={() => setIsAdding(true)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Cards */}
      <div className="flex-1 space-y-3 overflow-y-auto px-3 pb-3">
        {/* Add task input */}
        {isAdding && (
          <div className="rounded-lg border-2 border-blue-400 bg-white p-3 shadow-sm">
            <input
              ref={inputRef}
              className="w-full text-[15px] text-gray-900 placeholder-gray-400 outline-none"
              placeholder="Task name..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleAddSubmit}
            />
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
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
            <div className="mb-2 rounded-full bg-gray-100 p-3">
              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm text-gray-400">No tasks yet</p>
            <button
              onClick={() => setIsAdding(true)}
              className="mt-2 text-sm font-medium text-blue-500 hover:text-blue-600"
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
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-[14px] text-gray-500 hover:bg-gray-100 transition-colors"
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
