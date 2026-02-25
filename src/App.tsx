import { useState, useCallback } from 'react'
import { useMouse } from './hooks/useMouse'
import { useLenis } from './hooks/useLenis'
import { Container } from './components/Layout/Container'
import { Header } from './components/Layout/Header'
import { Board } from './components/Board/Board'
import { CustomCursor } from './components/UI/CustomCursor'
import { SystemStats } from './components/UI/SystemStats'
import { ScanLines } from './components/Effects/ScanLines'
import { GridBackground } from './components/Effects/GridBackground'
import { GlitchText } from './components/UI/GlitchText'
import { TaskModal } from './components/UI/TaskModal'
import { useTaskStore } from './store/useTaskStore'
import type { Task } from './types/task'

export default function App() {
  const { cursorRef, cursorOuterRef, setCursorState, resetCursor } = useMouse()
  const [showAddModal, setShowAddModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const addTask = useTaskStore((s) => s.addTask)
  const updateTask = useTaskStore((s) => s.updateTask)
  const deleteTask = useTaskStore((s) => s.deleteTask)

  useLenis()

  const handleMouseEnterCard = useCallback(() => {
    setCursorState('DRAG', 1.6)
  }, [setCursorState])

  const handleMouseLeaveCard = useCallback(() => {
    resetCursor()
  }, [resetCursor])

  const handleMouseEnterButton = useCallback(() => {
    setCursorState('CLICK', 1.4)
  }, [setCursorState])

  const handleMouseLeaveButton = useCallback(() => {
    resetCursor()
  }, [resetCursor])

  const handleAddTask = useCallback(() => {
    setShowAddModal(true)
  }, [])

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

  return (
    <Container>
      <GridBackground />
      <ScanLines />
      <CustomCursor cursorRef={cursorRef} cursorOuterRef={cursorOuterRef} />

      <Header
        onAddTask={handleAddTask}
        onMouseEnterButton={handleMouseEnterButton}
        onMouseLeaveButton={handleMouseLeaveButton}
      />

      <Board
        onMouseEnterCard={handleMouseEnterCard}
        onMouseLeaveCard={handleMouseLeaveCard}
        onTaskClick={handleTaskClick}
      />

      <TaskModal
        task={selectedTask}
        isOpen={isTaskModalOpen}
        onClose={handleTaskModalClose}
        onUpdate={handleTaskUpdate}
        onDelete={handleTaskDelete}
      />

      <div className="fixed bottom-4 left-4 z-50">
        <div
          className="border p-3"
          style={{
            borderColor: 'rgba(157,78,221,0.2)',
            backgroundColor: 'rgba(248,249,250,0.9)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div className="mb-1.5 font-mono text-[8px] tracking-widest" style={{ color: '#9d4edd' }}>
            ╔══ SYS_MONITOR ══╗
          </div>
          <SystemStats />
          <div className="mt-1.5 font-mono text-[8px] tracking-widest" style={{ color: '#9d4edd' }}>
            ╚═════════════════╝
          </div>
        </div>
      </div>

      <div className="fixed right-4 bottom-4 z-50">
        <div
          className="border p-2 font-mono text-[8px] tracking-widest"
          style={{
            borderColor: 'rgba(0,255,240,0.2)',
            backgroundColor: 'rgba(248,249,250,0.9)',
            color: '#4a4a6a',
            backdropFilter: 'blur(8px)',
          }}
        >
          <GlitchText autoPlay>
            <span style={{ color: '#00fff0' }}>NODE</span>://CYBER_BOARD
          </GlitchText>
          <div className="cyber-flicker mt-1" style={{ color: '#ff2d95' }}>
            ████░░░░ 47%
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[9000] flex items-center justify-center">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(26,26,46,0.3)', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowAddModal(false)}
          />
          <div
            className="relative z-10 w-96 border p-6"
            style={{
              backgroundColor: 'rgba(248,249,250,0.95)',
              borderColor: '#ff2d95',
              boxShadow: '0 0 30px rgba(255,45,149,0.2)',
            }}
          >
            <div className="mb-4 font-mono text-xs tracking-widest" style={{ color: '#ff2d95' }}>
              ╔══ NEW_TASK_INPUT ══╗
            </div>
            <input
              className="w-full border bg-transparent px-3 py-2 font-mono text-sm tracking-wider outline-none"
              style={{
                borderColor: 'rgba(157,78,221,0.3)',
                color: '#1a1a2e',
              }}
              placeholder="ENTER_TASK_DESCRIPTION..."
              value={modalTitle}
              onChange={(e) => setModalTitle(e.target.value)}
              onKeyDown={handleModalKeyDown}
              autoFocus
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="border px-3 py-1 font-mono text-[10px] tracking-wider"
                style={{ borderColor: 'rgba(157,78,221,0.3)', color: '#4a4a6a' }}
                onClick={() => setShowAddModal(false)}
              >
                [ESC] CANCEL
              </button>
              <button
                className="border px-3 py-1 font-mono text-[10px] tracking-wider"
                style={{
                  borderColor: '#ff2d95',
                  color: '#ff2d95',
                  boxShadow: '0 0 8px rgba(255,45,149,0.3)',
                }}
                onClick={handleModalSubmit}
              >
                [ENTER] CONFIRM
              </button>
            </div>
            <div className="mt-3 font-mono text-xs tracking-widest" style={{ color: '#ff2d95' }}>
              ╚════════════════════╝
            </div>
          </div>
        </div>
      )}
    </Container>
  )
}
