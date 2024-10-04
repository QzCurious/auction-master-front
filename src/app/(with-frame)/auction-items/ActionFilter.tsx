'use client'

import { WALLET_ACTION } from '@/domain/static/static-config-mappers'
import { Field, Label } from '@/catalyst-ui/fieldset'
import { Listbox, ListboxLabel, ListboxOption } from '@/catalyst-ui/listbox'
import { useRouter, useSearchParams } from 'next/navigation'

const FIELD = 'action'

const options = [
  WALLET_ACTION.data[0],
  WALLET_ACTION.data[1],
  WALLET_ACTION.data[2],
  WALLET_ACTION.data[3],
  WALLET_ACTION.data[4],
  WALLET_ACTION.data[5],
  WALLET_ACTION.data[6],
  WALLET_ACTION.data[7],
] as const

options.length satisfies typeof WALLET_ACTION.data.length

interface AuctionFilterProps {
  selected: Array<WALLET_ACTION['value']>
}

export function AuctionFilter({ selected }: AuctionFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  return (
    <form className='hidden min-w-fit space-y-10 divide-y divide-gray-200 lg:block'>
      <Field>
        <Label>操作</Label>
        <Listbox
          // multiple
          value={selected}
          onChange={(selected) => {
            const newSearchParams = new URLSearchParams(searchParams)
            newSearchParams.delete(FIELD)
            for (const value of selected) {
              newSearchParams.append(FIELD, value.toString())
            }
            router.replace(`?${newSearchParams.toString()}`)
          }}
        >
          {options.map((item) => (
            <ListboxOption key={item.key} value={item.value}>
              <ListboxLabel>{item.message}</ListboxLabel>
            </ListboxOption>
          ))}
        </Listbox>
      </Field>
    </form>
  )
}

// export function MobileFilters({ selected, statusCount }: StatusFilterProps) {
//   const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
//   const router = useRouter()
//   const searchParams = useSearchParams()

//   return (
//     <>
//       <button
//         type='button'
//         className='relative inline-flex items-center gap-x-1 lg:hidden'
//         onClick={() => setMobileFiltersOpen(true)}
//       >
//         <FunnelIcon
//           className={clsx(
//             'h-5 w-5 flex-shrink-0',
//             selected.length === 0
//               ? 'text-gray-400'
//               : 'fill-indigo-600 text-indigo-600',
//           )}
//           aria-hidden='true'
//         />
//         <span className='text-sm font-medium text-gray-700'>篩選條件</span>
//         {/* <span className='absolute left-full top-0 size-2 rounded-full bg-indigo-500'></span> */}
//       </button>

//       <Dialog
//         className='relative z-40 lg:hidden'
//         open={mobileFiltersOpen}
//         onClose={setMobileFiltersOpen}
//       >
//         <DialogBackdrop
//           transition
//           className='fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0'
//         />

//         <div className='fixed inset-0 z-40 flex'>
//           <DialogPanel
//             transition
//             className='relative ml-auto flex h-full w-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full'
//           >
//             <div className='flex items-center justify-between px-4'>
//               <h2 className='text-lg font-medium text-gray-900'>篩選條件</h2>
//               <button
//                 type='button'
//                 className='-mr-2 flex h-10 w-10 items-center justify-center p-2 text-gray-400 hover:text-gray-500'
//                 onClick={() => setMobileFiltersOpen(false)}
//               >
//                 <span className='sr-only'>Close menu</span>
//                 <XMarkIcon className='h-6 w-6' aria-hidden='true' />
//               </button>
//             </div>

//             {/* Filters */}
//             <form className='mt-4'>
//               {filters.map((section) => (
//                 <Disclosure
//                   as='div'
//                   key={section.label}
//                   className='border-t border-gray-200 pb-4 pt-4'
//                   defaultOpen
//                 >
//                   {({ open }) => (
//                     <fieldset>
//                       <legend className='w-full px-2'>
//                         <DisclosureButton className='flex w-full items-center justify-between p-2 text-gray-400 hover:text-gray-500'>
//                           <span className='text-sm font-medium text-gray-900'>
//                             {section.label}
//                           </span>
//                           <span className='ml-6 flex h-7 items-center'>
//                             <ChevronDownIcon
//                               className={clsx(
//                                 open ? '-rotate-180' : 'rotate-0',
//                                 'h-5 w-5 transform',
//                               )}
//                               aria-hidden='true'
//                             />
//                           </span>
//                         </DisclosureButton>
//                       </legend>
//                       <DisclosurePanel className='px-4 pb-2 pt-4'>
//                         <div className='space-y-6'>
//                           {section.options.map((option, optionIdx) => (
//                             <div key={option.value} className='flex items-center'>
//                               <input
//                                 id={`${section.field}-${optionIdx}-mobile`}
//                                 name={`${section.field}[]`}
//                                 defaultValue={option.value}
//                                 checked={selected.includes(option.value)}
//                                 type='checkbox'
//                                 className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
//                                 onChange={(e) => {
//                                   const { checked } = e.target
//                                   const newSearch = new URLSearchParams(searchParams)
//                                   if (checked) {
//                                     newSearch.append(
//                                       section.field,
//                                       option.value.toString(),
//                                     )
//                                     router.replace(`?${newSearch.toString()}`)
//                                   } else {
//                                     const values = newSearch
//                                       .getAll(section.field)
//                                       .filter(
//                                         (value) => value !== option.value.toString(),
//                                       )
//                                     newSearch.delete(section.field)
//                                     for (const value of values) {
//                                       newSearch.append(section.field, value)
//                                     }
//                                     router.replace(`?${newSearch.toString()}`)
//                                   }
//                                 }}
//                               />
//                               <label
//                                 htmlFor={`${section.field}-${optionIdx}-mobile`}
//                                 className={clsx(
//                                   'ml-3 text-sm',
//                                   R.isIncludedIn(option.value, showCountStatus)
//                                     ? 'text-gray-900'
//                                     : 'text-gray-500',
//                                 )}
//                               >
//                                 {option.label}{' '}
//                                 {R.isIncludedIn(option.value, showCountStatus) && (
//                                   <span>({statusCount[option.value] ?? 0})</span>
//                                 )}
//                               </label>
//                             </div>
//                           ))}
//                         </div>
//                       </DisclosurePanel>
//                     </fieldset>
//                   )}
//                 </Disclosure>
//               ))}
//             </form>
//           </DialogPanel>
//         </div>
//       </Dialog>
//     </>
//   )
// }
