'use server'

import { cookies } from 'next/headers'
import { CookieConfigs } from "./CookieConfigs"

export async function logout() {
  cookies().delete(CookieConfigs.token.name)
  cookies().delete(CookieConfigs.refreshToken.name)
}
