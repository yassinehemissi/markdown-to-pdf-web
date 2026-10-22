export function filename(title: string) { return title.replace(/[<>:"/\\|?*\x00-\x1f]/g, '').trim().slice(0, 100) || 'Untitled note' }
