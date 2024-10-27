'use server'

import { CookieConfigs } from '@/domain/auth/CookieConfigs'
import { appendEntries } from '@/domain/crud/appendEntries'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { apiClientBase } from './core/apiClientBase'
import { createApiErrorServerSide } from './core/ApiError/createApiErrorServerSide'
import { SuccessResponseJson, throwIfInvalid } from './core/static'

const ReqSchema = z.object({
  account: z.string().min(1, 'Account is required'),
  password: z.string().min(1, 'Password is required'),
})

interface Data {
  token: string
  refreshToken: string
}

export async function ConsignorLogin(payload: z.input<typeof ReqSchema>) {
  const data = throwIfInvalid(payload, ReqSchema)

  const urlencoded = new URLSearchParams()
  appendEntries(urlencoded, data)

  const res = await apiClientBase
    .post<SuccessResponseJson<Data>>('session', {
      body: urlencoded,
    })
    .json()
    .catch(createApiErrorServerSide)

  if (!res.data) {
    return res
  }

  cookies().set(CookieConfigs.token.name, res.data.token, CookieConfigs.token.opts())
  cookies().set(
    CookieConfigs.refreshToken.name,
    res.data.refreshToken,
    CookieConfigs.refreshToken.opts(),
  )

  return null
}
