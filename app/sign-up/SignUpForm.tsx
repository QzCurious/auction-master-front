'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { CreateConsignor } from '../api/CreateConsignor'
import { Button } from '../catalyst-ui/button'
import { ErrorMessage, Field, Label } from '../catalyst-ui/fieldset'
import { Input } from '../catalyst-ui/input'

const Schema = z
  .object({
    nickname: z.string().min(1, { message: '必填' }),
    account: z.string().min(1, { message: '必填' }),
    password: z.string().min(1, { message: '必填' }),
    conformPassword: z.string().min(1, { message: '必填' }),
  })
  .refine((data) => data.password === data.conformPassword, {
    message: '請重新確認密碼',
    path: ['conformPassword'],
  })

export function SignUpForm() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<z.input<typeof Schema>>({
    defaultValues: {
      nickname: '',
      account: '',
      password: '',
      conformPassword: '',
    },
    resolver: zodResolver(Schema),
  })
  const router = useRouter()

  return (
    <form
      className='space-y-6'
      onSubmit={handleSubmit(async (data) => {
        const result = await CreateConsignor(data)
        if (result.error === '1601') {
          setError('account', { message: 'Account already exists' })
          return
        }
        router.push('/')
      })}
    >
      <Controller
        control={control}
        name='nickname'
        render={({ field, fieldState }) => (
          <Field>
            <Label>暱稱</Label>
            <Input type='text' {...field} />
            {fieldState.error && (
              <ErrorMessage>{fieldState.error.message}</ErrorMessage>
            )}
          </Field>
        )}
      />

      <Controller
        control={control}
        name='account'
        render={({ field, fieldState }) => (
          <Field>
            <Label>帳號</Label>
            <Input type='text' {...field} />
            {fieldState.error && (
              <ErrorMessage>{fieldState.error.message}</ErrorMessage>
            )}
          </Field>
        )}
      />

      <Controller
        control={control}
        name='password'
        render={({ field, fieldState }) => (
          <Field>
            <Label>密碼</Label>
            <Input type='password' autoComplete='current-password' {...field} />
            {fieldState.error && (
              <ErrorMessage>{fieldState.error.message}</ErrorMessage>
            )}
          </Field>
        )}
      />

      <Controller
        control={control}
        name='conformPassword'
        render={({ field, fieldState }) => (
          <Field>
            <Label>確認密碼</Label>
            <Input type='password' autoComplete='off' {...field} />
            {fieldState.error && (
              <ErrorMessage>{fieldState.error.message}</ErrorMessage>
            )}
          </Field>
        )}
      />

      {/* <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <input
            id='remember-me'
            name='remember-me'
            type='checkbox'
            className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600'
          />
          <label
            htmlFor='remember-me'
            className='ml-3 block text-sm leading-6 text-gray-700'
          >
            Remember me
          </label>
        </div>
      </div> */}

      <div>
        <Button
          type='submit'
          loading={isSubmitting}
          color='indigo'
          className='w-full'
        >
          註冊
        </Button>
      </div>
    </form>
  )
}
