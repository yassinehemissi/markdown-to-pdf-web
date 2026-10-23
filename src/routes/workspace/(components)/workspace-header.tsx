import { Link } from '@tanstack/react-router'
import { Menu, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { links } from '@/constants/links'
import { cn } from '@/lib/utils'
import { viewModes, workspaceMedia } from '../workspace.constants'
import { useWorkspace } from '../(hooks)/use-workspace'

export function WorkspaceHeader() {
  const { sidebar, toggleSidebar, mode, setMode, askCreate } = useWorkspace()
  return (
    <header className="app-header">
      <div className="app-identity">
        <Button
          variant="ghost"
          size="icon"
          aria-label={sidebar ? 'Close notes' : 'Open notes'}
          aria-expanded={sidebar}
          onClick={toggleSidebar}
        >
          <Menu />
        </Button>
        <Link to={links.workspace.home} className="wordmark">
          <span className="brand-logo">
            <img src={workspaceMedia.logo} alt="" width={500} height={500} />
          </span>
          <span>M2PDF</span>
        </Link>
      </div>
      <div className="view-switch" role="group" aria-label="Editor view">
        {viewModes.map(({ id, label }) => (
          <Button
            variant="ghost"
            key={id}
            aria-pressed={mode === id}
            className={cn(mode === id && 'active')}
            onClick={() => setMode(id)}
          >
            {label}
          </Button>
        ))}
      </div>
      <Button
        variant="ghost"
        className="header-new"
        aria-label="New note"
        onClick={askCreate}
      >
        <Plus size={15} />
        <span>New note</span>
      </Button>
    </header>
  )
}
