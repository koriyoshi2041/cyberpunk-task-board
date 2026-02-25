import { useGlitch } from '../../hooks/useGlitch'

type GlitchTag = 'span' | 'h1' | 'h2' | 'h3' | 'p' | 'div'

interface GlitchTextProps {
  readonly children: React.ReactNode
  readonly className?: string
  readonly autoPlay?: boolean
  readonly as?: GlitchTag
}

export function GlitchText({
  children,
  className = '',
  autoPlay = true,
  as: Tag = 'span',
}: GlitchTextProps) {
  const { ref, triggerGlitch } = useGlitch(autoPlay)

  return (
    <Tag
      ref={ref as React.RefObject<never>}
      className={`inline-block ${className}`}
      onMouseEnter={triggerGlitch}
    >
      {children}
    </Tag>
  )
}
