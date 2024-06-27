import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from './app/api/getToken'
import { cookieConfigs } from './app/static'

export async function middleware(request: NextRequest) {
  // refresh token and set cookie
  const response = NextResponse.next()
  const token = cookies().get(cookieConfigs.token.name)?.value
  const { token: newToken, res } = await getToken()

  if (res?.error === '1003') {
    response.cookies.delete(cookieConfigs.token.name)
    response.cookies.delete(cookieConfigs.refreshToken.name)
    return response
  }

  if (newToken && token !== newToken) {
    console.log('middleware: new token set')
    response.cookies.set(cookieConfigs.token.name, newToken, cookieConfigs.token.opts)
  }
  return response
}

export const config = {
  matcher: [
    '/((?!api|auth/sign-in|_next/static|_next/image|favicon\\.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg$).*)',
  ],
}
