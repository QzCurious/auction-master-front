'use client'

import { Heading } from '@/catalyst-ui/heading'
import {
  Navbar,
  NavbarDivider,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
} from '@/catalyst-ui/navbar'
import {
  Sidebar,
  SidebarBody,
  SidebarItem,
  SidebarSection,
} from '@/catalyst-ui/sidebar'
import { StackedLayout } from '@/catalyst-ui/stacked-layout'
import { ConsignorContext } from '@/domain/auth/ConsignorContext'
import { WrenchScrewdriverIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useContext } from 'react'
import { UserMenu } from './UserMenu'
import logo from './日拍大師LOGO.jpg'

const navItems = [
  { label: '我的物品', url: '/items' },
  { label: '競標列表', url: '/auction-items' },
  { label: '帳戶紀錄', url: '/balance' },
  { label: '交易紀錄', url: '/records' },
]

export default function Frame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const consignor = useContext(ConsignorContext)

  return (
    <>
      <StackedLayout
        navbar={
          <Navbar>
            <Link className='ml-4 flex items-center lg:ml-0' href='/'>
              <Image src={logo} width={52} height={52} className='-my-20' alt='' />
              <Heading>日拍大師</Heading>
            </Link>
            <NavbarDivider className='max-lg:hidden' />

            {!process.env.NEXT_PUBLIC_IS_MAINTENANCE && consignor && (
              <NavbarSection className='max-lg:hidden'>
                {navItems.map(({ label, url }) => (
                  <NavbarItem
                    key={label}
                    href={url}
                    current={pathname.startsWith(url)}
                  >
                    {label}
                  </NavbarItem>
                ))}
              </NavbarSection>
            )}

            <NavbarSpacer />

            {!process.env.NEXT_PUBLIC_IS_MAINTENANCE ? (
              <UserMenu />
            ) : (
              <aside className='flex items-center gap-x-2'>
                <WrenchScrewdriverIcon className='size-5 animate-pulse text-amber-500' />
                <Heading level={2} className='!text-zinc-600'>
                  系統維護中
                </Heading>
              </aside>
            )}
          </Navbar>
        }
        sidebar={
          <Sidebar>
            <SidebarBody>
              <SidebarSection>
                {navItems.map(({ label, url }) => (
                  <SidebarItem
                    key={label}
                    href={url}
                    current={pathname.startsWith(url)}
                  >
                    {label}
                  </SidebarItem>
                ))}
              </SidebarSection>
            </SidebarBody>
          </Sidebar>
        }
      >
        {children}
      </StackedLayout>
      <Footer />
    </>
  )
}

const navigation = {
  rules: [
    { name: '委託規則', href: '/commission-rules' },
    { name: '日拍大師條款', href: '/terms-of-use' },
  ],
  faq: [
    { name: '註冊與個資相關', href: '/faq/registration-personal-data' },
    { name: '交易服務相關', href: '/faq/transaction-services' },
    { name: '物品寄送相關', href: '/faq/shipping-delivery' },
  ],
}

function Footer() {
  return (
    <footer className='border-t bg-white'>
      <div className='mx-auto max-w-6xl px-6 pb-8 pt-10 lg:px-8'>
        <div className='flex justify-end gap-14'>
          <div>
            <h3 className='text-sm/6 font-semibold text-gray-900'>平台規則</h3>
            <ul role='list' className='mt-6 space-y-4'>
              {navigation.rules.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className='text-sm/6 text-gray-600 hover:text-gray-900'
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className='mt-10 md:mt-0'>
            <h3 className='text-sm/6 font-semibold text-gray-900'>常見問題</h3>
            <ul role='list' className='mt-6 space-y-4'>
              {navigation.faq.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className='text-sm/6 text-gray-600 hover:text-gray-900'
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
