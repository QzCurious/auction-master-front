'use server'

import { apiClient } from '../../apiClient'
import { withAuth } from '../../withAuth'

type Data = number

type ErrorCode = never

export async function GetConsignorBonusBalance() {
  const res = await withAuth(apiClient)<Data, ErrorCode>('/frontend/bonuses', {
    method: 'GET',
    next: { tags: ['bonuses'] },
  })

  return res
}
