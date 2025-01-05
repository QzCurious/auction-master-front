'use client'

import { ConsignorContext } from '@/domain/auth/ConsignorContext'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { useContext, useEffect, useState } from 'react'

function NotificationBanner() {
  const [notifyEnabled, setNotifyEnabled] = useNotifyEnabled()
  const notificationState = useNotificationState()
  const consignor = useContext(ConsignorContext)

  if (!notifyEnabled) return null
  if (notificationState === 'granted' || notificationState === 'denied') return null
  if (!consignor) return null

  return (
    <div className='relative z-50 flex items-center gap-x-6 bg-indigo-400 px-6 py-2.5 sm:px-3.5'>
      <p className='mx-auto text-sm/6 text-white'>
        請
        {iOS() && (
          <>
            <a
              className='mx-0.5 font-semibold underline'
              href='https://support.apple.com/zh-tw/guide/ipad/ipadc602b75b/ipados#iPad4fcdda8a'
              target='_blank'
              rel='noreferrer'
            >
              將網站加入主畫面
            </a>
            並
          </>
        )}
        <button
          className='mx-0.5 font-semibold underline'
          onClick={() => Notification.requestPermission()}
        >
          開啟通知權限
        </button>
        以接收物品狀態更新通知
      </p>
      <div className='flex'>
        <button
          type='button'
          className='-m-3 p-3 focus-visible:outline-offset-[-4px]'
          onClick={() => setNotifyEnabled(false)}
        >
          <span className='sr-only'>Dismiss</span>
          <XMarkIcon aria-hidden='true' className='size-5 text-white' />
        </button>
      </div>
    </div>
  )
}

function useNotificationState() {
  const [granted, setGranted] = useState(Notification.permission)

  useEffect(() => {
    navigator.permissions.query({ name: 'notifications' }).then((result) => {
      result.addEventListener('change', () => {
        setGranted(Notification.permission)
      })
    })
  }, [])

  return granted
}

function useNotifyEnabled() {
  const [enabled, setEnabled] = useState(
    () => !(sessionStorage.getItem('notify-enabled') === 'false'),
  )

  function _setEnabled(value: boolean) {
    setEnabled(value)
    sessionStorage.setItem('notify-enabled', String(value))
  }

  return [enabled, _setEnabled] as const
}

export function NotificationBannerClientOnly() {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return <NotificationBanner />
}

// https://stackoverflow.com/questions/9038625/detect-if-device-is-ios
function iOS() {
  return (
    [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod',
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  )
}
