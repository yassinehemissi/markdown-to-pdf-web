import {
  createRootRoute,
  createRoute,
  createRouter,
  createBrowserHistory,
} from '@tanstack/react-router'
import { links } from '@/constants/links'
import { WorkspaceRoute } from '@/routes/workspace/workspace-route'
import { NotesIndexRoute } from '@/routes/workspace/notes-index-route'
import { NoteRoute } from '@/routes/workspace/note-route'
import { NotFoundRoute } from '@/routes/workspace/not-found-route'

const rootRoute = createRootRoute({
  component: WorkspaceRoute,
  notFoundComponent: NotFoundRoute,
})
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: links.workspace.home,
  component: NotesIndexRoute,
})
const noteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: links.workspace.note,
  component: NoteRoute,
})
export function createAppRouter(history = createBrowserHistory()) {
  return createRouter({
    history,
    routeTree: rootRoute.addChildren([indexRoute, noteRoute]),
  })
}
