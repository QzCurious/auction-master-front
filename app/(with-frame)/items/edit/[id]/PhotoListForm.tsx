'use client'

import { Item } from '@/app/api/frontend/items/getItem'
import { uploadItemPhotos } from '@/app/api/frontend/items/uploadItemPhotos'
import { PlusIcon } from '@heroicons/react/24/outline'

import { ITEM_STATUS_MAP } from '@/app/api/frontend/configs.data'
import { changeItemPhotoSort } from '@/app/api/frontend/items/changeItemPhotoSort'
import { deleteItemPhoto } from '@/app/api/frontend/items/deleteItemPhoto'
import { useState, useTransition } from 'react'
import SortablePhotoList from '../../SortablePhotoList'

interface PhotoListFormProps {
  item: Item
}

export default function PhotoListForm({ item }: PhotoListFormProps) {
  const enabled = [
    ITEM_STATUS_MAP.WarehouseArrivalStatus,
    ITEM_STATUS_MAP.SubmitAppraisalStatus,
    ITEM_STATUS_MAP.AppraisalFailureStatus,
    ITEM_STATUS_MAP.AppraisedStatus,
    ITEM_STATUS_MAP.ConsignmentApprovedStatus,
    ITEM_STATUS_MAP.WarehouseArrivalStatus,
  ].includes(item.status)

  const [photos, setPhotos] = useState(item.photos)
  const [isPending, startTransition] = useTransition()

  return (
    <div className='relative'>
      {isPending && (
        <div className='pointer-events-none absolute inset-0 z-10 animate-pulse rounded bg-black opacity-40' />
      )}

      <label htmlFor='file-upload' className='inline-flex items-center gap-x-2'>
        <span className='text-sm font-medium leading-6 text-gray-900'>
          物品圖片 {enabled && <span className='text-gray-500'>(自動儲存)</span>}
        </span>
        {enabled && (
          <PlusIcon className='h-5 w-5 rounded bg-indigo-500 p-0.5 text-white hover:bg-indigo-400' />
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
                await uploadItemPhotos(item.id, formData)
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
      </label>

      <div className='mt-2 isolate'>
        <SortablePhotoList
          photos={item.photos}
          onDelete={(i) => {
            startTransition(async () => {
              await deleteItemPhoto(item.id, i + 1)
              URL.revokeObjectURL(photos[i].photo)
              setPhotos([...photos.splice(i, 1)])
            })
          }}
          onMove={(from, to) => {
            startTransition(async () => {
              await changeItemPhotoSort(item.id, {
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
    </div>
  )
}
