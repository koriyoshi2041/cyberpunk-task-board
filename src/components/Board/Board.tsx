import { useRef, useState, useCallback } from 'react'
import { useTaskStore } from '../../store/useTaskStore'
import { COLUMNS } from '../../types/task'
import type { ColumnId, Priority } from '../../types/task'
import { Column } from './Column'
import { ParticleExplosion } from '../Effects/ParticleExplosion'

interface BoardProps {
  readonly onMouseEnterCard: () => void
  readonly onMouseLeaveCard: () => void
}

interface Explosion {
  readonly id: string
  readonly x: number
  readonly y: number
  readonly color: string
}

export function Board({ onMouseEnterCard, onMouseLeaveCard }: BoardProps) {
  const { tasks, moveTask, deleteTask, addTask } = useTaskStore()
  const draggedTaskRef = useRef<string | null>(null)
  const [explosions, setExplosions] = useState<readonly Explosion[]>([])

  const handleDragStart = useCallback((_e: React.DragEvent, taskId: string) => {
    draggedTaskRef.current = taskId
  }, [])

  const handleDrop = useCallback(
    (columnId: ColumnId) => {
      const taskId = draggedTaskRef.current
      if (taskId) {
        moveTask(taskId, columnId)
        draggedTaskRef.current = null
      }
    },
    [moveTask]
  )

  const handleComplete = useCallback(
    (taskId: string, rect: DOMRect) => {
      const explosion: Explosion = {
        id: `explosion-${Date.now()}`,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        color: '#ff2d95',
      }
      setExplosions((prev) => [...prev, explosion])
      deleteTask(taskId)
    },
    [deleteTask]
  )

  const handleRemoveExplosion = useCallback((id: string) => {
    setExplosions((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const handleAddTask = useCallback(
    (columnId: ColumnId, title: string, priority: Priority) => {
      addTask(title, columnId, priority)
    },
    [addTask]
  )

  return (
    <>
      <div className="flex gap-4 overflow-x-auto p-6">
        {COLUMNS.map((column) => (
          <Column
            key={column.id}
            column={column}
            tasks={tasks.filter((t) => t.columnId === column.id)}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onComplete={handleComplete}
            onAddTask={handleAddTask}
            onMouseEnterCard={onMouseEnterCard}
            onMouseLeaveCard={onMouseLeaveCard}
          />
        ))}
      </div>

      {explosions.map((exp) => (
        <ParticleExplosion
          key={exp.id}
          x={exp.x}
          y={exp.y}
          color={exp.color}
          onComplete={() => handleRemoveExplosion(exp.id)}
        />
      ))}
    </>
  )
}
