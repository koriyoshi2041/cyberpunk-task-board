import type { Priority } from '../../types/task'

interface StatusTagProps {
  readonly priority: Priority
}

const PRIORITY_STYLES: Record<Priority, { color: string; label: string }> = {
  critical: { color: '#FF3366', label: 'CRITICAL' },
  high: { color: '#8A2BE2', label: 'HIGH' },
  medium: { color: '#4169E1', label: 'MEDIUM' },
  low: { color: '#00E676', label: 'LOW' },
}

export function StatusTag({ priority }: StatusTagProps) {
  const style = PRIORITY_STYLES[priority]

  return (
    <span
      className="status-tag mono-data inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium uppercase tracking-wider"
      data-text={style.label}
      style={{
        color: style.color,
        backgroundColor: `${style.color}10`,
      }}
    >
      {/* Indicator dot */}
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{
          backgroundColor: style.color,
          boxShadow: `0 0 6px ${style.color}60`,
        }}
      />
      {style.label}
    </span>
  )
}
