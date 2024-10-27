'use server'

import { apiClientWithToken } from '@/api/core/apiClientWithToken'
import { createApiErrorServerSide } from '@/api/core/ApiError/createApiErrorServerSide'
import { SuccessResponseJson } from '@/api/core/static'

export interface ExchangeRate {
  buying: number
  selling: number
}

interface Data extends ExchangeRate {}

export async function GetJPYRates() {
  const res = await apiClientWithToken
    .get<SuccessResponseJson<Data>>('frontend/jpy-rates', {
      next: { tags: ['jpy-rates'] },
    })
    .json()
    .catch(createApiErrorServerSide)

  return res
}
