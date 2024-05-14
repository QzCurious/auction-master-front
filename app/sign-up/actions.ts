'use server'

import { z } from 'zod'
import { consignor } from '../api/consignor'

export async function signUp(formData: FormData) {
  const res = await consignor(formData)

  if (res.parseError) {
    return { data: null, error: res.parseError } as const
  }

  if (res.error) {
    if (res.error.code === '1601') {
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

    res.error.code satisfies never
    throw new Error('Unhandled error', { cause: res.error })
  }

  !res.data satisfies false

  return { data: res.data, error: null }
}
