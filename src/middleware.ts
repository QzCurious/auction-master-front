import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from './domain/auth/getToken'
import { CookieConfigs } from "./domain/auth/CookieConfigs"

export async function middleware(request: NextRequest) {
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
