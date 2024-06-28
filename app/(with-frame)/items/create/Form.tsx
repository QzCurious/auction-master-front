'use client'
import { ITEM_TYPE_MAP } from '@/app/api/frontend/configs.data'
import { createItem } from '@/app/api/frontend/items/createItem'
import { Button } from '@/app/catalyst-ui/button'
import { Checkbox, CheckboxField } from '@/app/catalyst-ui/checkbox'
import { ErrorMessage, Field, Label } from '@/app/catalyst-ui/fieldset'
import { Input } from '@/app/catalyst-ui/input'
import ErrorAlert from '@/app/components/alerts/ErrorAlert'
import { PlusIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import {
  Control,
  Controller,
  useController,
  useFieldArray,
  useForm,
} from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { z } from 'zod'
import SortablePhotoList from '../SortablePhotoList'

const Schema = z.object({
  name: z.string().min(1, { message: '必填' }),
  type: z.number(),
  reservePrice: z.number({ message: '必填' }),
  photos: z
    .array(
      z
        .object({
          file: z.instanceof(File, { message: '必填' }),
        })
        .refine(({ file }) => file.size <= 20 * 1024 * 1024, {
          message: '上限 20MB',
        }),
    )
    .min(1, { message: '必填' })
    .max(30, { message: '上限 30 張' }),
})

export default function From() {
  const {
    control,
    handleSubmit,
    getValues,
    setError,
    formState: { isSubmitting, errors, isDirty },
    reset,
  } = useForm<z.input<typeof Schema>>({
    defaultValues: {
      name: '',
      type: 0,
      reservePrice: '' as any,
      photos: [],
    },
    resolver: zodResolver(Schema),
  })
  const router = useRouter()

  return (
    <div>
      {errors.root?.message && <ErrorAlert message={errors.root.message} />}
      <form
        className='col-span-7 mt-10'
        onSubmit={handleSubmit(async (data) => {
          const formData = new FormData()
          formData.append('name', data.name)
          formData.append('type', data.type.toString())
          formData.append('reservePrice', data.reservePrice.toString())
          for (let i = 0; i < data.photos.length; i++) {
            const f = data.photos[i]
            formData.append('photo', f.file)
            formData.append('sorted', `${i + 1}`)
          }
          const res = await createItem(formData)
          if (res.error) {
            setError('root', { message: `Failed to create item: ${res.error}` })
            return
          }
          toast.success('新增成功')
          router.push('/items')
        })}
      >
        <div className='grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
          <Controller
            control={control}
            name='type'
            render={({ field: { ref, ...field } }) => (
              <CheckboxField className='col-span-full'>
                <Checkbox
                  {...field}
                  checked={field.value === ITEM_TYPE_MAP.FixedPriceItemType}
                  onChange={(v) =>
                    field.onChange(v ? ITEM_TYPE_MAP.FixedPriceItemType : 0)
                  }
                />
                <Label>是否為定價物品</Label>
              </CheckboxField>
            )}
          />

          <Controller
            control={control}
            name='name'
            render={({ field, fieldState }) => (
              <Field className='sm:col-span-3'>
                <Label>物品名稱</Label>
                <Input type='text' autoComplete='off' {...field} />
                {fieldState.error && (
                  <ErrorMessage>{fieldState.error.message}</ErrorMessage>
                )}
              </Field>
            )}
          />

          <Controller
            control={control}
            name='reservePrice'
            render={({ field, fieldState }) => (
              <Field className='sm:col-span-3'>
                <Label>期望價格</Label>
                <Input
                  type='number'
                  autoComplete='off'
                  {...field}
                  onChange={(e) => {
                    field.onChange(
                      e.target.value === '' ? '' : parseFloat(e.target.value),
                    )
                  }}
                />
                {fieldState.error && (
                  <ErrorMessage>{fieldState.error.message}</ErrorMessage>
                )}
              </Field>
            )}
          />

          <div className='col-span-full'>
            <UploadImage control={control} />
          </div>
        </div>

        <div className='mt-6 flex items-center gap-x-4'>
          <div className='mx-auto'></div>

          {process.env.NODE_ENV === 'development' && (
            <Button outline onClick={() => console.log(getValues())}>
              Log values
            </Button>
          )}

          {/* {isDirty && (
            <Button outline onClick={() => reset()}>
              重設
            </Button>
          )} */}

          <Button type='submit' color='indigo' loading={isSubmitting}>
            送出
          </Button>
        </div>
      </form>
    </div>
  )
}

function UploadImage({ control }: { control: Control<z.input<typeof Schema>> }) {
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control,
    name: 'photos',
  })
  const { field, formState } = useController({
    control,
    name: 'photos',
  })
  const { createUrl, revokeUrl } = useObjectUrl()

  return (
    <div className='relative'>
      <input
        type='file'
        id='file-upload'
        hidden
        multiple
        onChange={(e) => {
          const files = e.target.files
          if (!files) return
          for (const file of Array.from(files)) {
            append({ file })
          }
        }}
      />

      <Field>
        <Label className='inline-flex items-center gap-x-2'>
          物品圖片
          <button onClick={() => document.getElementById('file-upload')?.click()}>
            <span className='sr-only'>新增圖片</span>
            <PlusIcon className='h-5 w-5 rounded bg-indigo-500 p-0.5 text-white hover:bg-indigo-400' />
          </button>
        </Label>

        <div className='relative overflow-hidden' data-slot='control'>
          <SortablePhotoList
            photos={field.value.map(({ file }, i) => ({
              photo: createUrl(file),
              sorted: i + 1,
            }))}
            onMove={move}
            onDelete={(i) => {
              remove(i)
              revokeUrl(field.value[i].file)
            }}
          />
        </div>
        {formState.errors.photos?.message && (
          <ErrorMessage>{formState.errors.photos?.message}</ErrorMessage>
        )}
      </Field>
    </div>
  )
}

function useObjectUrl() {
  const [urlMap] = useState(() => new Map<File, string>())

  const createUrl = useCallback(
    (file: File) => {
      const url = urlMap.get(file) ?? URL.createObjectURL(file)
      if (!urlMap.has(file)) {
        urlMap.set(file, url)
      }
      return url
    },
    [urlMap],
  )

  const revokeUrl = useCallback(
    (file: File) => {
      const url = urlMap.get(file)
      if (url) {
        URL.revokeObjectURL(url)
        urlMap.delete(file)
      }
    },
    [urlMap],
  )

  return { createUrl, revokeUrl }
}
