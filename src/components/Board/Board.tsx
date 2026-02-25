import { useRef, useCallback } from 'react'
import { useTaskStore } from '../../store/useTaskStore'
import { COLUMNS } from '../../types/task'
import type { Task, ColumnId, Priority } from '../../types/task'
import { Column } from './Column'

interface BoardProps {
  readonly onTaskClick: (task: Task) => void
}

export function Board({ onTaskClick }: BoardProps) {
  const { tasks, moveTask, deleteTask, addTask } = useTaskStore()
  const draggedTaskRef = useRef<string | null>(null)

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
    (taskId: string, _rect: DOMRect) => {
      deleteTask(taskId)
    },
    [deleteTask]
  )

  const handleAddTask = useCallback(
    (columnId: ColumnId, title: string, priority: Priority) => {
      addTask(title, columnId, priority)
    },
    [addTask]
  )

  return (
    <div className="flex gap-6 overflow-x-auto px-6 pb-6">
      {COLUMNS.map((column) => (
        <Column
          key={column.id}
          column={column}
          tasks={tasks.filter((t) => t.columnId === column.id)}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onComplete={handleComplete}
          onAddTask={handleAddTask}
          onTaskClick={onTaskClick}
        />
      ))}
    </div>
  )
}
