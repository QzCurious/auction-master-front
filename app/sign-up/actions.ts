'use server'

import { z } from 'zod'
import { ApiErrorStatus, apiClient } from '../api/client'

const ReqSchema = z
  .object({
    account: z.string(),
    password: z.string(),
    conformPassword: z.string(),
    nickname: z.string(),
  })
  .refine((data) => data.password === data.conformPassword, {
    message: 'Passwords do not match',
    path: ['conformPassword'],
  })

type ApiError = ApiErrorStatus<{ code: '21'; message: 'create consignor error' }>

export async function signUp(formData: FormData) {
  const parsed = ReqSchema.safeParse(Object.fromEntries(formData))
  if (parsed.error) {
    const err = parsed.error.flatten()
    return { data: null, error: err } as const
  }

  const data = await apiClient<'Success', ApiError>('/consignor', {
    method: 'POST',
    body: formData,
  })

  return { data: data.data, error: null }
}
