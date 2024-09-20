'use server'

import { CookieConfigs } from '@/domain/auth/CookieConfigs'
import { appendEntries } from '@/domain/crud/appendEntries'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { apiClient } from './apiClient'
import { throwIfInvalid } from './helpers/throwIfInvalid'

const ReqSchema = z.object({
  account: z.string().min(1, 'Account is required'),
  password: z.string().min(1, 'Password is required'),
})

interface Data {
  token: string
  refreshToken: string
}

type ErrorCode =
  // block user
  | '1002'
  // PasswordIncorrect
  | '1004'
  // ConsignorNotExist
  | '1602'

export async function ConsignorLogin(payload: z.input<typeof ReqSchema>) {
  const data = throwIfInvalid(payload, ReqSchema)

  const urlencoded = new URLSearchParams()
  appendEntries(urlencoded, data)

  const res = await apiClient<Data, ErrorCode>('/session', {
    method: 'POST',
    body: urlencoded,
  })

  if (res.error) {
    return { data: null, error: res.error }
  }

  cookies().set(CookieConfigs.token.name, res.data.token, CookieConfigs.token.opts())
  cookies().set(
    CookieConfigs.refreshToken.name,
    res.data.refreshToken,
    CookieConfigs.refreshToken.opts(),
  )

  return { data: res.data, error: null }
}
