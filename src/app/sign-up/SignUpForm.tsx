'use client'

import { CreateConsignor } from '@/api/CreateConsignor'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../../catalyst-ui/button'
import { ErrorMessage, Field, Label } from '../../catalyst-ui/fieldset'
import { Input } from '../../catalyst-ui/input'

const Schema = z
  .object({
    nickname: z.string().min(1, { message: '必填' }),
    account: z
      .string()
      .min(1, { message: '必填' })
      .regex(/^[0-9a-zA-Z_.-]+$/, { message: '只能包含數字、英文字母及 _ . - 符號' }),
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
        if (result.error === '1028') {
          setError('account', { message: '此帳號已存在' })
          return
        }
        if (result.error === '1032') {
          setError('account', { message: '只能包含數字、英文字母及 _ . - 符號' })
          return
        }
        router.push('/items')
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
