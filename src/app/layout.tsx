import { getUser } from '@/api/helpers/getUser'
import '@fontsource-variable/noto-sans-tc'
import type { Metadata } from 'next'
import { Noto_Sans_TC } from 'next/font/google'
import Script from 'next/script'
import { UserContextProvider } from '../domain/auth/UserContext'
import { SITE_NAME } from '../domain/static/static'
import './globals.css'

const font = Noto_Sans_TC({ subsets: [], weight: 'variable' })

export const metadata = { title: SITE_NAME } satisfies Metadata

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getUser()

  return (
    <html lang='en'>
      <UserContextProvider user={user}>
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
      </UserContextProvider>
    </html>
  )
}
