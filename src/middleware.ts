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
      return NextResponse.rewrite(new URL('/not-found', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
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
