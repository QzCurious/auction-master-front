'use client'

import { Configs } from '@/app/api/frontend/configs'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'

const tabs = [
  { name: '未審核', href: '/items/draft', status: 'InitStatus' },
  { name: '已提交審核', href: '/items/appraising', status: 'SubmitAppraisalStatus' },
  { name: '審核通過', href: '/items/appraised', status: 'AppraisedStatus' },
] satisfies Array<{
  name: string
  href: string
  status: Configs['itemStatus'][number]['key']
}>

interface StatusTabsProps {
  status: (typeof tabs)[number]['status']
}

export default function StatusTabs({ status }: StatusTabsProps) {
  const router = useRouter()

  return (
    <div>
      <div className='sm:hidden'>
        <label htmlFor='tabs' className='sr-only'>
          選擇狀態
        </label>
        <select
          id='tabs'
          name='tabs'
          className='block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
          value={status}
          onChange={(event) => router.replace(event.target.value)}
        >
          {tabs.map((tab) => (
            <option key={tab.name} value={tab.href}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>
      <div className='hidden sm:block'>
        <div className='border-b border-gray-200'>
          <nav className='-mb-px flex gap-x-2' aria-label='Tabs'>
            {tabs.map((tab) => (
              <a
                key={tab.status}
                href={tab.href}
                className={clsx(
                  status === tab.status
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700',
                  'flex whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium',
                )}
                aria-current={status === tab.status ? 'page' : undefined}
              >
                {tab.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
