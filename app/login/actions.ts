'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { session } from '../api/session'

export async function login(formData: FormData) {
  const res = await session(formData)

  if (res.parseError) {
    return { data: null, error: res.parseError } as const
  }

  if (res.error) {
    if (res.error.code === '1004' || res.error.code === '1602') {
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

    res.error satisfies never
    throw new Error('Unhandled error', { cause: res.error })
  }

  !res.data satisfies false

  redirect('/')
}
