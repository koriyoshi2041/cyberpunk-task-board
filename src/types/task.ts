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
  { id: 'backlog', title: 'BACKLOG', label: 'BCK_LOG' },
  { id: 'in_progress', title: 'IN_PROG', label: 'IN_PROGRESS' },
  { id: 'review', title: 'REVIEW', label: 'CODE_REV' },
  { id: 'done', title: 'DONE', label: 'COMPLETE' },
] as const

export const PRIORITY_COLORS: Record<Priority, string> = {
  critical: '#ff2d95',
  high: '#9d4edd',
  medium: '#00fff0',
  low: '#ffe66d',
}

export const ASSIGNEES = ['AX', 'KZ', 'NV', 'RY', 'QT'] as const
