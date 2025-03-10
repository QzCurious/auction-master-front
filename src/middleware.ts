import { NextResponse, type NextRequest } from 'next/server'
import { RefreshToken } from './api/RefreshToken'
import { CookieConfigs } from './domain/auth/CookieConfigs'
import { getJwt } from './domain/auth/getJwt'

export async function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith('/faq') ||
    request.nextUrl.pathname.startsWith('/terms-of-use') ||
    request.nextUrl.pathname.startsWith('/commission-rules')
  ) {
    return NextResponse.next()
  }

  if (
    process.env.NEXT_PUBLIC_IS_MAINTENANCE &&
    request.nextUrl.pathname !== '/maintenance'
  ) {
    return NextResponse.redirect(new URL('/maintenance', request.url))
  }

  // refresh token and set cookie
  const response = NextResponse.next()

  if (request.nextUrl.pathname === '/') {
    return response
  }

  const jwt = await getJwt()
  if (!jwt) {
    console.log('middleware: token not found')
    return logout(request)
  }

  // jwt still valid
  if (jwt.exp * 1000 - 30 * 1000 > Date.now()) {
    return response
  }

  const res = await RefreshToken()

  if (res.error) {
    console.log('middleware: refresh token failed')
    return logout(request)
  }

  console.log('middleware: token refreshed')
  response.cookies.set(
    CookieConfigs.token.name,
    res.data.token,
    CookieConfigs.token.opts(),
  )

  return response
}

export const config = {
  matcher: [
    '/((?!api|auth|_next/static|google34aeb6de6a8da256.html|robots.txt|_next/image|favicon\\.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg$).*)',
  ],
}

function logout(request: NextRequest) {
  const goto = request.nextUrl.pathname + request.nextUrl.search
  const response = NextResponse.redirect(
    new URL(`/auth/sign-in?goto=${goto}`, request.url),
  )
  response.cookies.delete(CookieConfigs.token.name)
  response.cookies.delete(CookieConfigs.refreshToken.name)
  return response
}
