'use client'

import { PAGE, PaginationSchema, ROWS_PER_PAGE } from '@/app/static'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { unique } from 'remeda'

export function SearchParamsPagination({ count }: { count: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const pagination = PaginationSchema.parse(Object.fromEntries(searchParams))

  function pageLink(newPage: number) {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set(PAGE, newPage.toString())
    return `${pathname}?${newSearchParams.toString()}`
  }

  return (
    <div className='mt-10 flex flex-wrap items-center justify-end gap-x-4 gap-y-3 text-sm text-gray-700 sm:gap-x-6'>
      <div>
        <label htmlFor='rows-per-page'>每頁顯示筆數</label>
        <select
          value={pagination.rowsPerPage}
          style={{
            backgroundSize: '1rem',
            backgroundPosition: 'right 0.25rem center',
            padding: '0 1.25rem 0 0.5rem',
          }}
          className='ml-2 rounded-md'
          onChange={(e) => {
            const newSearchParams = new URLSearchParams(searchParams)
            newSearchParams.set(ROWS_PER_PAGE, e.target.value)
            newSearchParams.delete(PAGE)
            router.replace(`${pathname}?${newSearchParams.toString()}`)
          }}
        >
          {unique([pagination[ROWS_PER_PAGE], 5, 10, 20, 30]).map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <nav className='flex items-center' aria-label='Pagination'>
        <div>
          <p className='text-sm text-gray-700'>
            <span className='font-medium'>
              {pagination.page * pagination.rowsPerPage + 1} ~
            </span>{' '}
            <span className='font-medium'>
              {Math.min((pagination.page + 1) * pagination.rowsPerPage, count)}
            </span>
            , <span className='font-medium'>共 {count} 筆</span>
          </p>
        </div>
        <div className='ml-2 flex items-center sm:ml-4'>
          <Link
            aria-disabled={pagination.page === 0}
            href={pageLink(pagination.page - 1)}
            className={clsx(
              'relative inline-flex size-7 items-center rounded-md bg-white p-1 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus-visible:outline-offset-0',
              pagination.page === 0 && 'pointer-events-none opacity-40',
            )}
          >
            <ChevronLeftIcon />
          </Link>
          <Link
            aria-disabled={
              pagination.page === Math.ceil(count / pagination.rowsPerPage) - 1
            }
            href={pageLink(pagination.page + 1)}
            className={clsx(
              'relative ml-3 inline-flex size-7 items-center rounded-md bg-white p-1 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus-visible:outline-offset-0',
              pagination.page === Math.ceil(count / pagination.rowsPerPage) - 1 &&
                'pointer-events-none opacity-40',
            )}
          >
            <ChevronRightIcon />
          </Link>
        </div>
      </nav>
    </div>
  )
}
