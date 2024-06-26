'use client'

import { Dialog, DialogPanel } from '@headlessui/react'
import {
  ArrowRightEndOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'
import { UserContext } from '../UserContext'
import { logout } from '../api/logout'

export const navigation = [{ name: '我的物品', href: '/items/init-status' }]

const MobileMenuContext = createContext<[boolean, (open: boolean) => void]>([
  false,
  () => {},
])

export function MobileMenuProvider({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  useEffect(() => {
    pathname && setMobileMenuOpen(false)
  }, [pathname])
  return (
    <MobileMenuContext.Provider value={[mobileMenuOpen, setMobileMenuOpen]}>
      {children}
    </MobileMenuContext.Provider>
  )
}

export function MobileMenuToggle() {
  const [mobileMenuOpen, setMobileMenuOpen] = useContext(MobileMenuContext)
  return (
    <button
      type='button'
      className='-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700'
      onClick={() => setMobileMenuOpen(true)}
    >
      <span className='sr-only'>Open main menu</span>
      <Bars3Icon className='h-6 w-6' aria-hidden='true' />
    </button>
  )
}

export function MobileMenu() {
  const [mobileMenuOpen, setMobileMenuOpen] = useContext(MobileMenuContext)
  const user = useContext(UserContext)

  return (
    <Dialog className='lg:hidden' open={mobileMenuOpen} onClose={setMobileMenuOpen}>
      <div className='fixed inset-0 z-50' />
      <DialogPanel className='fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10'>
        <div className='flex items-center justify-between'>
          <a href='#' className='-m-1.5 p-1.5'>
            <span className='sr-only'>Auction Master</span>
            <img
              className='h-8 w-auto'
              src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600'
              alt=''
            />
          </a>
          <button
            type='button'
            className='-m-2.5 rounded-md p-2.5 text-gray-700'
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className='sr-only'>關閉選單</span>
            <XMarkIcon className='h-6 w-6' aria-hidden='true' />
          </button>
        </div>
        <div className='mt-6 flow-root'>
          <div className='-my-6 divide-y divide-gray-500/10'>
            <div className='space-y-2 py-6'>
              {user &&
                navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className='-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50'
                  >
                    {item.name}
                  </Link>
                ))}
            </div>
            <div className='py-6'>
              {user ? (
                <>
                  <p>
                    歡迎,{' '}
                    <Link href='/me' className='hover:underline'>
                      {user.account}
                    </Link>
                  </p>
                  <form action={logout} className='mt-1'>
                    <button className='flex items-center gap-x-1 text-sm font-semibold leading-6 text-red-700 underline'>
                      <span>登出</span>
                      <ArrowRightStartOnRectangleIcon className='size-5' />
                    </button>
                  </form>
                </>
              ) : (
                <Link
                  href='/sign-in'
                  className='-mx-3 flex items-center gap-x-1 rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50'
                >
                  <span>登入</span>
                  <ArrowRightEndOnRectangleIcon className='size-5' />
                </Link>
              )}
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  )
}
