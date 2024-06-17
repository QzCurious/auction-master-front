'use server'

import { cookies } from 'next/headers'
import { cookieConfigs } from '../static'

export async function logout() {
  cookies().delete(cookieConfigs.token.name)
  cookies().delete(cookieConfigs.refreshToken.name)
}
