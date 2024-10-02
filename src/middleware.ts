import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import { CookieConfigs } from './domain/auth/CookieConfigs'
import { getToken } from './domain/auth/getToken'

export async function middleware(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_IS_MAINTENANCE) {
    if (request.nextUrl.pathname !== '/') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // refresh token and set cookie
  const response = NextResponse.next()
  const token = cookies().get(CookieConfigs.token.name)?.value
  const { token: newToken, res } = await getToken()

  if (res?.error === '1003') {
    response.cookies.delete(CookieConfigs.token.name)
    response.cookies.delete(CookieConfigs.refreshToken.name)
    return response
  }

  if (newToken && token !== newToken) {
    console.log('middleware: new token set')
    response.cookies.set(
      CookieConfigs.token.name,
      newToken,
      CookieConfigs.token.opts(),
    )
  }
  return response
}

export const config = {
  matcher: [
    '/((?!api|auth/sign-in|_next/static|_next/image|favicon\\.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg$).*)',
  ],
}
