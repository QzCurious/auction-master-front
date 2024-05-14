import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { MobileMenuProvider } from './components'

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
      <body className={inter.className}>
        <MobileMenuProvider>{children}</MobileMenuProvider>
      </body>
    </html>
  )
}
