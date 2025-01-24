import { GetConfigs } from '@/api/frontend/GetConfigs'
import docStyle from '@/app/doc.module.scss'
import { HandleApiError } from '@/domain/api/HandleApiError'
import Decimal from 'decimal.js-light'

export async function Content() {
  const configsRes = await GetConfigs()

  if (configsRes.error) {
    return <HandleApiError error={configsRes.error} />
  }

  const rate = new Decimal(configsRes.data.commissionRate)
    .add(configsRes.data.yahooAuctionFeeRate)
    .mul(100)
    .toString()

  return (
    <ul
      style={{ listStyleType: 'upper-alpha' }}
      className='mt-4 pl-6 [&>li>ol]:pl-5 [&>li>ul]:pl-5'
    >
      <li>
        <span className='font-bold'>賣家會員資格</span>
        <ul>
          <li>賣家須完成註冊，成為本平台會員後，方可使用交易相關功能。</li>
        </ul>
      </li>
      <li>
        <span className='font-bold'>會員操作說明</span>
        <ul>
          <li>
            成為會員後，賣家可自行於本平台網站上執行交易操作，包括建立交易檔案、追蹤進度，無需透過客服協助。
          </li>
        </ul>
      </li>

      <li>
        <span className='font-bold'>交易形式</span>
        <p>交易方式分為以下三種：</p>
        <ol>
          <li>
            <span className='font-bold'>賣斷交易</span>
            ：賣家與本平台議定價格後，由本平台立刻完成收購。
          </li>
          <li>
            <span className='font-bold'>定價銷售</span>
            ：賣家自訂價格，物品由本平台上架至「日本雅虎拍賣」，以直購方式銷售。物品若售出，本平台將根據物品價格，
            <span className={docStyle.red}>手續費{rate}%</span>
            後支付款項予賣家，完成物品收購。
          </li>
          <li>
            <span className='font-bold'>期約金額收購</span>
            ：本平台依據物品狀況評估價值，設定期約收購價格，並上架至「日本雅虎拍賣」進行標售。拍賣結束後，本平台將根據最終結標金額，扣除
            <span className={docStyle.red}>手續費{rate}%</span>
            後支付款項予賣家，完成物品收購。
          </li>
        </ol>
      </li>
      <li>
        <span className='font-bold'>初步估價程序</span>
        <ul>
          <li>
            本平台將根據賣家上傳之照片進行物品初步估價。請確保照片清晰完整，並盡量包含盒裝條碼及證紙，以便鑑定。
          </li>
        </ul>
      </li>
      <li>
        <span className='font-bold'>估價結果查詢</span>
        <p>賣家可於本平台網站查詢估價結果，分為以下3種情況：</p>
        <ol>
          <li>
            <span className='font-bold'>已估價</span>
            ：物品可鑑定且價值達新臺幣500元以上，符合送拍效益，本平台將提供相應估值供賣家參考與確認。
          </li>
          <li>
            <span className='font-bold'>估價失敗</span>
            ：物品因無法鑑定或價值不足新臺幣500元，不符合送拍效益，故本平台不提供估價及交易服務。
          </li>
          <li>
            <span className='font-bold'>其他選擇</span>
            ：若物品鑑定估價不足新臺幣500元，賣家可選擇由本平台協助將物品上架至台灣相關臉書社團進行販售，惟需酌收售出價格的50%作為手續費。
          </li>
        </ol>
      </li>
      <li>
        <span className='font-bold'>估價結果處理</span>
        <ul>
          <li>
            若賣家不同意估價結果，可選擇取消交易；若同意，則需將物品寄送或親送至本平台倉儲據點。
          </li>
        </ul>
      </li>
      <li>
        <span className='font-bold'>免運費條件</span>
        <ul>
          <li>
            初步估價達新臺幣500元以上之物品，若總數量達20件或以上，
            <span className={docStyle.red}>本平台可提供免運費之優惠服務。</span>
          </li>
        </ul>
      </li>
      <li>
        <span className='font-bold'>非正版物品處理</span>
        <ul>
          <li>
            本平台不收受非正版物品。若經檢測確認為盜版，賣家須自行負擔運費取回物品。對於屢次違規、惡意侵權或涉及重大版權爭議的賣家，本平台將採取以下措施：
            <ol className='pl-5'>
              <li>列入黑名單，永久停用帳號。</li>
              <li>配合相關權利人進行法律追訴。</li>
              <li>若違規行為導致本平台或相關第三方蒙受損失，將依法追究賠償責任。</li>
            </ol>
          </li>
        </ul>
      </li>
      <li>
        <span className='font-bold'>後續估價與取消交易</span>
        <ul>
          <li>
            本平台將於收到物品後進行檢查，必要時可能再次調整估價。若雙方對估價結果無法達成共識，交易
            <span className={docStyle.red}>可</span>
            取消，物品退回賣家；若雙方同意估價結果，交易即正式成立。
          </li>
          <li className={docStyle.red}>
            取消交易時，賣家需自行負擔寄回物品之運費，以及相關之作業費用：
            <ol className='pl-5'>
              <li>「賣斷交易」的形式下，取消交易之作業費用為新台幣＄2,000元。</li>
              <li>
                「定價銷售」或「期約金額收購」的形式下，取消交易之作業費用為新台幣＄500元。
              </li>
            </ol>
          </li>
        </ul>
      </li>

      <li>
        <span className='font-bold'>交易完成與付款</span>
        <ul>
          <li>
            賣斷交易：本平台會立即將款項撥至賣家的會員帳戶，賣家可隨時透過「帳戶紀錄」查詢並申請提領。
          </li>
          <li>
            定價銷售與期約金額收購：待物品於「日本雅虎拍賣」完成結標後，本平台將扣除30%手續費後的拍賣所得款項撥至賣家的會員帳戶，賣家可隨時透過「帳戶紀錄」查詢並申請提領。
          </li>
          <li>
            提領須知：賣家提交提領申請後，本平台將於當月15日或次月1日，將款項匯至賣家設定的銀行帳戶；
            <span className={docStyle.red}>
              如遇例假日，則順延至下一個工作日處理。
            </span>
          </li>
        </ul>
      </li>
      <li>
        <span className='font-bold'>最低保障金額</span>
        <ul>
          <li>
            本平台承諾提供「最低保障金額」。若拍賣結標金額低於本平台估值之最低價格，本平台將於拍賣後2至3週內，支付等同於最低估值扣除30%手續費之款項予賣家。例：若物品最低估值為1000日圓，最終結標金額僅100日圓，本平台仍將支付賣家700日圓（1000
            × (1 - 30%)）。
          </li>
          <li>
            若物品於「日本雅虎拍賣」結標金額高於本平台估值之最低價格，但出價方最後棄標不完成交易，則本平台有以下3種處理方式可供賣家選擇：
            <ol className='pl-5'>
              <li>本平台以等同於最低估值扣除30%手續費之款項，向賣家收購此物品。</li>
              <li>本平台將此物品重新上架至「日本雅虎拍賣」進行標售。</li>
              <li className={docStyle.red}>由賣家主動提出取消交易。</li>
            </ol>
          </li>
        </ul>
      </li>
    </ul>
  )
}
