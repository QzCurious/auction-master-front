'use client'

import { useRouter } from 'next/navigation'
import { startTransition, useEffect, useState } from 'react'

export default function BindSuccessfully() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setCountdown((p) => p - 1)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setCountdown((p) => p - 1)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setCountdown((p) => p - 1)
      router.replace('/')
    })
  }, [])

  return (
    <div>
      <h1 className='text-2xl font-bold'>LINE 通知綁定成功</h1>
      <p>即將前往首頁... ({countdown})</p>
    </div>
  )
}
