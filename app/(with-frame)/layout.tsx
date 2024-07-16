import React from 'react'
import Frame from './Frame'
import LineFloatBtn from './LineFloatBtn'
import ToastContainer from './ToastContainer'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Frame>{children}</Frame>
      <ToastContainer />
      <LineFloatBtn />
    </>
  )
}
