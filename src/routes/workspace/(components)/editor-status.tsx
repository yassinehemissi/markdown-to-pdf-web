import { cn } from '@/lib/utils'
import { useWorkspace } from '../(hooks)/use-workspace'
import type { StatusBarProps } from '../workspace.types'
export function EditorStatus({ content }: StatusBarProps) {
  const { error } = useWorkspace()
  const words = content.trim() ? content.trim().split(/\s+/).length : 0
  return (
    <footer className="status-bar">
      <span className={cn('save-status', error && 'save-error')}>
        <span className="status-dot" />
        {error ? 'Changes not saved' : 'Saved locally'}
      </span>
      <span>
        {words} {words === 1 ? 'word' : 'words'}
        <span className="status-divider">/</span>
        {content.length.toLocaleString()} characters
      </span>
    </footer>
  )
}
