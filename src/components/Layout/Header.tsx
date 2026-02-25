interface HeaderProps {
  readonly onAddTask: () => void
}

export function Header({ onAddTask }: HeaderProps) {
  return (
    <header
      className="glass-card sticky top-0 z-40"
      style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}
    >
      <div className="flex items-center justify-between px-10 py-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{
              background: 'linear-gradient(135deg, var(--color-neon-purple), var(--color-neon-blue))',
            }}
          >
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h1
              className="text-lg font-semibold"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-text-main)',
              }}
            >
              TASK_BOARD
            </h1>
            <p className="mono-data" style={{ color: 'var(--color-text-muted)' }}>
              v2.077 // system online
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden sm:block">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search tasks..."
              className="glass-card w-64 py-2 pl-10 pr-4 text-sm outline-none"
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-text-main)',
              }}
            />
          </div>

          {/* Add button */}
          <button
            onClick={onAddTask}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, var(--color-neon-purple), var(--color-neon-blue))',
            }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </button>

          {/* User avatar */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium text-white"
            style={{
              background: 'linear-gradient(135deg, var(--color-neon-purple), var(--color-neon-blue))',
            }}
          >
            P
          </button>
        </div>
      </div>
    </header>
  )
}
