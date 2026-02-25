export type Priority = 'critical' | 'high' | 'medium' | 'low'
export type ColumnId = 'backlog' | 'in_progress' | 'review' | 'done'

export interface Task {
  readonly id: string
  readonly title: string
  readonly priority: Priority
  readonly dueDate: string
  readonly assignee: string
  readonly progress: number
  readonly columnId: ColumnId
  readonly createdAt: number
}

export interface Column {
  readonly id: ColumnId
  readonly title: string
  readonly label: string
}

export const COLUMNS: readonly Column[] = [
  { id: 'backlog', title: 'Backlog', label: 'To Do' },
  { id: 'in_progress', title: 'In Progress', label: 'Doing' },
  { id: 'review', title: 'Review', label: 'Review' },
  { id: 'done', title: 'Done', label: 'Complete' },
] as const

export const PRIORITY_COLORS: Record<Priority, { bg: string; text: string; border: string }> = {
  critical: { bg: '#fdecea', text: '#c4320a', border: '#f9b8ab' },
  high: { bg: '#f3e8ff', text: '#7c3aed', border: '#ddd6fe' },
  medium: { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd' },
  low: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
}

export const COLUMN_COLORS: Record<ColumnId, string> = {
  backlog: '#6b7280',
  in_progress: '#3b82f6',
  review: '#f59e0b',
  done: '#10b981',
}

export const ASSIGNEES = ['Alex', 'Kim', 'Nova', 'Ryan', 'Quinn'] as const
