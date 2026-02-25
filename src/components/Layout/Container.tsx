interface ContainerProps {
  readonly children: React.ReactNode
}

export function Container({ children }: ContainerProps) {
  return (
    <div className="relative min-h-screen cursor-none" style={{ backgroundColor: '#f8f9fa' }}>
      {children}
    </div>
  )
}
