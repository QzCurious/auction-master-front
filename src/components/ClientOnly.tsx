'use client'

import { useSyncExternalStore } from 'react'

function subscribe() {
  return () => {}
}

export default function ClientOnly({ children }: { children: React.ReactNode }) {
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )

  return hydrated ? <>{children}</> : null
}
