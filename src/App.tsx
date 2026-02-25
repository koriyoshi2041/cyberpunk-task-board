import { useState, useCallback } from 'react'
import { Header } from './components/Layout/Header'
import { Board } from './components/Board/Board'
import { TaskModal } from './components/UI/TaskModal'
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
    <div className="min-h-screen bg-gray-50">
      <Header onAddTask={handleAddTask} />

      <main className="pt-6">
        <Board onTaskClick={handleTaskClick} />
      </main>

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
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Create New Task</h2>
            <input
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              placeholder="What needs to be done?"
              value={modalTitle}
              onChange={(e) => setModalTitle(e.target.value)}
              onKeyDown={handleModalKeyDown}
              autoFocus
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
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
