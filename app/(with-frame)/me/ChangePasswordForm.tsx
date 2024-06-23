'use client'

import { changePassword } from '@/app/api/frontend/consignor/changePassword'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

const Schema = z
  .object({
    oldPassword: z.string().min(1, { message: '請輸入舊密碼' }),
    password: z.string().min(1, { message: '請輸入新密碼' }),
    confirmPassword: z.string().min(1, { message: '請再次輸入新密碼' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '請重新確認新密碼',
    path: ['confirmPassword'],
  })

export default function ChangePasswordForm() {
  const router = useRouter()
  const {
    control,
    handleSubmit,
    getValues,
    setError,
    formState: { isSubmitting, errors, isDirty },
    reset,
  } = useForm<z.infer<typeof Schema>>({
    defaultValues: {
      password: '',
      oldPassword: '',
      confirmPassword: '',
    },
    resolver: zodResolver(Schema),
  })

  return (
    <div className='grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3'>
      <div>
        <h2 className='text-base font-medium leading-6 text-gray-900'>變更密碼</h2>
        {/* <p className='mt-1 text-sm leading-6 text-gray-400'>
          Update your password associated with your account.
        </p> */}
      </div>

      <form
        className='md:col-span-2'
        onSubmit={handleSubmit(async (data) => {
          const res = await changePassword({
            oldPassword: data.oldPassword,
            password: data.password,
          })

          if (res.error === '11') {
            setError('password', { message: '新密碼不能與舊密碼相同' })
            return
          }
          if (res.error === '1003') {
            toast.error('起重新登入')
            router.push('/auth/sign-in')
            return
          }
          if (res.error === '1004') {
            setError('oldPassword', { message: '舊密碼錯誤' })
            return
          }

          toast.success('變更密碼成功')
          reset()
        })}
      >
        <div className='grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6'>
          <Controller
            name='oldPassword'
            control={control}
            render={({ field, fieldState }) => (
              <div className='col-span-full'>
                <label
                  htmlFor='oldPassword'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  當前密碼
                </label>
                <div className='mt-2'>
                  <input
                    id='oldPassword'
                    type='password'
                    autoComplete='oldPassword'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    {...field}
                  />
                </div>
                <p className='mt-2 text-sm text-red-600'>
                  {fieldState.error?.message}
                </p>
              </div>
            )}
          />

          <Controller
            name='password'
            control={control}
            render={({ field, fieldState }) => (
              <div className='col-span-full'>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  新密碼
                </label>
                <div className='mt-2'>
                  <input
                    id='password'
                    type='password'
                    autoComplete='new-password'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    {...field}
                  />
                </div>
                <p className='mt-2 text-sm text-red-600'>
                  {fieldState.error?.message}
                </p>
              </div>
            )}
          />

          <Controller
            name='confirmPassword'
            control={control}
            render={({ field, fieldState }) => (
              <div className='col-span-full'>
                <label
                  htmlFor='confirmPassword'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  確認密碼
                </label>
                <div className='mt-2'>
                  <input
                    id='confirmPassword'
                    type='password'
                    autoComplete='new-password'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    {...field}
                  />
                </div>
                <p className='mt-2 text-sm text-red-600'>
                  {fieldState.error?.message}
                </p>
              </div>
            )}
          />
        </div>

        <div className='mt-8 flex'>
          <button
            type='submit'
            className='rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'
          >
            送出
          </button>
        </div>
      </form>
    </div>
  )
}
