'use server'

import { apiClientWithToken } from '@/api/core/apiClientWithToken'
import { createApiErrorServerSide } from '@/api/core/ApiError/createApiErrorServerSide'
import { SuccessResponseJson } from '@/api/core/static'
import { appendEntries } from '@/domain/crud/appendEntries'
import { z } from 'zod'
import { throwIfInvalid } from '@/api/core/static'

const ReqSchema = z.object({
  oldPassword: z.string().min(1),
  password: z.string().min(1),
})

type Data = 'Success'

export async function UpdateConsignorPassword(payload: z.input<typeof ReqSchema>) {
  const data = throwIfInvalid(payload, ReqSchema)

  const urlencoded = new URLSearchParams()
  appendEntries(urlencoded, data)

  const res = await apiClientWithToken
    .patch<SuccessResponseJson<Data>>('frontend/consignor/password', {
      body: urlencoded,
    })
    .json()
    .catch(createApiErrorServerSide)

  return res
}
