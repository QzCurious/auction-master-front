'use server'

import { apiClientWithToken } from '@/api/core/apiClientWithToken'
import { createApiErrorServerSide } from '@/api/core/ApiError/createApiErrorServerSide'
import { SuccessResponseJson } from '@/api/core/static'

type Data = number

export async function GetConsignorBonusBalance() {
  const res = await apiClientWithToken
    .get<SuccessResponseJson<Data>>('frontend/bonuses', {
      next: { tags: ['bonuses'] },
    })
    .json()
    .catch(createApiErrorServerSide)

  return res
}
