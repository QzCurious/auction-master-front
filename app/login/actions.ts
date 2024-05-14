'use server'

import { jwtDecode } from 'jwt-decode'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { apiClient } from '../api/client'

const ReqSchema = z.object({
  account: z.string(),
  password: z.string(),
})

type ErrorCode =
  // AccountOrPasswordIncorrect
  | '1002'
  // ConsignorNotExist
  | '1602'

interface ApiData {
  token: string
  refreshToken: string
}

export async function login(formData: FormData) {
  const parsed = ReqSchema.safeParse(Object.fromEntries(formData))
  if (parsed.error) {
    const err = parsed.error.flatten()
    return { data: null, error: err }
  }

  const data = await apiClient<ApiData, ErrorCode>('/session', {
    method: 'POST',
    body: formData,
  })

  if (data.error) {
    if (data.error.code === '1002' || data.error.code === '1602') {
      return {
        data: null,
        error: new z.ZodError([
          {
            code: 'custom',
            path: [],
            message: 'Account or password incorrect',
          },
        ]).flatten(),
      }
    }

    data.error satisfies never
    throw new Error('Unhandled error', { cause: data.error })
  }

  const jwt = jwtDecode<{
    id: number
    account: string
    status: 11
    exp: number
    iat: number
    nbf: number
  }>(data.data.token)

  cookies().set('token', data.data.token, {
    expires: new Date(jwt.exp * 1000),
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  })
  cookies().set('refreshToken', data.data.refreshToken, {
    expires: new Date(jwt.exp * 1000),
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  })
  cookies().set('account', jwt.account, {
    expires: new Date(jwt.exp * 1000),
    sameSite: 'strict',
  })

  redirect('/')
  // return { data: data.data, error: null }
}
