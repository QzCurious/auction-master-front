'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function RedirectAuthError() {
  const router = useRouter()

  useEffect(() => {
    router.push('/')
  }, [router])

  return null
}
