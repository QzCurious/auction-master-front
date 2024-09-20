'use client'

import { JwtPayload } from '@/api/JwtPayload'
import type React from 'react'
import { createContext } from 'react'

export const UserContext = createContext<User | null>(null)
export interface User
  extends Pick<JwtPayload, 'id' | 'avatar' | 'account' | 'nickname' | 'status'> {}

export function UserContextProvider({
  user,
  children,
}: {
  user: User | null
  children: React.ReactNode
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}
