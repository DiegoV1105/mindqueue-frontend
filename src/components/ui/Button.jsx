import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const variants = {
  primary:         'bg-primary-500 text-white hover:bg-primary-600 active:scale-[0.97] shadow-sm hover:shadow-card',
  secondary:       'bg-transparent border-2 border-primary-400 text-primary-600 hover:bg-primary-50 active:scale-[0.97]',
  ghost:           'bg-transparent text-gray-600 hover:bg-gray-100 active:bg-gray-200',
  'ghost-primary': 'bg-transparent text-primary-600 hover:bg-primary-50 active:bg-primary-100',
  white:           'bg-white text-primary-600 hover:bg-primary-50 active:scale-[0.97] shadow-sm',
  danger:          'bg-urgent-light text-urgent border border-urgent/30 hover:bg-urgent/10 active:scale-[0.97]',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-xl',
  md: 'px-5 py-2.5 text-sm rounded-[14px]',
  lg: 'px-6 py-3.5 text-sm rounded-[16px]',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  ...props
}) {
  return (
    <button
      disabled={loading || props.disabled}
      className={cn(
        'font-medium transition-all duration-150 flex items-center justify-center gap-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  )
}
