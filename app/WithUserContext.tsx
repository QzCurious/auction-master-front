import { UserContextProvider } from '@/app/UserContext'
import { JwtPayload } from '@/app/api/JwtPayload'
import { getToken } from '@/app/api/getToken'
import { jwtDecode } from 'jwt-decode'
import type React from 'react'

export default async function WithUserContext({
  children,
}: {
  children: React.ReactNode
}) {
  const { token } = await getToken()
  const jwt = token ? jwtDecode<JwtPayload>(token) : null

  return (
    <UserContextProvider
      user={
        jwt
          ? {
              id: jwt.id,
              account: jwt.account,
            }
          : null
      }
    >
      {children}
    </UserContextProvider>
  )
}
