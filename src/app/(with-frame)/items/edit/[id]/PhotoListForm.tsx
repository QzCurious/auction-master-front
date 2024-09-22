'use client'

import { ConsignorDeleteItemPhoto } from '@/api/frontend/items/ConsignorDeleteItemPhoto'
import { ConsignorReorderItemPhoto } from '@/api/frontend/items/ConsignorReorderItemPhoto'
import { ConsignorUpsertItemPhoto } from '@/api/frontend/items/ConsignorUpsertItemPhoto'
import { Item } from '@/api/frontend/items/GetConsignorItems'
import { ITEM_STATUS } from '@/domain/static/static-config-mappers'
import { Field, Label } from '@/catalyst-ui/fieldset'
import {
  DraggableHandler,
  DraggableList,
  DraggableListItem,
} from '@/components/DraggableList'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { PhotoIcon } from '@heroicons/react/24/solid'
import { ArrowsOutLineHorizontal } from '@phosphor-icons/react/dist/ssr/ArrowsOutLineHorizontal'
import { useTransition } from 'react'
import * as R from 'remeda'

interface PhotoListFormProps {
  item: Item
}

export default function PhotoListForm({ item }: PhotoListFormProps) {
  const enabled = R.isIncludedIn(item.status, [
    ITEM_STATUS.enum('WarehouseArrivalStatus'),
    ITEM_STATUS.enum('SubmitAppraisalStatus'),
    ITEM_STATUS.enum('AppraisalFailureStatus'),
    ITEM_STATUS.enum('AppraisedStatus'),
    ITEM_STATUS.enum('ConsignmentApprovedStatus'),
    ITEM_STATUS.enum('WarehouseArrivalStatus'),
  ])

  const [isPending, startTransition] = useTransition()

  return (
    <div className='relative'>
      {isPending && (
        <div className='pointer-events-none absolute inset-0 z-10 animate-pulse rounded bg-black opacity-40' />
      )}

      {enabled && (
        <input
          id='file-upload'
          name='file-upload'
          type='file'
          accept='image/png, image/jpeg, image/jpg'
          hidden
          multiple
          onChange={async (e) => {
            const files = e.target.files
            if (!files) return
            const formData = new FormData()
            for (let i = 0; i < files.length; i++) {
              formData.append('photo', files[i])
              formData.append('sorted', `${i + item.photos.length + 1}`)
            }
            startTransition(async () => {
              await ConsignorUpsertItemPhoto(item.id, formData)
            })
          }}
        />
      )}

      <Field>
        <Label className='inline-flex items-center gap-x-2'>
          物品圖片 {enabled && <span className='text-gray-500'>(自動儲存)</span>}
          {enabled && (
            <button onClick={() => document.getElementById('file-upload')?.click()}>
              <span className='sr-only'>新增圖片</span>
              <PlusIcon className='h-5 w-5 rounded bg-indigo-500 p-0.5 text-white hover:bg-indigo-400' />
            </button>
          )}
        </Label>

        <div className='isolate' data-slot='control'>
          {item.photos.length === 0 ? (
            <div className='flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10'>
              <div className='text-center'>
                <PhotoIcon
                  className='mx-auto h-12 w-12 text-gray-300'
                  aria-hidden='true'
                />
                <p className='mt-2 text-xs leading-5 text-gray-600'>
                  支援 PNG, JPG, JPEG
                </p>
              </div>
            </div>
          ) : (
            <DraggableList
              onSwap={(from, to) => {
                startTransition(async () => {
                  await ConsignorReorderItemPhoto(item.id, {
                    originalSorted: item.photos[from].sorted,
                    newSorted: item.photos[to].sorted,
                  })
                })
              }}
            >
              {item.photos.map((f, i) => (
                <DraggableListItem key={f.sorted} className='relative'>
                  <article className='aspect-h-7 aspect-w-10 relative block w-60 overflow-hidden rounded-lg bg-gray-100'>
                    <img
                      src={f.photo}
                      className='pointer-events-none object-contain'
                      alt=''
                    />
                  </article>
                  {/* {error && <p className='text-end text-sm text-red-600'>{error}</p>} */}

                  <div className='absolute right-0 top-0 z-20 flex w-fit items-center gap-x-2 pr-3 pt-1'>
                    <DraggableHandler>
                      <span className='sr-only'>Drag to move</span>
                      <ArrowsOutLineHorizontal className='size-7 rounded-full bg-white/80 stroke-2 p-1 text-gray-400 hover:bg-white hover:text-gray-600' />
                    </DraggableHandler>
                    <button
                      type='button'
                      onClick={() => {
                        startTransition(async () => {
                          await ConsignorDeleteItemPhoto(item.id, i + 1)
                        })
                      }}
                    >
                      <span className='sr-only'>Delete</span>
                      <XMarkIcon className='size-7 rounded-full bg-white/80 stroke-2 p-1 text-gray-400 hover:bg-white hover:text-gray-600' />
                    </button>
                  </div>
                </DraggableListItem>
              ))}
            </DraggableList>
          )}
        </div>
      </Field>
    </div>
  )
}
