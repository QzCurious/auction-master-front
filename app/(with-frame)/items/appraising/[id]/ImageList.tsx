'use client'

import { changeItemPhotoSort } from '@/app/api/frontend/items/changeItemPhotoSort'
import { deleteItemPhoto } from '@/app/api/frontend/items/deleteItemPhoto'
import { Item } from '@/app/api/frontend/items/getItem'
import { uploadItemPhotos } from '@/app/api/frontend/items/uploadItemPhotos'
import { PlusIcon } from '@heroicons/react/24/outline'
import { PhotoIcon } from '@heroicons/react/24/solid'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import ImageItem from '../../ImageItem'

const Schema = z.object({
  photos: z
    .array(
      z.union([
        z.object({ photo: z.string(), sorted: z.number() }),
        z
          .instanceof(File)
          .refine((file) => file.size <= 20 * 1024 * 1024, { message: '上限 20MB' }),
      ]),
    )
    .min(1, { message: '必填' })
    .max(30, { message: '上限 30 張' }),
})

export default function ImageList({
  itemId,
  photos,
  enabled,
}: {
  itemId: Item['id']
  photos: z.infer<typeof Schema>['photos']
  enabled: boolean
}) {
  const { control, formState } = useForm({
    defaultValues: { photos },
    resolver: zodResolver(Schema),
  })
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control,
    name: 'photos',
  })
  const [isPending, startTransition] = useTransition()

  return (
    <div className='relative col-span-full'>
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
                formData.append('sorted', `${i + photos.length + 1}`)
              }
              startTransition(async () => {
                await uploadItemPhotos(itemId, formData)
                for (const f of Array.from(files)) {
                  append(f)
                }
              })
            }}
          />
        )}
      </label>
      {fields.length === 0 ? (
        <div className='mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10'>
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
        <div className='overflow-x-auto px-1 pb-3 pt-2'>
          <ul role='list' className='flex gap-x-4'>
            {fields.map((field, i) => (
              <li key={field.id}>
                <Controller
                  control={control}
                  name={`photos.${i}`}
                  render={({ field, fieldState }) => (
                    <ImageItem
                      src={'photo' in field.value ? field.value.photo : field.value}
                      error={fieldState.error?.message}
                      onDelete={
                        !enabled
                          ? undefined
                          : async () => {
                              startTransition(async () => {
                                await deleteItemPhoto(itemId, i + 1)
                                remove(i)
                              })
                            }
                      }
                      onMoveUp={
                        !enabled
                          ? undefined
                          : i === 0
                            ? false
                            : async () => {
                                startTransition(async () => {
                                  await changeItemPhotoSort(itemId, {
                                    originalSorted: i + 1,
                                    newSorted: i,
                                  })
                                  move(i, i - 1)
                                })
                              }
                      }
                      onMoveDown={
                        !enabled
                          ? undefined
                          : i === fields.length - 1
                            ? false
                            : async () => {
                                startTransition(async () => {
                                  await changeItemPhotoSort(itemId, {
                                    originalSorted: i + 1,
                                    newSorted: i + 2,
                                  })
                                  move(i, i + 1)
                                })
                              }
                      }
                    />
                  )}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className='mt-1 text-sm text-red-600'>{formState.errors.photos?.message}</p>
    </div>
  )
}
