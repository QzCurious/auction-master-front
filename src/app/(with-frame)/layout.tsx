import { GetConsignor } from '@/api/frontend/consignor/GetConsignor'
import { ConsignorContextProvider } from '@/domain/auth/ConsignorContext'
import Script from 'next/script'
import React from 'react'
import Frame from './_components/Frame'
import LineFloatBtn from './_components/LineFloatBtn'
import { NotificationBannerClientOnly } from './NotificationBanner'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const consignorRes = await GetConsignor()

  return (
    <ConsignorContextProvider consignor={consignorRes.data}>
      {/* <NotificationBannerClientOnly /> */}
      <Frame>{children}</Frame>

      <LineFloatBtn />
      <Script id='noWheel-on-number-input'>
        {`
          window.addEventListener('mousewheel', (e) => {
            if (e.target instanceof HTMLInputElement && e.target.type === 'number') {
              e.target.blur()
            }
          })
          `}
      </Script>
    </ConsignorContextProvider>
  )
}
