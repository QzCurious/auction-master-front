import React from 'react'
import { configs } from '../api/frontend/configs'
import { getUser } from '../api/helpers/getUser'
import { ConfigContextProvider } from './ConfigContext'

export default async function WithConfigContext({
  children,
}: {
  children: React.ReactNode
}) {
  const user = getUser()

  if (!user) {
    return <>{children}</>
  }

  const configsRes = await configs()

  if (configsRes.error) {
    return <>{children}</>
  }

  return (
    <ConfigContextProvider configs={configsRes.data}>
      {children}
    </ConfigContextProvider>
  )
}
