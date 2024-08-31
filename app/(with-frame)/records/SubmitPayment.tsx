'use client'

import { Configs } from '@/app/api/frontend/GetConfigs'
import { ConsignorSubmitPayment } from '@/app/api/frontend/reports/ConsignorSubmitPayment'
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
  DialogDescription,
  DialogTitle,
} from '@/app/catalyst-ui/dialog'
import { currencySign } from '@/app/static'
import { useState, useTransition } from 'react'
import toast from 'react-hot-toast'

export default function SubmitPayment({
  recordId,
  yahooAuctionFee,
  bankName,
  bankCode,
  bankAccount,
}: { recordId: string } & Pick<Record, 'yahooAuctionFee'> &
  Pick<Configs, 'bankName' | 'bankCode' | 'bankAccount'>) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  return (
    <div>
      <Button type='button' color='indigo' onClick={() => setIsOpen(true)}>
        提交付款
      </Button>
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>支付日拍手續費</DialogTitle>
        <DialogDescription>請將款項匯入以下銀行帳戶</DialogDescription>
        <DialogBody>
          <DescriptionList>
            <DescriptionTerm>手續費</DescriptionTerm>
            <DescriptionDetails>
              {currencySign('TWD')}
              {yahooAuctionFee?.toLocaleString()}
            </DescriptionDetails>

            <DescriptionTerm>銀行名稱</DescriptionTerm>
            <DescriptionDetails>{bankName}</DescriptionDetails>

            <DescriptionTerm>銀行代碼</DescriptionTerm>
            <DescriptionDetails>{bankCode}</DescriptionDetails>

            <DescriptionTerm>銀行帳號</DescriptionTerm>
            <DescriptionDetails>{bankAccount}</DescriptionDetails>
          </DescriptionList>
        </DialogBody>
        <DialogActions>
          <Button disabled={isPending} plain onClick={() => setIsOpen(false)}>
            取消
          </Button>
          <Button
            color='indigo'
            disabled={isPending}
            onClick={() => {
              startTransition(async () => {
                const res = await ConsignorSubmitPayment(recordId)
                if (res.error) {
                  toast.error(`操作錯誤: ${res.error}`)
                  return
                }
                toast.success('已提交付款')
                setIsOpen(false)
              })
            }}
          >
            已完成匯款
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
