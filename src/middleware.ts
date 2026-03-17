import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

const LIST_PROTECT_PAGE = ['/checkout', '/payment', '/profile']

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    const isProtected = LIST_PROTECT_PAGE.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
    )
    if (!token && isProtected) {
      // Redirect to home with ?login=true so the login modal auto-opens,
      // giving the user clear feedback instead of a silent /not-found rewrite.
      const loginUrl = new URL('/', req.url)
      loginUrl.searchParams.set('login', 'true')
      loginUrl.searchParams.set('returnTo', pathname)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      // Always return true so the middleware function above runs for every request.
      // The actual route-protection logic is handled inside the middleware function
      // by checking req.nextauth.token against LIST_PROTECT_PAGE.
      authorized: () => true,
    },
  },
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - icon.ico (icon file)
     */
    '/((?!api|_next/static|_next/image|icon.ico).*)',
  ],
}
