import { WorkspaceContext } from '../(states)/workspace.context'
import { useWorkspaceState } from '../(states)/workspace.state'
import type { WorkspaceProviderProps } from '../workspace.types'
export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const state = useWorkspaceState()
  return (
    <WorkspaceContext.Provider value={state}>
      {children}
    </WorkspaceContext.Provider>
  )
}
