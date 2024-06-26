'use server'

import { getToken } from '@/app/api/getToken'
import { cookieConfigs } from '@/app/static'
import { cookies } from 'next/headers'

export async function forceRefreshTokenAction() {
}
