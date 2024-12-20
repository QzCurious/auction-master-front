import '@fontsource-variable/noto-sans-tc'
import type { Metadata } from 'next'
import { Noto_Sans_TC } from 'next/font/google'
import { SITE_NAME } from '../domain/static/static'
import './globals.css'
import ToastContainer from './ToastContainer'

const font = Noto_Sans_TC({ subsets: [], weight: 'variable' })

export const metadata = { title: SITE_NAME } satisfies Metadata

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='zh-TW'>
      <body className={font.className}>
        {children}
        <ToastContainer />
      </body>
    </html>
  )
}
