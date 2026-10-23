import { cn } from '@/lib/utils'
import { forwardRef } from 'preact/compat'
import type { InputProps } from './ui.types'
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      data-slot="input"
      className={cn(
        'flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-sm outline-none transition-colors placeholder:text-foreground/50 disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
})
