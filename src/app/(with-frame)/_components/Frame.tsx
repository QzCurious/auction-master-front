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
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useContext } from 'react'
import { UserMenu } from './UserMenu'

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
    <StackedLayout
      navbar={
        <Navbar className='relative z-10 -mx-4 px-4 lg:shadow'>
          <Link className='ml-4 flex items-center gap-x-2 lg:ml-0' href='/'>
            <div className='size-4 rounded-full bg-indigo-400' />
            <Heading>日拍大師</Heading>
          </Link>
          <NavbarDivider className='max-lg:hidden' />

          {!process.env.NEXT_PUBLIC_IS_MAINTENANCE && consignor && (
            <NavbarSection className='max-lg:hidden'>
              {navItems.map(({ label, url }) => (
                <NavbarItem key={label} href={url} current={pathname.startsWith(url)}>
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
  )
}
