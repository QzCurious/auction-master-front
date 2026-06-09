'use server'

import { apiClientWithToken } from '@/api/core/apiClientWithToken'
import { createApiErrorServerSide } from '@/api/core/ApiError/createApiErrorServerSide'
import { SuccessResponseJson } from '@/api/core/static'
import { revalidateTag } from 'next/cache'

import { Record } from './GetRecords'

type Data = 'Success'

export async function ConsignorCancelPayment(id: Record['id']) {
  const res = await apiClientWithToken
    .post<SuccessResponseJson<Data>>(`frontend/reports/records/${id}/cancel-payment`)
    .json()
    .catch(createApiErrorServerSide)

  revalidateTag('records')

  return res
}
