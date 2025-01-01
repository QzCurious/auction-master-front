import '@fontsource-variable/noto-sans-tc'
import { Noto_Sans_TC } from 'next/font/google'
import './globals.css'
import ToastContainer from './ToastContainer'

const font = Noto_Sans_TC({ subsets: [], weight: 'variable' })

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
