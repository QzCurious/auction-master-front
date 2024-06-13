import { UserContextProvider } from '@/app/UserContext'
import type React from 'react'
import { getUser } from './api/helpers/getUser'

export default async function WithUserContext({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  return <UserContextProvider user={user}>{children}</UserContextProvider>
}
