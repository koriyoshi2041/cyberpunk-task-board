import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import type { Task, ColumnId, Priority } from '../../types/task'
import type { Column as ColumnType } from '../../types/task'
import { TaskCard } from './TaskCard'
import { GlitchText } from '../UI/GlitchText'

interface ColumnProps {
  readonly column: ColumnType
  readonly tasks: readonly Task[]
  readonly onDragStart: (e: React.DragEvent, taskId: string) => void
  readonly onDrop: (columnId: ColumnId) => void
  readonly onComplete: (taskId: string, rect: DOMRect) => void
  readonly onAddTask: (columnId: ColumnId, title: string, priority: Priority) => void
  readonly onMouseEnterCard: () => void
  readonly onMouseLeaveCard: () => void
  readonly onTaskClick: (task: Task) => void
}

const COLUMN_COLORS: Record<ColumnId, string> = {
  backlog: '#9d4edd',
  in_progress: '#00fff0',
  review: '#ffe66d',
  done: '#ff2d95',
}

export function Column({
  column,
  tasks,
  onDragStart,
  onDrop,
  onComplete,
  onAddTask,
  onMouseEnterCard,
  onMouseLeaveCard,
  onTaskClick,
}: ColumnProps) {
  const columnRef = useRef<HTMLDivElement>(null)
  const [isOver, setIsOver] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const prevCountRef = useRef(tasks.length)
  const countRef = useRef<HTMLSpanElement>(null)
  const accentColor = COLUMN_COLORS[column.id]

  useEffect(() => {
    if (tasks.length !== prevCountRef.current) {
      prevCountRef.current = tasks.length
      const el = countRef.current
      if (el) {
        gsap.fromTo(
          el,
          { rotationX: -90, opacity: 0 },
          { rotationX: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
        )
      }
    }
  }, [tasks.length])

  useEffect(() => {
    const el = columnRef.current
    if (!el) return

    gsap.fromTo(
      el,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.2,
      }
    )
  }, [])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!isOver) {
      setIsOver(true)
      const el = columnRef.current
      if (el) {
        gsap.to(el, {
          borderColor: accentColor,
          boxShadow: `0 0 20px ${accentColor}33`,
          duration: 0.3,
        })
      }
    }
  }

  const handleDragLeave = () => {
    setIsOver(false)
    const el = columnRef.current
    if (el) {
      gsap.to(el, {
        borderColor: 'rgba(157, 78, 221, 0.15)',
        boxShadow: 'none',
        duration: 0.3,
      })
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsOver(false)
    const el = columnRef.current
    if (el) {
      gsap.to(el, {
        borderColor: 'rgba(157, 78, 221, 0.15)',
        boxShadow: 'none',
        duration: 0.3,
      })
    }
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

  const handleAddKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddSubmit()
    if (e.key === 'Escape') {
      setNewTitle('')
      setIsAdding(false)
    }
  }

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus()
      gsap.fromTo(
        inputRef.current,
        { width: 0, opacity: 0 },
        { width: '100%', opacity: 1, duration: 0.3, ease: 'power2.out' }
      )
    }
  }, [isAdding])

  return (
    <div
      ref={columnRef}
      className="flex min-h-[400px] w-72 flex-shrink-0 flex-col border opacity-0"
      style={{
        borderColor: 'rgba(157, 78, 221, 0.15)',
        backgroundColor: 'rgba(238, 241, 245, 0.5)',
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div
        className="relative border-b px-3 py-2.5"
        style={{ borderColor: 'rgba(157, 78, 221, 0.15)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: accentColor, boxShadow: `0 0 6px ${accentColor}` }}
            />
            <GlitchText
              className="font-mono text-[11px] font-bold tracking-[0.2em]"
              autoPlay={false}
            >
              <span style={{ color: '#1a1a2e' }}>{column.title}</span>
            </GlitchText>
          </div>
          <span
            ref={countRef}
            className="inline-block font-mono text-[10px] tabular-nums"
            style={{ color: accentColor }}
          >
            [{tasks.length}]
          </span>
        </div>
        <div
          className="mt-1 font-mono text-[8px] tracking-widest"
          style={{ color: '#9d4edd', opacity: 0.5 }}
        >
          {'///'} {column.label} {'///'}
        </div>
        <div
          className="absolute bottom-0 left-0 h-[1px] w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${accentColor}66, transparent)`,
          }}
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-2">
        {tasks.map((task, i) => (
          <TaskCard
            key={task.id}
            task={task}
            index={i}
            onDragStart={onDragStart}
            onComplete={onComplete}
            onMouseEnterCard={onMouseEnterCard}
            onMouseLeaveCard={onMouseLeaveCard}
            onClick={() => onTaskClick(task)}
          />
        ))}
      </div>

      <div className="border-t p-2" style={{ borderColor: 'rgba(157, 78, 221, 0.1)' }}>
        {isAdding ? (
          <div className="flex gap-1">
            <input
              ref={inputRef}
              className="flex-1 border bg-transparent px-2 py-1 font-mono text-[10px] tracking-wider outline-none"
              style={{
                borderColor: accentColor,
                color: '#1a1a2e',
                boxShadow: `0 0 8px ${accentColor}33`,
              }}
              placeholder="ENTER_TASK_NAME..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleAddKeyDown}
              onBlur={handleAddSubmit}
            />
          </div>
        ) : (
          <button
            className="w-full cursor-none border border-dashed py-1 font-mono text-[9px] tracking-wider opacity-40 transition-opacity hover:opacity-100"
            style={{ borderColor: accentColor, color: accentColor }}
            onClick={() => setIsAdding(true)}
          >
            [+] ADD
          </button>
        )}
      </div>
    </div>
  )
}
