import { useState, useEffect, useRef } from 'react'

interface StatLine {
  readonly label: string
  readonly unit: string
  readonly min: number
  readonly max: number
  readonly decimals: number
}

const STATS: readonly StatLine[] = [
  { label: 'SYS_LOAD', unit: '%', min: 20, max: 85, decimals: 1 },
  { label: 'MEM_USAGE', unit: 'GB', min: 1.2, max: 7.8, decimals: 1 },
  { label: 'NET_IN', unit: 'kb/s', min: 50, max: 400, decimals: 0 },
  { label: 'THREADS', unit: '', min: 12, max: 64, decimals: 0 },
  { label: 'TEMP', unit: '°C', min: 35, max: 72, decimals: 1 },
]

function generateValue(stat: StatLine): string {
  const val = stat.min + Math.random() * (stat.max - stat.min)
  return val.toFixed(stat.decimals)
}

export function SystemStats() {
  const [values, setValues] = useState<readonly string[]>(() =>
    STATS.map(generateValue)
  )
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const updateIndex = Math.floor(Math.random() * STATS.length)
      setValues((prev) =>
        prev.map((v, i) => (i === updateIndex ? generateValue(STATS[i]) : v))
      )
    }, 800)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div className="font-mono text-[10px] leading-relaxed tracking-wider opacity-60" style={{ color: '#374151' }}>
      {STATS.map((stat, i) => (
        <div key={stat.label} className="flex justify-between gap-3">
          <span style={{ color: '#7c3aed' }}>{stat.label}:</span>
          <span
            className="tabular-nums transition-all duration-150"
            style={{ color: i === 0 && parseFloat(values[i]) > 70 ? '#ff2d95' : '#374151' }}
          >
            {values[i]}{stat.unit}
          </span>
        </div>
      ))}
      <div className="mt-1 border-t pt-1" style={{ borderColor: 'rgba(157,78,221,0.2)' }}>
        <span style={{ color: '#00fff0' }}>STATUS:</span>{' '}
        <span className="animate-pulse" style={{ color: '#ffe66d' }}>ONLINE</span>
      </div>
    </div>
  )
}
