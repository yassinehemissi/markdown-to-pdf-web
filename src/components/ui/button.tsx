import { cn } from '@/lib/utils'
import { buttonVariants } from './button.variants'
import type { ButtonProps } from './ui.types'
export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
