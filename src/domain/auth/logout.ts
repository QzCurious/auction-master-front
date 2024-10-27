'use server'

import { cookies } from 'next/headers'
import { CookieConfigs } from './CookieConfigs'

export async function logout() {
  const awaitedCookies = await cookies()
  awaitedCookies.delete(CookieConfigs.token.name)
  awaitedCookies.delete(CookieConfigs.refreshToken.name)
}
