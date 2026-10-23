import { cn } from '@/lib/utils'
import { forwardRef } from 'preact/compat'
import type { TextareaProps } from './ui.types'
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        className={cn(
          'flex min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none disabled:opacity-50',
          className,
        )}
        {...props}
      />
    )
  },
)
