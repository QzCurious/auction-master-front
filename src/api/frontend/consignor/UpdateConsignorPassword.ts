'use server'

import { appendEntries } from '@/domain/crud/appendEntries'
import { z } from 'zod'
import { apiClient } from '../../apiClient'
import { throwIfInvalid } from '../../helpers/throwIfInvalid'
import { withAuth } from '../../withAuth'

const ReqSchema = z.object({
  oldPassword: z.string().min(1),
  password: z.string().min(1),
})

type Data = 'Success'

type ErrorCode =
  // password cannot be same as old password
  | '11'
  // old password incorrect
  | '1004'

export async function UpdateConsignorPassword(payload: z.input<typeof ReqSchema>) {
  const data = throwIfInvalid(payload, ReqSchema)

  const urlencoded = new URLSearchParams()
  appendEntries(urlencoded, data)

  const res = await withAuth(apiClient)<Data, ErrorCode>(
    '/frontend/consignor/password',
    {
      method: 'PATCH',
      body: urlencoded,
    },
  )

  return res
}
