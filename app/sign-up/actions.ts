'use server'

import { z } from 'zod'
import { apiClient } from '../api/client'

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

type ErrorCode =
  // ConsignorExisted
  '1601'

export async function signUp(formData: FormData) {
  const parsed = ReqSchema.safeParse(Object.fromEntries(formData))
  if (parsed.error) {
    const err = parsed.error.flatten()
    return { data: null, error: err } as const
  }

  const data = await apiClient<'Success', ErrorCode>('/consignor', {
    method: 'POST',
    body: formData,
  })

  if (data.error) {
    if (data.error.code === '1601') {
      return {
        data: null,
        error: new z.ZodError([
          {
            code: 'custom',
            path: ['account'],
            message: 'Account already exists',
          },
        ]).flatten(),
      }
    }

    data.error.code satisfies never
    throw new Error('Unhandled error', { cause: data.error })
  }

  return { data: data.data, error: null }
}
