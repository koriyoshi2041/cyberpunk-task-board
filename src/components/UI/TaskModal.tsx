import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import type { Task, Priority, ColumnId } from '../../types/task'
import { PRIORITY_COLORS, COLUMNS } from '../../types/task'
import { GlitchText } from './GlitchText'

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
  const modalRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

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
  }, [task])

  useEffect(() => {
    if (isOpen && modalRef.current && overlayRef.current) {
      gsap.fromTo(overlayRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.3 }
      )
      gsap.fromTo(modalRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.4)' }
      )
    }
  }, [isOpen])

  const handleClose = () => {
    if (modalRef.current && overlayRef.current) {
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 })
      gsap.to(modalRef.current, { 
        opacity: 0, scale: 0.95, y: 10, duration: 0.2,
        onComplete: onClose
      })
    } else {
      onClose()
    }
    setIsEditing(false)
    setShowDeleteConfirm(false)
  }

  const handleSave = () => {
    if (task && editedTask) {
      onUpdate(task.id, editedTask)
      setIsEditing(false)
    }
  }

  const handleDelete = () => {
    if (task) {
      onDelete(task.id)
      handleClose()
    }
  }

  if (!isOpen || !task) return null

  const glowColor = PRIORITY_COLORS[task.priority]

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 cursor-none"
        style={{ backgroundColor: 'rgba(10, 10, 20, 0.8)' }}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-md cursor-none p-6"
        style={{
          backgroundColor: 'rgba(248, 249, 250, 0.95)',
          border: `2px solid ${glowColor}`,
          boxShadow: `0 0 30px ${glowColor}44, 0 25px 50px rgba(0,0,0,0.25)`,
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b pb-3" style={{ borderColor: `${glowColor}33` }}>
          <GlitchText className="font-mono text-xs font-bold uppercase tracking-widest" style={{ color: '#1a1a2e' }}>
            TASK_DETAILS
          </GlitchText>
          <button
            onClick={handleClose}
            className="font-mono text-lg transition-colors hover:text-[#ff2d95]"
            style={{ color: '#4a4a6a' }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest" style={{ color: '#4a4a6a' }}>
              Title
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedTask.title || ''}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                className="w-full border bg-white px-3 py-2 font-mono text-sm focus:outline-none"
                style={{ 
                  borderColor: `${glowColor}44`,
                  color: '#1a1a2e',
                }}
              />
            ) : (
              <p className="font-mono text-sm font-medium" style={{ color: '#1a1a2e' }}>{task.title}</p>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest" style={{ color: '#4a4a6a' }}>
              Priority
            </label>
            {isEditing ? (
              <select
                value={editedTask.priority || task.priority}
                onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value as Priority })}
                className="w-full border bg-white px-3 py-2 font-mono text-xs uppercase focus:outline-none"
                style={{ borderColor: `${glowColor}44`, color: '#1a1a2e' }}
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            ) : (
              <span
                className="inline-block rounded-sm px-2 py-1 font-mono text-[10px] uppercase tracking-widest"
                style={{
                  backgroundColor: `${glowColor}18`,
                  color: glowColor,
                  border: `1px solid ${glowColor}33`,
                }}
              >
                {task.priority}
              </span>
            )}
          </div>

          {/* Due Date */}
          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest" style={{ color: '#4a4a6a' }}>
              Due Date
            </label>
            {isEditing ? (
              <input
                type="date"
                value={editedTask.dueDate || task.dueDate}
                onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                className="w-full border bg-white px-3 py-2 font-mono text-sm focus:outline-none"
                style={{ borderColor: `${glowColor}44`, color: '#1a1a2e' }}
              />
            ) : (
              <p className="font-mono text-sm" style={{ color: '#1a1a2e' }}>{task.dueDate}</p>
            )}
          </div>

          {/* Progress */}
          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest" style={{ color: '#4a4a6a' }}>
              Progress: {editedTask.progress ?? task.progress}%
            </label>
            {isEditing ? (
              <input
                type="range"
                min="0"
                max="100"
                value={editedTask.progress ?? task.progress}
                onChange={(e) => setEditedTask({ ...editedTask, progress: parseInt(e.target.value) })}
                className="w-full"
                style={{ accentColor: glowColor }}
              />
            ) : (
              <div className="h-2 w-full overflow-hidden" style={{ backgroundColor: 'rgba(157,78,221,0.1)' }}>
                <div
                  className="h-full"
                  style={{
                    width: `${task.progress}%`,
                    backgroundColor: glowColor,
                    boxShadow: `0 0 8px ${glowColor}88`,
                  }}
                />
              </div>
            )}
          </div>

          {/* Column */}
          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest" style={{ color: '#4a4a6a' }}>
              Column
            </label>
            <p className="font-mono text-sm uppercase" style={{ color: '#1a1a2e' }}>
              {COLUMNS.find(c => c.id === task.columnId)?.title || task.columnId}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-between border-t pt-4" style={{ borderColor: `${glowColor}33` }}>
          {showDeleteConfirm ? (
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase text-[#ff2d95]">Confirm delete?</span>
              <button
                onClick={handleDelete}
                className="px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white transition-all hover:scale-105"
                style={{ backgroundColor: '#ff2d95' }}
              >
                Yes
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-all hover:scale-105"
                style={{ backgroundColor: '#4a4a6a', color: 'white' }}
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="font-mono text-[10px] uppercase tracking-wider transition-colors hover:text-[#ff2d95]"
              style={{ color: '#4a4a6a' }}
            >
              [DELETE]
            </button>
          )}

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 font-mono text-[10px] uppercase tracking-wider transition-all hover:scale-105"
                  style={{ backgroundColor: '#4a4a6a', color: 'white' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-white transition-all hover:scale-105"
                  style={{ backgroundColor: glowColor, boxShadow: `0 0 15px ${glowColor}44` }}
                >
                  Save
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-white transition-all hover:scale-105"
                style={{ backgroundColor: glowColor, boxShadow: `0 0 15px ${glowColor}44` }}
              >
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 h-3 w-3 border-t-2 border-l-2" style={{ borderColor: glowColor }} />
        <div className="absolute top-0 right-0 h-3 w-3 border-t-2 border-r-2" style={{ borderColor: glowColor }} />
        <div className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2" style={{ borderColor: glowColor }} />
        <div className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2" style={{ borderColor: glowColor }} />
      </div>
    </div>
  )
}
