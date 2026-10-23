import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog } from '@/components/ui/dialog'
import { DialogContent } from '@/components/ui/dialog-content'
import { DialogTitle } from '@/components/ui/dialog-title'
import { DialogDescription } from '@/components/ui/dialog-description'
import { useWorkspace } from '../(hooks)/use-workspace'

export function CreateNoteDialog() {
  const { createOpen, closeCreate, name, setName, create } = useWorkspace()
  return (
    <Dialog
      open={createOpen}
      onOpenChange={(open) => {
        if (!open) closeCreate()
      }}
    >
      <DialogContent className="name-dialog">
        <DialogTitle className="dialog-title">New note</DialogTitle>
        <DialogDescription className="dialog-description">
          Choose a name for this note.
        </DialogDescription>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            create()
          }}
        >
          <Label className="input-label" htmlFor="note-name">
            Note name
          </Label>
          <Input
            id="note-name"
            className="name-input"
            placeholder="Note name"
            value={name}
            maxLength={120}
            onInput={(event) => setName(event.currentTarget.value)}
            autoComplete="off"
          />
          <div className="modal-actions">
            <Button variant="ghost" type="button" onClick={closeCreate}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              <Plus />
              Create note
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
