'use client'

import { Configs } from '@/app/api/frontend/GetConfigs'
import { ConsignorCancelPayment } from '@/app/api/frontend/reports/ConsignorCancelPayment'
import { Record } from '@/app/api/frontend/reports/GetRecords'
import { Button } from '@/app/catalyst-ui/button'
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from '@/app/catalyst-ui/description-list'
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from '@/app/catalyst-ui/dialog'
import { ErrorMessage, Field } from '@/app/catalyst-ui/fieldset'
import { Input } from '@/app/catalyst-ui/input'
import { currencySign } from '@/app/static'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import toast from 'react-hot-toast'

export function CancelPayment({
  recordId,
  yahooCancellationFee,
  bankName,
  bankCode,
  bankAccount,
}: Omit<CancelPaymentDialogProps, 'isOpen' | 'onClose'>) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button type='button' color='indigo' onClick={() => setIsOpen(true)}>
        提交付款
      </Button>
      <CancelPaymentDialog
        recordId={recordId}
        yahooCancellationFee={yahooCancellationFee}
        bankName={bankName}
        bankCode={bankCode}
        bankAccount={bankAccount}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}

type CancelPaymentDialogProps = {
  recordId: string
} & Pick<Record, 'yahooCancellationFee'> &
  Pick<Configs, 'bankName' | 'bankCode' | 'bankAccount'> &
  ({ isOpen: boolean; onClose: () => void } | { isOpen?: never; onClose?: never })

export function CancelPaymentDialog({
  recordId,
  yahooCancellationFee,
  bankName,
  bankCode,
  bankAccount,
  isOpen = true,
  onClose,
}: CancelPaymentDialogProps) {
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
    newSearchParams.delete('cancel-payment')
    router.replace(`?${newSearchParams}`)
  }

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>支付日拍取消手續費</DialogTitle>
      <form
        onSubmit={handleSubmit(async () => {
          const res = await ConsignorCancelPayment(recordId)
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
            <DescriptionDetails>
              {currencySign('TWD')}
              {yahooCancellationFee?.toLocaleString()}
            </DescriptionDetails>

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
          <Button type='button' disabled={isSubmitting} plain onClick={onClose}>
            取消
          </Button>
          <Button type='submit' color='indigo' disabled={isSubmitting}>
            已完成匯款
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
