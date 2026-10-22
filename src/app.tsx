import { useState } from 'preact/hooks'
import { RouterProvider } from '@tanstack/react-router'
import { createAppRouter } from '@/router'
export function App() {
  const [router] = useState(createAppRouter)
  return <RouterProvider router={router} />
}
