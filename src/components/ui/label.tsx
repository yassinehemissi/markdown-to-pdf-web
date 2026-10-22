import { cn } from '@/lib/utils'
import type { LabelProps } from './ui.types'
export function Label({ className, ...props }: LabelProps) {
  return <label data-slot="label" className={cn('flex items-center gap-2 text-sm leading-none font-medium', className)} {...props} />
}
