import '@fontsource-variable/noto-sans-tc'
import type { Metadata } from 'next'
import { Noto_Sans_TC } from 'next/font/google'
import WithUserContext from './WithUserContext'
import './globals.css'

const font = Noto_Sans_TC({ subsets: [], weight: 'variable' })

export const metadata: Metadata = {
  title: 'Auction Master',
  description: 'Auction Master',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <WithUserContext>
        <body className={font.className}>{children}</body>
      </WithUserContext>
    </html>
  )
}
