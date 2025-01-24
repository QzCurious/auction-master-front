import '@fontsource-variable/noto-sans-tc'
import { Noto_Sans_TC } from 'next/font/google'
import './globals.css'
import ToastContainer from './ToastContainer'
import Providers from './Providers'

const font = Noto_Sans_TC({ subsets: [], weight: 'variable' })

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
