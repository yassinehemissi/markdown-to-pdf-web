import { createContext } from 'preact'
import type { WorkspaceState } from '../workspace.types'
export const WorkspaceContext = createContext<WorkspaceState | null>(null)
