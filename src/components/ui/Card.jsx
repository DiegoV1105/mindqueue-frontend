import { cn } from '@/lib/utils'

export default function Card({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'bg-surface rounded-card shadow-card p-5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}