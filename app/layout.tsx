import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import WithUserContext from './WithUserContext'

const inter = Inter({ subsets: ['latin'] })

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
        <body className={inter.className}>{children}</body>
      </WithUserContext>
    </html>
  )
}
