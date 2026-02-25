interface CrosshairProps {
  readonly top: string
  readonly left: string
  readonly size?: number
}

export function Crosshair({ top, left, size = 24 }: CrosshairProps) {
  return (
    <div
      className="pointer-events-none absolute"
      style={{
        top,
        left,
        width: `${size}px`,
        height: `${size}px`,
        opacity: 0.3,
        willChange: 'opacity',
        animation: 'breath-glow 4s ease-in-out infinite alternate',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            linear-gradient(to right, transparent 48%, #4169E1 48%, #4169E1 52%, transparent 52%),
            linear-gradient(to bottom, transparent 48%, #4169E1 48%, #4169E1 52%, transparent 52%)
          `,
          animation: 'pulse-opacity 4s ease-in-out infinite alternate',
        }}
      />
    </div>
  )
}
