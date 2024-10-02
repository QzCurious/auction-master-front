import { GetConsignor } from '@/api/frontend/consignor/GetConsignor'
import { ConsignorContextProvider } from '@/domain/auth/ConsignorContext'
import React from 'react'
import Frame from './Frame'
import LineFloatBtn from './LineFloatBtn'
import ToastContainer from './ToastContainer'

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {process.env.NEXT_PUBLIC_IS_MAINTENANCE && (
        <div className='sticky top-0 z-50 flex items-center justify-center bg-indigo-800/40 backdrop-blur-sm'>
          <div className='text-center'>
            <h2 className='text-lg/10 text-white'>系統維護中</h2>
          </div>
        </div>
      )}

      <WithConsignorContext>
        <Frame>{children}</Frame>
      </WithConsignorContext>
      <ToastContainer />
      <LineFloatBtn />
    </>
  )
}

async function WithConsignorContext({ children }: { children: React.ReactNode }) {
  if (process.env.NEXT_PUBLIC_IS_MAINTENANCE) {
    return <>{children}</>
  }

  const consignorRes = await GetConsignor()

  return (
    <ConsignorContextProvider consignor={consignorRes.data}>
      {children}
    </ConsignorContextProvider>
  )
}
