'use client'

import { LineUserBindingCallback } from '@/api/frontend/LineUserBindingCallback'
import { useHandleApiError } from '@/domain/api/HandleApiError'
import { useRouter } from 'next/navigation'
import { startTransition, useEffect, useRef, useState, useTransition } from 'react'

export default function AutoSubmit({ token }: { token: string }) {
  const handleApiError = useHandleApiError()
  const [pending, startTransition] = useTransition()
  const fired = useRef(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (fired.current) return
    startTransition(async () => {
      fired.current = true
      const res = await LineUserBindingCallback({ token })
      if (res.error) {
        handleApiError(res.error)
        return
      }
      setSuccess(true)
    })
  }, [])

  if (pending) return <div>綁定中...</div>

  if (success) return <BindSuccessfully />
}

export function BindSuccessfully() {
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
