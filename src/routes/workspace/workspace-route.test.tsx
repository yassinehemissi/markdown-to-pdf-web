import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '@/app'
import { STORAGE_KEY } from '@/constants/storage'
import { exportNotePdf } from './(utils)/pdf'

vi.mock('./(utils)/pdf', () => ({ exportNotePdf: vi.fn().mockResolvedValue(undefined) }))

describe('workspace behavior', () => {
  it('names a note in an accessible dialog, previews edits, saves, and exports through the PDF boundary', async () => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByRole('textbox', { name: 'Note title' })
    await user.click(screen.getByRole('button', { name: 'New note' }))
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByRole('button', { name: 'Create note' })).toBeDisabled()
    await user.type(within(dialog).getByRole('textbox', { name: 'Note name' }), 'Project notes')
    await user.click(within(dialog).getByRole('button', { name: 'Create note' }))
    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Note title' })).toHaveValue('Project notes'))
    await user.type(screen.getByRole('textbox', { name: 'Markdown content' }), '# The plan\n\nA clear **idea**.')
    expect(await screen.findByRole('heading', { name: 'The plan' })).toBeInTheDocument()
    await waitFor(() => expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).find((note: { title: string }) => note.title === 'Project notes').content).toContain('A clear **idea**.'))
    await user.click(screen.getByRole('button', { name: 'Download PDF' }))
    await waitFor(() => expect(exportNotePdf).toHaveBeenCalledWith('Project notes', expect.stringContaining('<strong>idea</strong>')))
    expect(await screen.findByRole('status')).toHaveTextContent('PDF downloaded')
  })
  it('switches between Write and Preview without losing the note', async () => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByRole('textbox', { name: 'Note title' })
    await user.click(screen.getByRole('button', { name: 'Write' }))
    expect(screen.queryByRole('region', { name: 'Markdown preview' })).not.toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Markdown content' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Preview' }))
    expect(screen.queryByRole('textbox', { name: 'Markdown content' })).not.toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Markdown preview' })).toHaveTextContent('Getting started')
    await user.click(screen.getByRole('button', { name: 'Split' }))
    expect(screen.getByRole('textbox', { name: 'Markdown content' })).toBeInTheDocument()
  })
  it('confirms deletion and lets the user cancel it', async () => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByRole('textbox', { name: 'Note title' })
    await user.click(screen.getByRole('button', { name: 'Open notes' }))
    expect(screen.queryByText('Saved in this browser')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Import Markdown' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Delete Getting started' }))
    await user.click(screen.getByRole('button', { name: 'Keep note' }))
    expect(screen.getByRole('textbox', { name: 'Note title' })).toHaveValue('Getting started')
    await user.click(screen.getByRole('button', { name: 'Delete Getting started' }))
    await user.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Delete note' }))
    expect(await screen.findByRole('heading', { name: 'No notes yet' })).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual([])
  })
})
