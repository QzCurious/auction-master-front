'use client'

import { createContext, useContext } from 'react'
import { Configs } from '../api/frontend/configs'

export const ConfigContext = createContext<Configs | null>(null)

export function ConfigContextProvider({
  configs,
  children,
}: {
  configs: Configs
  children: React.ReactNode
}) {
  return <ConfigContext.Provider value={configs}>{children}</ConfigContext.Provider>
}

export function useItemStatusMap() {
  const configs = useContext(ConfigContext)

  if(!configs) {
    return null
  }

  return configs.itemStatus.reduce(
    (acc, cur) => {
      acc[cur.key] = cur.value
      return acc
    },
    {} as Record<string, number>,
  ) as Record<Configs['itemStatus'][number]['key'], number>
}
