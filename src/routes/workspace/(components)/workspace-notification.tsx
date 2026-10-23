import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWorkspace } from '../(hooks)/use-workspace'
export function WorkspaceNotification() {
  const { toast, clearToast } = useWorkspace()
  return toast ? (
    <div className="toast" role="status">
      <Check size={15} />
      <span>{toast}</span>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Dismiss notification"
        onClick={clearToast}
      >
        <X size={14} />
      </Button>
    </div>
  ) : null
}
