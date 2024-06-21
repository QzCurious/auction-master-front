'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const tabs = [
  { name: '未審核', href: '/items/draft' },
  { name: '已提交審核', href: '/items/appraising' },
  { name: '估價失敗', href: '/items/rejected' },
] as const satisfies Array<{
  name: string
  href: string
}>

interface StatusTabsProps {
  active: (typeof tabs)[number]['name']
}

export default function StatusTabs({ active: status }: StatusTabsProps) {
  const router = useRouter()

  return (
    <div className='mt-2 sm:mt-4'>
      <div className='sm:hidden'>
        <label htmlFor='tabs' className='sr-only'>
          選擇狀態
        </label>
        <select
          id='tabs'
          name='tabs'
          className='block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
          value={status}
          onChange={(event) =>
            router.replace(tabs.find((tab) => tab.name === event.target.value)!.href)
          }
        >
          {tabs.map((tab) => (
            <option key={tab.name} value={tab.name}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>
      <div className='hidden sm:block'>
        <div className='border-b border-gray-200'>
          <nav className='-mb-px flex gap-x-2' aria-label='Tabs'>
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                href={tab.href}
                className={clsx(
                  status === tab.name
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700',
                  'flex whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium',
                )}
                aria-current={status === tab.name ? 'page' : undefined}
              >
                {tab.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
