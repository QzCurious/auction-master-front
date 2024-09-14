import '@fontsource-variable/noto-sans-tc'
import type { Metadata } from 'next'
import { Noto_Sans_TC } from 'next/font/google'
import Script from 'next/script'
import WithUserContext from './WithUserContext'
import './globals.css'
import { SITE_NAME } from './static'

const font = Noto_Sans_TC({ subsets: [], weight: 'variable' })

export const metadata = { title: SITE_NAME } satisfies Metadata

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <WithUserContext>
        <body className={font.className}>{children}</body>
        <Script id='noWheel-on-number-input'>
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
