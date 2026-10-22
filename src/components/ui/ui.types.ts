import type { ComponentProps } from 'preact'
import type { VariantProps } from 'class-variance-authority'
import type * as DialogPrimitive from '@radix-ui/react-dialog'
import type { buttonVariants } from './button.variants'
export type ButtonProps = ComponentProps<'button'> & VariantProps<typeof buttonVariants>
export type InputProps = ComponentProps<'input'>
export type TextareaProps = ComponentProps<'textarea'>
export type LabelProps = ComponentProps<'label'>
export type DialogContentProps = ComponentProps<typeof DialogPrimitive.Content>
