import { create } from 'zustand'
import type { Task, ColumnId, Priority } from '../types/task'

interface TaskState {
  readonly tasks: readonly Task[]
  addTask: (title: string, columnId: ColumnId, priority: Priority) => void
  moveTask: (taskId: string, targetColumn: ColumnId) => void
  deleteTask: (taskId: string) => void
  updateProgress: (taskId: string, progress: number) => void
}

const INITIAL_TASKS: readonly Task[] = [
  {
    id: 'task-1',
    title: 'Initialize neural interface protocol',
    priority: 'critical',
    dueDate: '2026-03-01',
    assignee: 'AX',
    progress: 45,
    columnId: 'backlog',
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'task-2',
    title: 'Debug quantum encryption module',
    priority: 'high',
    dueDate: '2026-03-05',
    assignee: 'KZ',
    progress: 72,
    columnId: 'in_progress',
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'task-3',
    title: 'Deploy holographic UI layer',
    priority: 'medium',
    dueDate: '2026-03-10',
    assignee: 'NV',
    progress: 20,
    columnId: 'backlog',
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'task-4',
    title: 'Calibrate synaptic feedback loop',
    priority: 'low',
    dueDate: '2026-03-15',
    assignee: 'RY',
    progress: 88,
    columnId: 'review',
    createdAt: Date.now() - 86400000 * 1,
  },
  {
    id: 'task-5',
    title: 'Patch memory leak in cortex driver',
    priority: 'critical',
    dueDate: '2026-02-28',
    assignee: 'QT',
    progress: 100,
    columnId: 'done',
    createdAt: Date.now() - 86400000 * 7,
  },
  {
    id: 'task-6',
    title: 'Optimize datastream compression',
    priority: 'high',
    dueDate: '2026-03-08',
    assignee: 'AX',
    progress: 55,
    columnId: 'in_progress',
    createdAt: Date.now() - 86400000 * 4,
  },
  {
    id: 'task-7',
    title: 'Integrate biometric auth scanner',
    priority: 'medium',
    dueDate: '2026-03-12',
    assignee: 'KZ',
    progress: 10,
    columnId: 'backlog',
    createdAt: Date.now() - 86400000 * 1,
  },
  {
    id: 'task-8',
    title: 'Refactor nanobot control API',
    priority: 'high',
    dueDate: '2026-03-03',
    assignee: 'NV',
    progress: 100,
    columnId: 'done',
    createdAt: Date.now() - 86400000 * 6,
  },
]

let nextId = 9

export const useTaskStore = create<TaskState>((set) => ({
  tasks: INITIAL_TASKS,

  addTask: (title, columnId, priority) => {
    const newTask: Task = {
      id: `task-${nextId++}`,
      title,
      priority,
      dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      assignee: ['AX', 'KZ', 'NV', 'RY', 'QT'][Math.floor(Math.random() * 5)],
      progress: 0,
      columnId,
      createdAt: Date.now(),
    }
    set((state) => ({ tasks: [...state.tasks, newTask] }))
  },

  moveTask: (taskId, targetColumn) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? { ...t, columnId: targetColumn, progress: targetColumn === 'done' ? 100 : t.progress }
          : t
      ),
    }))
  },

  deleteTask: (taskId) => {
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== taskId),
    }))
  },

  updateProgress: (taskId, progress) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, progress: Math.min(100, Math.max(0, progress)) } : t
      ),
    }))
  },
}))
