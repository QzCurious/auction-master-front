'use client'

import { Avatar } from '@/catalyst-ui/avatar'
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/catalyst-ui/dropdown'
import { NavbarItem } from '@/catalyst-ui/navbar'
import { ConsignorContext } from '@/domain/auth/ConsignorContext'
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/16/solid'
import { ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline'
import { User } from '@phosphor-icons/react/dist/ssr/User'
import Link from 'next/link'
import { useContext } from 'react'
import { logout } from '../../../domain/auth/logout'

export function UserMenu() {
  const consignor = useContext(ConsignorContext)

  if (!consignor) {
    return (
      <Link
        href='/auth/sign-in'
        className='flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900'
      >
        登入
        <ArrowRightEndOnRectangleIcon className='size-5' />
      </Link>
    )
  }

  return (
    <Dropdown>
      <DropdownButton as={NavbarItem}>
        <Avatar src={consignor.avatar} initials={consignor.nickname.slice(0, 1)} />
      </DropdownButton>
      <DropdownMenu className='min-w-44 !bg-white' anchor='bottom end'>
        <DropdownHeader className='flex min-w-0 items-center gap-3'>
          <Avatar
            src={consignor.avatar}
            initials={consignor.nickname.slice(0, 1)}
            className='size-10'
            square
            alt=''
          />
          <span className='min-w-0'>
            <span className='block truncate text-sm/5 font-medium text-zinc-950 dark:text-white'>
              {consignor.nickname}
            </span>
            <span className='block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400'>
              {consignor.account}
            </span>
          </span>
        </DropdownHeader>

        <DropdownDivider />

        <DropdownItem href='/me'>
          <User />
          <DropdownLabel>帳號設定</DropdownLabel>
        </DropdownItem>

        <form action={logout} className='contents'>
          <DropdownItem type='submit'>
            <ArrowRightStartOnRectangleIcon />
            <DropdownLabel>登出</DropdownLabel>
          </DropdownItem>
        </form>
      </DropdownMenu>
    </Dropdown>
  )
}
