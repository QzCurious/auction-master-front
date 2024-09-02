import '@fontsource-variable/noto-sans-tc'
import type { Metadata } from 'next'
import { Noto_Sans_TC } from 'next/font/google'
import WithUserContext from './WithUserContext'
import './globals.css'
import Script from 'next/script'

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
        <Script id='noWheel-on-number-input' >
          {`
          window.addEventListener('mousewheel', (e) => {
            if (e.target instanceof HTMLInputElement && e.target.type === 'number') {
              e.target.blur()
            }
          })
          `}
        </Script>
      </WithUserContext>
    </html>
  )
}
