'use client'

import { type ApiError } from '@/api/core/ApiError/createApiErrorServerSide'
import { redirect } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

export function useHandleApiError() {
  return useCallback((err: ApiError) => {
    if (err.type === 'toast') {
      toast.error(err.message)
      return
    }
    if (err.type === 'redirect') {
      redirect(err.url)
    }
    if (err.type === 'throw') {
      throw new Error(err.message)
    }
  }, [])
}

export function HandleApiError({ error }: { error: ApiError }) {
  const done = useRef(false)
  const handleApiError = useHandleApiError()

  useEffect(() => {
    if (!done.current) {
      handleApiError(error)
      done.current = true
    }
  }, [error, handleApiError])

  return null
}
