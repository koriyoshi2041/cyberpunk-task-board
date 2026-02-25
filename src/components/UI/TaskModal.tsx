import { useState, useMemo, useEffect, useRef } from 'react'
import type { Task, Priority } from '../../types/task'
import { COLUMNS } from '../../types/task'
import { StatusTag } from '../UI/StatusTag'

interface TaskModalProps {
  readonly task: Task | null
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly onUpdate: (taskId: string, updates: Partial<Task>) => void
  readonly onDelete: (taskId: string) => void
}

export function TaskModal({ task, isOpen, onClose, onUpdate, onDelete }: TaskModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editOverrides, setEditOverrides] = useState<Partial<Task>>({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const prevTaskIdRef = useRef<string | null>(null)

  // Reset editing state when task changes (without setState in effect)
  if (task?.id !== prevTaskIdRef.current) {
    prevTaskIdRef.current = task?.id ?? null
    if (isEditing) setIsEditing(false)
    if (showDeleteConfirm) setShowDeleteConfirm(false)
    if (Object.keys(editOverrides).length > 0) setEditOverrides({})
  }

  const editedTask = useMemo<Partial<Task>>(() => {
    if (!task) return {}
    return {
      title: task.title,
      priority: task.priority,
      dueDate: task.dueDate,
      assignee: task.assignee,
      progress: task.progress,
      ...editOverrides,
    }
  }, [task, editOverrides])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  const handleSave = () => {
    if (task && editedTask) {
      onUpdate(task.id, editedTask)
      setIsEditing(false)
    }
  }

  const handleDelete = () => {
    if (task) {
      onDelete(task.id)
      onClose()
    }
  }

  if (!isOpen || !task) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="glass-card relative w-full max-w-lg" style={{ boxShadow: 'var(--hover-glow)' }}>
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid var(--color-border-soft)' }}
        >
          <h2
            className="text-lg font-semibold"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text-main)',
            }}
          >
            Task Details
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="space-y-5 px-6 py-5">
          {/* Title */}
          <div>
            <label className="mono-data mb-1.5 block font-medium" style={{ color: 'var(--color-text-muted)' }}>
              Title
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedTask.title || ''}
                onChange={(e) => setEditOverrides({ ...editOverrides, title: e.target.value })}
                className="glass-card w-full px-3 py-2 outline-none"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--color-text-main)',
                }}
              />
            ) : (
              <p
                className="text-base"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--color-text-main)',
                }}
              >
                {task.title}
              </p>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="mono-data mb-1.5 block font-medium" style={{ color: 'var(--color-text-muted)' }}>
              Priority
            </label>
            {isEditing ? (
              <select
                value={editedTask.priority || task.priority}
                onChange={(e) => setEditOverrides({ ...editOverrides, priority: e.target.value as Priority })}
                className="glass-card w-full px-3 py-2 outline-none"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--color-text-main)',
                }}
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            ) : (
              <StatusTag priority={task.priority} />
            )}
          </div>

          {/* Due Date */}
          <div>
            <label className="mono-data mb-1.5 block font-medium" style={{ color: 'var(--color-text-muted)' }}>
              Due Date
            </label>
            {isEditing ? (
              <input
                type="date"
                value={editedTask.dueDate || task.dueDate}
                onChange={(e) => setEditOverrides({ ...editOverrides, dueDate: e.target.value })}
                className="glass-card w-full px-3 py-2 outline-none"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--color-text-main)',
                }}
              />
            ) : (
              <p className="mono-data" style={{ color: 'var(--color-text-main)' }}>
                {new Date(task.dueDate).toLocaleDateString('en-US', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
            )}
          </div>

          {/* Progress */}
          <div>
            <label className="mono-data mb-1.5 block font-medium" style={{ color: 'var(--color-text-muted)' }}>
              Progress: <span className="gradient-text">{editedTask.progress ?? task.progress}%</span>
            </label>
            {isEditing ? (
              <input
                type="range"
                min="0"
                max="100"
                value={editedTask.progress ?? task.progress}
                onChange={(e) => setEditOverrides({ ...editOverrides, progress: parseInt(e.target.value) })}
                className="w-full accent-[var(--color-neon-purple)]"
              />
            ) : (
              <div
                className="h-[2px] w-full overflow-hidden rounded-full"
                style={{ backgroundColor: 'var(--color-border-soft)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${task.progress}%`,
                    background: 'linear-gradient(90deg, var(--color-neon-purple), var(--color-neon-blue))',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
            )}
          </div>

          {/* Column */}
          <div>
            <label className="mono-data mb-1.5 block font-medium" style={{ color: 'var(--color-text-muted)' }}>
              Status
            </label>
            <p className="mono-data" style={{ color: 'var(--color-text-main)' }}>
              {COLUMNS.find(c => c.id === task.columnId)?.title || task.columnId}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderTop: '1px solid var(--color-border-soft)' }}
        >
          {showDeleteConfirm ? (
            <div className="flex items-center gap-2">
              <span className="mono-data" style={{ color: 'var(--color-status-crit)' }}>
                Delete this task?
              </span>
              <button
                onClick={handleDelete}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-white"
                style={{ backgroundColor: 'var(--color-status-crit)' }}
              >
                Yes, delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="glass-card rounded-lg px-3 py-1.5 text-sm font-medium"
                style={{ color: 'var(--color-text-main)' }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="mono-data transition-opacity hover:opacity-70"
              style={{ color: 'var(--color-status-crit)' }}
            >
              Delete task
            </button>
          )}

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="glass-card rounded-lg px-4 py-2 text-sm font-medium"
                  style={{ color: 'var(--color-text-main)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-neon-purple), var(--color-neon-blue))',
                  }}
                >
                  Save changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, var(--color-neon-purple), var(--color-neon-blue))',
                }}
              >
                Edit task
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
