'use server'

import { apiClient } from '@/app/api/apiClient'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { cookieConfigs } from '../static'
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

  cookies().set(cookieConfigs.token.name, res.data.token, cookieConfigs.token.opts())
  cookies().set(
    cookieConfigs.refreshToken.name,
    res.data.refreshToken,
    cookieConfigs.refreshToken.opts(),
  )

  return { data: res.data, error: null }
}
