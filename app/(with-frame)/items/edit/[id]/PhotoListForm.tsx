'use client'

import { ITEM_STATUS } from '@/app/api/frontend/static-configs.data'
import { ConsignorDeleteItemPhoto } from '@/app/api/frontend/items/ConsignorDeleteItemPhoto'
import { ConsignorReorderItemPhoto } from '@/app/api/frontend/items/ConsignorReorderItemPhoto'
import { ConsignorUpsertItemPhoto } from '@/app/api/frontend/items/ConsignorUpsertItemPhoto'
import { Item } from '@/app/api/frontend/items/GetConsignorItems'
import { Field, Label } from '@/app/catalyst-ui/fieldset'
import { PlusIcon } from '@heroicons/react/24/outline'
import { useState, useTransition } from 'react'
import * as R from 'remeda'
import SortablePhotoList from '../../SortablePhotoList'

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

  const [photos, setPhotos] = useState(item.photos)
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
              setPhotos([
                ...photos,
                ...Array.from(files, (f) => ({
                  photo: URL.createObjectURL(f),
                  sorted: item.photos.length + 1,
                })),
              ])
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
          <SortablePhotoList
            photos={item.photos}
            onDelete={(i) => {
              startTransition(async () => {
                await ConsignorDeleteItemPhoto(item.id, i + 1)
                URL.revokeObjectURL(photos[i].photo)
                setPhotos([...photos.splice(i, 1)])
              })
            }}
            onMove={(from, to) => {
              startTransition(async () => {
                await ConsignorReorderItemPhoto(item.id, {
                  originalSorted: item.photos[from].sorted,
                  newSorted: item.photos[to].sorted,
                })
                setPhotos([
                  ...photos.slice(0, from),
                  ...photos.slice(from + 1, to + 1),
                  photos[from],
                  ...photos.slice(to + 1),
                ])
              })
            }}
          />
        </div>
      </Field>
    </div>
  )
}
