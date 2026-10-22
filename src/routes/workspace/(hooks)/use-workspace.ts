import { useContext } from 'preact/hooks'
import { WorkspaceContext } from '../(states)/workspace.context'
export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (!context) throw new Error('Workspace controls must be rendered inside WorkspaceProvider')
  return context
}
