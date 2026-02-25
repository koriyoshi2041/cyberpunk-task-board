import { useState, useCallback } from 'react'
import { Header } from './components/Layout/Header'
import { Board } from './components/Board/Board'
import { TaskModal } from './components/UI/TaskModal'
import { LucidCanvas } from './components/effects/Scene/LucidCanvas'
import { ScanlineOverlay } from './components/effects/ScanlineOverlay'
import { Crosshair } from './components/effects/Crosshair'
import { useTaskStore } from './store/useTaskStore'
import type { Task } from './types/task'

export default function App() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

  const addTask = useTaskStore((s) => s.addTask)
  const updateTask = useTaskStore((s) => s.updateTask)
  const deleteTask = useTaskStore((s) => s.deleteTask)

  const handleAddTask = useCallback(() => {
    setShowAddModal(true)
  }, [])

  const handleModalSubmit = useCallback(() => {
    const trimmed = modalTitle.trim()
    if (trimmed) {
      addTask(trimmed, 'backlog', 'medium')
    }
    setModalTitle('')
    setShowAddModal(false)
  }, [modalTitle, addTask])

  const handleModalKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleModalSubmit()
      if (e.key === 'Escape') {
        setModalTitle('')
        setShowAddModal(false)
      }
    },
    [handleModalSubmit]
  )

  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTask(task)
    setIsTaskModalOpen(true)
  }, [])

  const handleTaskModalClose = useCallback(() => {
    setIsTaskModalOpen(false)
    setSelectedTask(null)
  }, [])

  const handleTaskUpdate = useCallback((taskId: string, updates: Partial<Task>) => {
    updateTask(taskId, updates)
  }, [updateTask])

  const handleTaskDelete = useCallback((taskId: string) => {
    deleteTask(taskId)
  }, [deleteTask])

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-base)' }}
    >
      {/* Background effects */}
      <LucidCanvas />
      <ScanlineOverlay />

      {/* Decorative crosshairs */}
      <Crosshair top="15%" left="5%" />
      <Crosshair top="70%" left="92%" size={18} />
      <Crosshair top="40%" left="50%" size={20} />

      {/* Content */}
      <div className="relative" style={{ zIndex: 1 }}>
        <Header onAddTask={handleAddTask} />

        <main className="pt-6">
          <Board onTaskClick={handleTaskClick} />
        </main>
      </div>

      <TaskModal
        task={selectedTask}
        isOpen={isTaskModalOpen}
        onClose={handleTaskModalClose}
        onUpdate={handleTaskUpdate}
        onDelete={handleTaskDelete}
      />

      {/* Quick Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
            onClick={() => setShowAddModal(false)}
          />
          <div className="glass-card relative w-full max-w-md p-6" style={{ boxShadow: 'var(--hover-glow)' }}>
            <h2
              className="mb-4 text-lg font-semibold"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-text-main)',
              }}
            >
              Create New Task
            </h2>
            <input
              className="glass-card w-full px-4 py-3 outline-none"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-text-main)',
              }}
              placeholder="What needs to be done?"
              value={modalTitle}
              onChange={(e) => setModalTitle(e.target.value)}
              onKeyDown={handleModalKeyDown}
              autoFocus
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                className="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                style={{ color: 'var(--color-text-muted)' }}
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, var(--color-neon-purple), var(--color-neon-blue))',
                }}
                onClick={handleModalSubmit}
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
