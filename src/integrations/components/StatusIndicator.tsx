type StatusIndicatorProps = {
  count: number
  label: string
  variant?: 'success' | 'info' | 'warning' | 'error'
  className?: string
}

export function StatusIndicator({
  count,
  label,
  variant = 'success',
  className = ""
}: StatusIndicatorProps) {
  if (count === 0) return null

  const variantClasses = {
    success: 'text-green-700 bg-green-50',
    info: 'text-blue-700 bg-blue-50',
    warning: 'text-yellow-700 bg-yellow-50',
    error: 'text-red-700 bg-red-50'
  }

  const iconMap = {
    success: '✓',
    info: 'ℹ',
    warning: '⚠',
    error: '✕'
  }

  return (
    <div className={`text-xs ${variantClasses[variant]} px-2 py-1 rounded-full ${className}`}>
      {iconMap[variant]} {count} {label}
    </div>
  )
}
