export function LucidGrid() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          backgroundImage:
            'radial-gradient(rgba(138, 43, 226, 0.04) 1.5px, transparent 1.5px)',
          backgroundSize: '32px 32px',
          willChange: 'transform',
          transform: 'translateZ(0)',
          animation: 'lucid-drift 60s linear infinite',
        }}
      />
    </div>
  )
}
