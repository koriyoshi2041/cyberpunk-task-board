export function ScanlineOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 9999 }}
    >
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '4px',
          background:
            'linear-gradient(to bottom, transparent, rgba(138, 43, 226, 0.03), transparent)',
          willChange: 'transform',
          transform: 'translateZ(0)',
          animation: 'scan-move 6s linear infinite',
        }}
      />
    </div>
  )
}
