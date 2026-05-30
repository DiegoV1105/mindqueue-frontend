import { cn } from '@/lib/utils'

const variants = {
  primary:   'bg-primary-100 text-primary-700',
  secondary: 'bg-gray-100 text-gray-600',
  accent:    'bg-accent-light text-accent-dark',
  urgent:    'bg-urgent-light text-urgent',
  success:   'bg-green-100 text-green-700',
}

export default function Badge({ children, variant = 'primary', className, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}