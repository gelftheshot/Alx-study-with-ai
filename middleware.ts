import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/create(.*)', '/my-flashcards(.*)', '/progress'])

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect()
  }
}, {
  clockSkewInMs: 60000, // Allow for up to 1 minute of clock skew
  debug: true, // Enable debug mode for more detailed logs
})

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
}