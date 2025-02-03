import { SITE_NAME } from '@/domain/static/static'
import '@fontsource-variable/noto-sans-tc'
import { Noto_Sans_TC } from 'next/font/google'
import './globals.css'
import Providers from './Providers'
import ToastContainer from './ToastContainer'

const font = Noto_Sans_TC({ subsets: [], weight: 'variable' })

export const metadata = {
  title: SITE_NAME,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='zh-TW'>
      <body className={font.className}>
        <Providers>
          {children}
          <ToastContainer />
        </Providers>
      </body>
    </html>
  )
}
