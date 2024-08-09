'use client'

import {
  ArrowRightEndOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useContext } from 'react'
import { UserContext } from '../UserContext'
import { logout } from '../api/logout'
import { MobileMenu, MobileMenuProvider, MobileMenuToggle } from './components'

const navigation = [
  { name: '我的物品', href: '/items' },
  { name: '競標列表', href: '/auction-items' },
  { name: '帳戶紀錄', href: '/balance' },
]

const footerNavigation = {
  solutions: [
    { name: 'Hosting', href: '#' },
    { name: 'Data Services', href: '#' },
    { name: 'Uptime Monitoring', href: '#' },
    { name: 'Enterprise Services', href: '#' },
  ],
  support: [
    { name: 'Pricing', href: '#' },
    { name: 'Documentation', href: '#' },
    { name: 'Guides', href: '#' },
    { name: 'API Reference', href: '#' },
  ],
  company: [
    { name: 'About', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Jobs', href: '#' },
    { name: 'Press', href: '#' },
    { name: 'Partners', href: '#' },
  ],
  legal: [
    { name: 'Claim', href: '#' },
    { name: 'Privacy', href: '#' },
    { name: 'Terms', href: '#' },
  ],
}

export default function Frame({ children }: { children: React.ReactNode }) {
  const user = useContext(UserContext)
  const pathname = usePathname()

  return (
    <MobileMenuProvider>
      {/* Header */}
      <header className='relative z-30'>
        <nav
          className='flex min-h-20 items-center justify-between gap-x-36 px-6 lg:px-8'
          aria-label='Global'
        >
          <div className='flex'>
            <Link href='/' className='-m-1.5 p-1.5'>
              <span className='sr-only'>Auction Master</span>
              <img
                className='h-8 w-auto'
                src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600'
                alt=''
              />
            </Link>
          </div>
          <div className='flex lg:hidden'>
            <MobileMenuToggle />
          </div>
          <div className='hidden grow justify-start lg:flex lg:gap-x-12'>
            {user &&
              navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    'px-2 py-1.5 text-lg font-semibold leading-6 text-gray-900',
                    pathname.startsWith(item.href) && 'border-b-2 border-indigo-500',
                  )}
                >
                  {item.name}
                </Link>
              ))}
          </div>
          <div className='hidden items-center lg:flex lg:justify-end'>
            {user ? (
              <>
                <Link href='/me' className='hover:underline'>
                  {user.avatar && (
                    <Image
                      src={user.avatar}
                      className='mr-2 inline-block size-8 rounded-full object-contain object-center ring-1 ring-gray-200'
                      width={32}
                      height={32}
                      alt='avatar'
                    />
                  )}
                  {user.nickname}
                </Link>

                <form action={logout} className='ml-4 inline'>
                  <button className='flex items-center gap-x-1 text-sm font-semibold leading-6 text-red-700 underline'>
                    <span>登出</span>
                    <ArrowRightStartOnRectangleIcon className='size-5' />
                  </button>
                </form>
              </>
            ) : (
              <Link
                href='/sign-in'
                className='flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900'
              >
                登入
                <ArrowRightEndOnRectangleIcon className='size-5' />
              </Link>
            )}
          </div>
        </nav>
        <MobileMenu />
      </header>
      {children}

      {/* Footer */}
      <div className='mx-auto mt-16 max-w-7xl px-6 lg:px-8'>
        <footer
          aria-labelledby='footer-heading'
          className='relative border-t border-gray-900/10 py-24'
        >
          <h2 id='footer-heading' className='sr-only'>
            Footer
          </h2>
          <div className='xl:grid xl:grid-cols-3 xl:gap-8'>
            <img
              className='h-7'
              src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600'
              alt='Company name'
            />
            <div className='mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0'>
              <div className='md:grid md:grid-cols-2 md:gap-8'>
                <div>
                  <h3 className='text-sm font-semibold leading-6 text-gray-900'>
                    Solutions
                  </h3>
                  <ul role='list' className='mt-6 space-y-4'>
                    {footerNavigation.solutions.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className='text-sm leading-6 text-gray-600 hover:text-gray-900'
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className='mt-10 md:mt-0'>
                  <h3 className='text-sm font-semibold leading-6 text-gray-900'>
                    Support
                  </h3>
                  <ul role='list' className='mt-6 space-y-4'>
                    {footerNavigation.support.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className='text-sm leading-6 text-gray-600 hover:text-gray-900'
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className='md:grid md:grid-cols-2 md:gap-8'>
                <div>
                  <h3 className='text-sm font-semibold leading-6 text-gray-900'>
                    Company
                  </h3>
                  <ul role='list' className='mt-6 space-y-4'>
                    {footerNavigation.company.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className='text-sm leading-6 text-gray-600 hover:text-gray-900'
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className='mt-10 md:mt-0'>
                  <h3 className='text-sm font-semibold leading-6 text-gray-900'>
                    Legal
                  </h3>
                  <ul role='list' className='mt-6 space-y-4'>
                    {footerNavigation.legal.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className='text-sm leading-6 text-gray-600 hover:text-gray-900'
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </MobileMenuProvider>
  )
}
