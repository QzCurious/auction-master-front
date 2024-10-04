'use client'

import { Configs } from '@/api/frontend/GetConfigs'
import { ConsignorSubmitPayment } from '@/api/frontend/reports/ConsignorSubmitPayment'
import { Button } from '@/catalyst-ui/button'
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from '@/catalyst-ui/description-list'
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/catalyst-ui/dialog'
import { ErrorMessage, Field } from '@/catalyst-ui/fieldset'
import { Input } from '@/catalyst-ui/input'
import { currencySign } from '@/domain/static/static'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import CancelPayment from './CancelPayment'

export function SubmitPayment({
  title,
  recordId,
  amount,
  bankName,
  bankCode,
  bankAccount,
}: Omit<SubmitPaymentDialogProps, 'isOpen' | 'onClose'>) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button type='button' color='indigo' onClick={() => setIsOpen(true)}>
        提交付款
      </Button>
      <SubmitPaymentDialog
        title={title}
        recordId={recordId}
        amount={amount}
        bankName={bankName}
        bankCode={bankCode}
        bankAccount={bankAccount}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}

type SubmitPaymentDialogProps = {
  title: string
  recordId: string
  amount?: number
} & Pick<Configs, 'bankName' | 'bankCode' | 'bankAccount'> &
  ({ isOpen: boolean; onClose: () => void } | { isOpen?: never; onClose?: never })

export function SubmitPaymentDialog({
  title,
  recordId,
  amount,
  bankName,
  bankCode,
  bankAccount,
  isOpen = true,
  onClose,
}: SubmitPaymentDialogProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      opCode: '',
    },
  })
  onClose ??= () => {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.delete('submit-payment')
    router.replace(`?${newSearchParams}`)
  }

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <form
        id='withdrawal-form'
        onSubmit={handleSubmit(async (data) => {
          const res = await ConsignorSubmitPayment(recordId, {
            opCode: data.opCode,
          })
          if (res.error) {
            toast.error(`操作錯誤: ${res.error}`)
            return
          }
          toast.success('已提交付款')
          onClose()
        })}
      >
        <DialogBody>
          <DescriptionList>
            <DescriptionTerm>手續費</DescriptionTerm>
            {amount === undefined ? (
              <DescriptionDetails>
                <p className='text-rose-600'>發生錯誤，請聯繫客服</p>
              </DescriptionDetails>
            ) : (
              <DescriptionDetails>
                {currencySign('TWD')}
                {amount.toLocaleString()}
              </DescriptionDetails>
            )}

            <DescriptionTerm>銀行名稱</DescriptionTerm>
            <DescriptionDetails>{bankName}</DescriptionDetails>

            <DescriptionTerm>銀行代碼</DescriptionTerm>
            <DescriptionDetails>{bankCode}</DescriptionDetails>

            <DescriptionTerm>銀行帳號</DescriptionTerm>
            <DescriptionDetails>{bankAccount}</DescriptionDetails>

            <DescriptionTerm>
              <label htmlFor='withdrawal-account'>匯出帳號</label>
            </DescriptionTerm>
            <DescriptionDetails>
              <Controller
                control={control}
                name='opCode'
                rules={{
                  required: '必填',
                  pattern: { value: /^[0-9]{5}$/, message: '格式錯誤' },
                }}
                render={({ field, fieldState: { error } }) => (
                  <Field>
                    <Input
                      type='text'
                      {...field}
                      id='withdrawal-account'
                      placeholder='請輸入您的匯出帳號後五碼'
                    />
                    <ErrorMessage>{error?.message}</ErrorMessage>
                  </Field>
                )}
              />
            </DescriptionDetails>
          </DescriptionList>
        </DialogBody>
        <DialogActions>
          <CancelPayment recordId={recordId} />
          <Button
            type='submit'
            form='withdrawal-form'
            color='indigo'
            disabled={isSubmitting}
          >
            已完成匯款
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
