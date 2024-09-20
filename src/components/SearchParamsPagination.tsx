'use client'

import { PAGE, PaginationSchema, ROWS_PER_PAGE } from '@/domain/static/static'
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpDownIcon,
} from '@heroicons/react/20/solid'
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
        <label htmlFor='rows-per-page' className='mr-2'>
          每頁顯示筆數
        </label>
        <RowsPerPageSelect
          value={pagination.rowsPerPage}
          onChange={(value) => {
            const newSearchParams = new URLSearchParams(searchParams)
            newSearchParams.set(ROWS_PER_PAGE, value.toString())
            newSearchParams.delete(PAGE)
            router.replace(`${pathname}?${newSearchParams.toString()}`)
          }}
        />
      </div>

      <nav className='flex items-center' aria-label='Pagination'>
        <div>
          <p className='text-sm text-gray-700'>
            <span className='font-medium'>
              {count === 0 ? 0 : pagination.page * pagination.rowsPerPage + 1} ~
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
              count === 0 ||
              pagination.page === Math.ceil(count / pagination.rowsPerPage) - 1
            }
            href={pageLink(pagination.page + 1)}
            className={clsx(
              'relative ml-3 inline-flex size-7 items-center rounded-md bg-white p-1 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus-visible:outline-offset-0',
              (count === 0 ||
                pagination.page === Math.ceil(count / pagination.rowsPerPage) - 1) &&
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

export function RowsPerPageSelect({
  value,
  onChange,
}: {
  value: number
  onChange: (value: number) => void
}) {
  return (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <div className='relative inline-block align-middle'>
          <ListboxButton className='relative w-full cursor-default rounded-md bg-white py-0.5 pl-2.5 pr-6 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6'>
            <span className='block truncate'>{value}</span>
            <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1'>
              <ChevronUpDownIcon
                className='size-4 text-gray-400'
                aria-hidden='true'
              />
            </span>
          </ListboxButton>

          <ListboxOptions
            transition
            className='absolute z-10 mt-1 max-h-60 min-w-[var(--button-width)] overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm'
          >
            {unique([value, 5, 10, 20, 30])
              .sort((a, b) => a - b)
              .map((v) => (
                <ListboxOption
                  key={v}
                  className={({ focus, selected, selectedOption }) =>
                    clsx(
                      focus ? 'bg-indigo-600 text-white' : 'text-gray-900',
                      'relative cursor-default select-none py-2 pl-3 pr-2',
                      selected && 'bg-gray-100',
                    )
                  }
                  value={v}
                >
                  {({ selected, focus }) => (
                    <>
                      <span
                        className={clsx(
                          focus ? 'font-semibold' : 'font-normal',
                          'block truncate',
                        )}
                      >
                        {v}
                      </span>
                    </>
                  )}
                </ListboxOption>
              ))}
          </ListboxOptions>
        </div>
      )}
    </Listbox>
  )
}
