'use server'

import { appendEntries } from '@/domain/crud/appendEntries'
import { z } from 'zod'
import { ConsignorLogin } from './ConsignorLogin'
import { apiClientBase } from './core/apiClientBase'
import { createApiErrorServerSide } from './core/ApiError/createApiErrorServerSide'
import { SuccessResponseJson, throwIfInvalid } from './core/static'

const ReqSchema = z.object({
  account: z.string(),
  password: z.string(),
  nickname: z.string(),
})

type Data = 'Success'

export async function CreateConsignor(payload: z.input<typeof ReqSchema>) {
  const data = throwIfInvalid(payload, ReqSchema)

  const urlencoded = new URLSearchParams()
  appendEntries(urlencoded, data)

  const res = await apiClientBase
    .post<SuccessResponseJson<Data>>('consignor', {
      body: urlencoded,
    })
    .json()
    .catch(createApiErrorServerSide)

  if (!res.error) {
    const res = await ConsignorLogin({
      account: payload.account,
      password: payload.password,
    })
    if (res?.error) {
      throw new Error('Backend bug')
    }
    return res
  }

  return res
}
