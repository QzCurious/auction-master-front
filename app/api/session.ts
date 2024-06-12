'use server'

import { apiClient } from '@/app/api/apiClient'
import { cookies } from 'next/headers'
import { z } from 'zod'
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
  // PasswordIncorrect
  | '1004'
  // ConsignorNotExist
  | '1602'

export async function session(payload: z.input<typeof ReqSchema>) {
  throwIfInvalid(payload, ReqSchema)

  const formData = new FormData()
  formData.append('account', payload.account)
  formData.append('password', payload.password)

  const res = await apiClient<Data, ErrorCode>('/session', {
    method: 'POST',
    body: formData,
  })

  if (res.error) {
    return { data: null, error: res.error }
  }

  cookies().set('token', res.data.token, {
    expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
    httpOnly: true,
    sameSite: 'strict',
    // secure: process.env.NODE_ENV === 'production',
  })
  cookies().set('refreshToken', res.data.refreshToken, {
    expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
    httpOnly: true,
    sameSite: 'strict',
    // secure: process.env.NODE_ENV === 'production',
  })

  return { data: res.data, error: null }
}
