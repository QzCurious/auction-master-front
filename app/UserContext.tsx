'use client'

import { type JwtPayload } from '@/app/api/JwtPayload'
import type React from 'react'
import { createContext, useContext } from 'react'

export interface User
  extends Pick<JwtPayload, 'id' | 'avatar' | 'account' | 'nickname' | 'status'> {}

export const UserContext = createContext<User | null>(null)

export function UserContextProvider({
  user,
  children,
}: {
  user: User | null
  children: React.ReactNode
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

export function SignInOnly({
  children,
}: {
  children: (user: User) => React.ReactNode
}) {
  const user = useContext(UserContext)
  if (!user) {
    return null
  }
  return children(user)
}
