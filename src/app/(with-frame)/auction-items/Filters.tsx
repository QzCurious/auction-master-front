'use client'

import { AUCTION_ITEM_STATUS } from "@/domain/static/static-config-mappers"
import { Text } from '@/catalyst-ui/text'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import * as R from 'remeda'

const filters = [
  {
    field: 'status',
    label: '狀態',
    options: R.map(
      [
        AUCTION_ITEM_STATUS.data[0],
        AUCTION_ITEM_STATUS.data[1],
        AUCTION_ITEM_STATUS.data[2],
        AUCTION_ITEM_STATUS.data[3],
        AUCTION_ITEM_STATUS.data[4],
        AUCTION_ITEM_STATUS.data[5],
        AUCTION_ITEM_STATUS.data[6],
        AUCTION_ITEM_STATUS.data[7],
        AUCTION_ITEM_STATUS.data[8],
        AUCTION_ITEM_STATUS.data[9],
        AUCTION_ITEM_STATUS.data[10],
      ],
      ({ value, message }) => ({ label: message, value }),
    ),
  },
]

filters[0].options.length satisfies typeof AUCTION_ITEM_STATUS.data.length

interface StatusFilterProps {
  selected: Array<AUCTION_ITEM_STATUS['value']>
}

export function DesktopFilters({ selected }: StatusFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  return (
    <form className='hidden min-w-fit space-y-10 divide-y divide-gray-200 lg:block'>
      {filters.map((section, sectionIdx) => (
        <div key={section.label} className={clsx(sectionIdx !== 0 && 'pt-10')}>
          <fieldset>
            <legend className='block text-sm font-medium text-gray-900'>
              {section.label}
            </legend>
            <div className='space-y-3 pt-6'>
              {section.options.map((option, optionIdx) => (
                <div key={option.value} className='flex items-center'>
                  <input
                    id={`${section.field}-${optionIdx}`}
                    name={`${section.field}[]`}
                    defaultValue={option.value}
                    checked={selected.includes(option.value)}
                    type='checkbox'
                    className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
                    onChange={(e) => {
                      const { checked } = e.target
                      const newSearch = new URLSearchParams(searchParams)
                      newSearch.delete(section.field)

                      const newSelected = checked
                        ? [...selected, option.value]
                        : selected.filter((v) => v !== option.value)
                      for (const v of newSelected) {
                        newSearch.append(section.field, v.toString())
                      }
                      router.replace(`?${newSearch}`)
                    }}
                  />
                  <label
                    htmlFor={`${section.field}-${optionIdx}`}
                    className={clsx('ml-3 text-sm')}
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
        </div>
      ))}
    </form>
  )
}

export function MobileFilters({ selected }: StatusFilterProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  return (
    <>
      <button
        type='button'
        className='relative inline-flex items-center gap-x-1 lg:hidden'
        onClick={() => setMobileFiltersOpen(true)}
      >
        <FunnelIcon
          className={clsx(
            'h-5 w-5 flex-shrink-0',
            selected.length === 0
              ? 'text-gray-400'
              : 'fill-indigo-600 text-indigo-600',
          )}
          aria-hidden='true'
        />
        <Text className='font-medium'>篩選條件</Text>
      </button>

      <Dialog
        className='relative z-40 lg:hidden'
        open={mobileFiltersOpen}
        onClose={setMobileFiltersOpen}
      >
        <DialogBackdrop
          transition
          className='fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0'
        />

        <div className='fixed inset-0 z-40 flex'>
          <DialogPanel
            transition
            className='relative ml-auto flex h-full w-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full'
          >
            <div className='flex items-center justify-between px-4'>
              <h2 className='text-lg font-medium text-gray-900'>篩選條件</h2>
              <button
                type='button'
                className='-mr-2 flex h-10 w-10 items-center justify-center p-2 text-gray-400 hover:text-gray-500'
                onClick={() => setMobileFiltersOpen(false)}
              >
                <span className='sr-only'>Close menu</span>
                <XMarkIcon className='h-6 w-6' aria-hidden='true' />
              </button>
            </div>

            {/* Filters */}
            <form className='mt-4'>
              {filters.map((section) => (
                <Disclosure
                  as='div'
                  key={section.label}
                  className='border-t border-gray-200 pb-4 pt-4'
                  defaultOpen
                >
                  {({ open }) => (
                    <fieldset>
                      <legend className='w-full px-2'>
                        <DisclosureButton className='flex w-full items-center justify-between p-2 text-gray-400 hover:text-gray-500'>
                          <span className='text-sm font-medium text-gray-900'>
                            {section.label}
                          </span>
                          <span className='ml-6 flex h-7 items-center'>
                            <ChevronDownIcon
                              className={clsx(
                                open ? '-rotate-180' : 'rotate-0',
                                'h-5 w-5 transform',
                              )}
                              aria-hidden='true'
                            />
                          </span>
                        </DisclosureButton>
                      </legend>
                      <DisclosurePanel className='px-4 pb-2 pt-4'>
                        <div className='space-y-6'>
                          {section.options.map((option, optionIdx) => (
                            <div key={option.value} className='flex items-center'>
                              <input
                                id={`${section.field}-${optionIdx}-mobile`}
                                name={`${section.field}[]`}
                                defaultValue={option.value}
                                checked={selected.includes(option.value)}
                                type='checkbox'
                                className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
                                onChange={(e) => {
                                  const { checked } = e.target
                                  const newSearch = new URLSearchParams(searchParams)
                                  newSearch.delete(section.field)

                                  const newSelected = checked
                                    ? [...selected, option.value]
                                    : selected.filter((v) => v !== option.value)
                                  for (const v of newSelected) {
                                    newSearch.append(section.field, v.toString())
                                  }
                                  router.replace(`?${newSearch}`)
                                }}
                              />
                              <label
                                htmlFor={`${section.field}-${optionIdx}-mobile`}
                                className={clsx('ml-3 text-sm')}
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </DisclosurePanel>
                    </fieldset>
                  )}
                </Disclosure>
              ))}
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}
