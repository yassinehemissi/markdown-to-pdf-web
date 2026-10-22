import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWorkspace } from '../(hooks)/use-workspace'
import type { EmptyStateProps } from '../workspace.types'
export function EmptyState({ missing = false }: EmptyStateProps) {
  const { askCreate } = useWorkspace()
  return <div className="empty-state"><h1>{missing ? 'Note not found' : 'No notes yet'}</h1><p>{missing ? 'Open your notes or create a new one.' : 'Create a note to start writing.'}</p><Button onClick={askCreate}><Plus />New note</Button></div>
}
