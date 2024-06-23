'use client'

import Link from 'next/link'
import React, { useContext } from 'react'
import { UserContext } from '../UserContext'
import { logout } from '../api/logout'
import { MobileMenu, MobileMenuProvider, MobileMenuToggle } from './components'

const navigation = [
  { name: '我的物品', href: '/items' },
  { name: 'Features', href: '#' },
  { name: 'Marketplace', href: '#' },
  { name: 'Company', href: '#' },
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
  return (
    <MobileMenuProvider>
      {/* Header */}
      <header className='relative z-30'>
        <nav
          className='flex items-center justify-between p-6 lg:px-8'
          aria-label='Global'
        >
          <div className='flex lg:flex-1'>
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
          <div className='hidden lg:flex lg:gap-x-12'>
            {user &&
              navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className='text-sm font-semibold leading-6 text-gray-900'
                >
                  {item.name}
                </Link>
              ))}
          </div>
          <div className='hidden lg:flex lg:flex-1 lg:justify-end'>
            {user ? (
              <>
                <p className='inline'>
                  歡迎,{' '}
                  <Link href='/me' className='hover:underline'>
                    {user.account}
                  </Link>
                </p>
                <form action={logout} className='ml-4 inline'>
                  <button className='text-sm font-semibold leading-6 text-red-700 underline'>
                    登出
                  </button>
                </form>
              </>
            ) : (
              <Link
                href='/sign-in'
                className='text-sm font-semibold leading-6 text-gray-900'
              >
                登入 <span aria-hidden='true'>&rarr;</span>
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
