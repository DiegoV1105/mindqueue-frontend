import { cn } from '@/lib/utils'

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
}

export default function Avatar({ src, name, size = 'md', className }) {
  const initial = name?.charAt(0).toUpperCase() || '?'

  return (
    <div
      className={cn(
        'rounded-full bg-primary-100 text-primary-600 font-semibold flex items-center justify-center overflow-hidden',
        sizes[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        initial
      )}
    </div>
  )
}