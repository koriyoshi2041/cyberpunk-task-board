interface HeaderProps {
  readonly onAddTask: () => void
}

export function Header({ onAddTask }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Task Board</h1>
            <p className="text-sm text-gray-500">Manage your projects</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden sm:block">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-64 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>

          {/* Add button */}
          <button
            onClick={onAddTask}
            className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-violet-700 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </button>

          {/* User avatar */}
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-pink-500 text-sm font-medium text-white">
            P
          </button>
        </div>
      </div>
    </header>
  )
}
