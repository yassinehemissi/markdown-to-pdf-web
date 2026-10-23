import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { DialogContent } from '@/components/ui/dialog-content'
import { DialogTitle } from '@/components/ui/dialog-title'
import { DialogDescription } from '@/components/ui/dialog-description'
import { useWorkspace } from '../(hooks)/use-workspace'

export function DeleteNoteDialog() {
  const { deleting, closeDelete, confirmDelete } = useWorkspace()
  return (
    <Dialog
      open={!!deleting}
      onOpenChange={(open) => {
        if (!open) closeDelete()
      }}
    >
      <DialogContent>
        <DialogTitle className="dialog-title">Delete this note?</DialogTitle>
        <DialogDescription className="dialog-description">
          “{deleting?.title || 'Untitled note'}” will be permanently removed
          from this browser.
        </DialogDescription>
        <div className="modal-actions">
          <Button variant="ghost" onClick={closeDelete}>
            Keep note
          </Button>
          <Button variant="destructive" onClick={confirmDelete}>
            Delete note
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
