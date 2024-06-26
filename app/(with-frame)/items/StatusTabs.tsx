'use client'

import { ITEM_STATUS_DATA } from '@/app/api/frontend/configs.data'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const tabs = [
  { status: 'InitStatus', href: '/items/init-status' },
  { status: 'SubmitAppraisalStatus', href: '/items/submit-appraisal-status' },
  { status: 'AppraisedStatus', href: '/items/appraised-status' },
  { status: 'ConsignmentApprovedStatus', href: '/items/consignment-approved-status' },
  { status: 'AppraisalFailureStatus', href: '/items/appraisal-failure-status' },
  { status: 'ConsignmentCanceledStatus', href: '/items/consignment-canceled-status' },
] as const satisfies Array<{
  status: (typeof ITEM_STATUS_DATA)[number]['key']
  href: string
}>

interface StatusTabsProps {
  active: (typeof tabs)[number]['status']
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
            router.replace(
              tabs.find((tab) => tab.status.toString() === event.target.value)!.href,
            )
          }
        >
          {tabs.map((tab) => (
            <option key={tab.status} value={tab.status}>
              {ITEM_STATUS_DATA.find(({ key }) => key === tab.status)?.message}
            </option>
          ))}
        </select>
      </div>
      <div className='hidden sm:block'>
        <div className='border-b border-gray-200'>
          <nav className='-mb-px flex gap-x-2' aria-label='Tabs'>
            {tabs.map((tab) => (
              <Link
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
                {ITEM_STATUS_DATA.find(({ key }) => key === tab.status)?.message}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
