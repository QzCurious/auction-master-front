'use server'

import { apiClient } from '../../apiClient'
import { withAuth } from '../../withAuth'

type Data = number

type ErrorCode = never

export async function GetConsignorWalletBalance() {
  const res = await withAuth(apiClient)<Data, ErrorCode>('/frontend/wallets', {
    method: 'GET',
    next: { tags: ['wallets'] },
  })

  return res
}
