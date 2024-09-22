'use client'

import { Consignor } from '@/api/frontend/consignor/GetConsignor'
import { JwtPayload } from '@/api/JwtPayload'
import type React from 'react'
import { createContext } from 'react'

export const ConsignorContext = createContext<Consignor | null>(null)
export interface User
  extends Pick<JwtPayload, 'id' | 'avatar' | 'account' | 'nickname' | 'status'> {}

export function ConsignorContextProvider({
  consignor,
  children,
}: {
  consignor: Consignor | null
  children: React.ReactNode
}) {
  return (
    <ConsignorContext.Provider value={consignor}>
      {children}
    </ConsignorContext.Provider>
  )
}
