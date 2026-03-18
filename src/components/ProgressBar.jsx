/**
 * @param {{ rate: number, className?: string }} props
 */
export default function ProgressBar({ rate, className = '' }) {
  const clamped = Math.min(Math.max(rate, 0), 100)
  const color = clamped >= 90 ? 'bg-rose-400' : clamped >= 70 ? 'bg-yellow-400' : 'bg-emerald-400'

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div
        className={`h-2 rounded-full transition-all duration-300 ${color}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
