import { useState, useEffect } from 'react'
import type { Task, Priority } from '../../types/task'
import { PRIORITY_COLORS, COLUMNS } from '../../types/task'

interface TaskModalProps {
  readonly task: Task | null
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly onUpdate: (taskId: string, updates: Partial<Task>) => void
  readonly onDelete: (taskId: string) => void
}

export function TaskModal({ task, isOpen, onClose, onUpdate, onDelete }: TaskModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState<Partial<Task>>({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (task) {
      setEditedTask({
        title: task.title,
        priority: task.priority,
        dueDate: task.dueDate,
        assignee: task.assignee,
        progress: task.progress,
      })
    }
    setIsEditing(false)
    setShowDeleteConfirm(false)
  }, [task])

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

  const colors = PRIORITY_COLORS[task.priority]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Task Details</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
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
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Title</label>
            {isEditing ? (
              <input
                type="text"
                value={editedTask.title || ''}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            ) : (
              <p className="text-base text-gray-900">{task.title}</p>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Priority</label>
            {isEditing ? (
              <select
                value={editedTask.priority || task.priority}
                onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value as Priority })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            ) : (
              <span
                className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
                style={{ backgroundColor: colors.bg, color: colors.text }}
              >
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
            )}
          </div>

          {/* Due Date */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Due Date</label>
            {isEditing ? (
              <input
                type="date"
                value={editedTask.dueDate || task.dueDate}
                onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            ) : (
              <p className="text-gray-900">{new Date(task.dueDate).toLocaleDateString('en-US', { 
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
              })}</p>
            )}
          </div>

          {/* Progress */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Progress: {editedTask.progress ?? task.progress}%
            </label>
            {isEditing ? (
              <input
                type="range"
                min="0"
                max="100"
                value={editedTask.progress ?? task.progress}
                onChange={(e) => setEditedTask({ ...editedTask, progress: parseInt(e.target.value) })}
                className="w-full accent-violet-600"
              />
            ) : (
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-violet-600 transition-all"
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            )}
          </div>

          {/* Column */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Status</label>
            <p className="text-gray-900">
              {COLUMNS.find(c => c.id === task.columnId)?.title || task.columnId}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
          {showDeleteConfirm ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-red-600">Delete this task?</span>
              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
              >
                Yes, delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Delete task
            </button>
          )}

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
                >
                  Save changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
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
