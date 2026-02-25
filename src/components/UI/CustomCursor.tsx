interface CustomCursorProps {
  readonly cursorRef: React.RefObject<HTMLDivElement | null>
  readonly cursorOuterRef: React.RefObject<HTMLDivElement | null>
}

export function CustomCursor({ cursorRef, cursorOuterRef }: CustomCursorProps) {
  return (
    <>
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-[10000] -translate-x-1/2 -translate-y-1/2"
      >
        <div
          className="h-2 w-2 rounded-full"
          style={{
            backgroundColor: '#ff2d95',
            boxShadow: '0 0 8px rgba(255, 45, 149, 0.6)',
          }}
        />
      </div>
      <div
        ref={cursorOuterRef}
        className="pointer-events-none fixed top-0 left-0 z-[10000] -translate-x-1/2 -translate-y-1/2"
      >
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full border"
          style={{
            borderColor: 'rgba(0, 255, 240, 0.5)',
            boxShadow: '0 0 12px rgba(0, 255, 240, 0.2)',
          }}
        >
          <span
            className="cursor-label font-mono text-[8px] uppercase tracking-wider opacity-0 transition-opacity"
            style={{ color: '#00fff0' }}
          />
        </div>
      </div>
    </>
  )
}
