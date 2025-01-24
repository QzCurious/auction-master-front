import { GetConfigs } from '@/api/frontend/GetConfigs'
import docStyle from '@/app/doc.module.scss'
import { HandleApiError } from '@/domain/api/HandleApiError'
import { toPercent } from '@/domain/static/static'
import clsx from 'clsx'
import Decimal from 'decimal.js-light'
import Image from 'next/image'
import img3 from './00ca75c9-d562-4889-940a-7ef70ebe4f5c.jpg'
import img1 from './257b28e5-2a45-4ef5-960d-0d5b6cb9bbfb.jpg'
import img5 from './658b5486-2672-4341-a7e4-f21771dc241f.jpg'
import img2 from './a016d492-1e10-4896-96f8-babbc0d4ac89.jpg'
import img7 from './a29d1297-f0f4-49c0-9036-ca1594a139f0.jpg'
import img8 from './b9f218c7-c4e9-4817-81c4-1f66044b4a58.jpg'
import img6 from './e4f018bc-8fd4-46de-9a11-8ce1770de945.jpg'
import img4 from './e97cf45b-6137-4b43-b896-87c355d1837c.jpg'

export default async function Page() {
  const configsRes = await GetConfigs()

  if (configsRes.error) {
    return <HandleApiError error={configsRes.error} />
  }

  const rate = new Decimal(configsRes.data.commissionRate)
    .add(configsRes.data.yahooAuctionFeeRate)
    .toNumber()

  return (
    <main className={clsx('mx-auto max-w-2xl px-4', docStyle.doc)}>
      <h1 className='h1'>交易服務相關</h1>

      <ul className='mt-4 pl-6'>
        <li>
          <p>我們提供什麼服務？</p>
          <ol className='pl-5'>
            <li>
              <span className='font-bold'>賣斷交易</span>
              ：由您自行為商品訂價，直接販售給我們；在您我雙方對訂價皆有共識的前提下，交易即成立。
            </li>
            <li>
              <span className='font-bold'>定價銷售</span>
              ：由您自行為商品訂價，讓我們幫您將物品上架至「日本雅虎拍賣」，以直購方式銷售。
            </li>
            <li>
              <span className='font-bold'>期約金額收購</span>
              ：我們會依據您物品的狀況評估價值，設定期約收購價格，並上架至「日本雅虎拍賣」進行標售。拍賣結束後，我們會根據最終結標金額，扣除
              {toPercent(rate)}手續費後支付給您，買下您的物品。
            </li>
          </ol>
        </li>

        <li>
          <p>如何使用「賣斷交易」服務？</p>
          <ol className='pl-5'>
            <li>
              在網站首頁上方工具列中，點擊進入「我的物品」頁面，選擇「+ 新增物品」。
              <Image
                src={img1}
                className='border border-blue-700'
                alt=''
                quality={100}
              />
            </li>
            <li>
              勾選「是否為定價商品」，並填妥其他資料，按下「送出」，等候我們回覆。
              <Image
                src={img2}
                className='border border-blue-700'
                alt=''
                quality={100}
              />
            </li>
            <li>
              之後您就能在「我的物品」裡面，查詢到自己物品的狀態，包含我們的鑑價結果、待確認事項、物品進度….等等一切資訊，我們都會詳細為您揭露。
            </li>
            <li>
              點擊欲查詢的物品，即可查看物品狀態頁面。若為「已估價」之物品，在頁面右上可以查詢到我們提供的估價結果；在頁面右下的「物品進度」，則列舉出完整的交易流程，並提示您目前進行到哪個階段。
              <div className='space-y-2'>
                <Image
                  src={img4}
                  className='border border-blue-700'
                  alt=''
                  quality={100}
                />
                <Image
                  src={img5}
                  className='border border-blue-700'
                  alt=''
                  quality={100}
                />
                <Image
                  src={img3}
                  className='border border-blue-700'
                  alt=''
                  quality={100}
                />
              </div>
            </li>
            <li>
              若您同意我方所開出的收購金額，即可選擇
              <span className={docStyle.red}>「賣斷交易」，將商品直接賣給我們。</span>
              您必須將物品寄來、或親送至我方倉儲據點，由我方再次確認；若您有超過20個以上、收購金額超過新台幣＄500元的物品，可享有寄件免運費之優惠。
            </li>
            <li>
              請注意，我方有可能根據物品的實際狀態而調整收購金額，您可以在上述頁面中查詢到完整而透明的現況資訊，用以判斷是否繼續完成交易。
            </li>
            <li>
              若您同意我方經鑑定過物品實際狀況後所提出的最終收購金額，則交易即可確認完成。您的物品歸我們所有，我們則將款項撥至您的「會員帳戶」→「帳戶紀錄」，讓您隨時提領；本平台將於當月15日或次月1日，將您所提領的款項匯至您設定的銀行帳戶。
            </li>
          </ol>
        </li>

        <li>
          <p>如何使用「定價銷售」服務？</p>
          <ol className='pl-5'>
            <li>
              在網站首頁上方工具列中，點擊進入「我的物品」頁面，選擇「+ 新增物品」。
              <Image
                src={img1}
                className='border border-blue-700'
                alt=''
                quality={100}
              />
            </li>

            <li>
              勾選「是否為定價商品」，並填妥其他資料，按下「送出」，等候我們回覆。
              <Image
                src={img2}
                className='border border-blue-700'
                alt=''
                quality={100}
              />
            </li>

            <li>
              之後您就能在「我的物品」裡面，查詢到自己物品的狀態，包含我們的鑑價結果、待確認事項、物品進度….等等一切資訊，我們都會詳細為您揭露。
            </li>
            <li>
              點擊欲查詢的物品，即可查看物品狀態頁面。若為「已估價」之物品，在頁面右上可以查詢到我們提供的估價結果；在頁面右下的「物品進度」，則列舉出完整的交易流程，並提示您目前進行到哪個階段。
              <div className='space-y-2'>
                <Image
                  src={img4}
                  className='border border-blue-700'
                  alt=''
                  quality={100}
                />
                <Image
                  src={img5}
                  className='border border-blue-700'
                  alt=''
                  quality={100}
                />
                <Image
                  src={img7}
                  className='border border-blue-700'
                  alt=''
                  quality={100}
                />
              </div>
            </li>
            <li>
              若希望我們按照您所設定的期望金額上架日本雅虎拍賣
              <span className={docStyle.red}>進行直售</span>
              ，請選擇<span className={docStyle.red}>「定價銷售」</span>
              。您必須將物品寄來、或親送至我方倉儲據點，由我方再次確認；若您有超過20個以上、收購金額超過新台幣＄500元的物品，可享有寄件免運費之優惠。
            </li>
            <li>
              請注意，我方有可能根據物品的實際狀態而調整收購金額，您可以在上述頁面中查詢到完整而透明的現況資訊，用以判斷是否改變交易形式。
            </li>
            <li>
              若您確定要用定價銷售的形式期約金額收購，則我們會將物品以您設定的期望金額上架至日本雅虎拍賣。若物品成功售出，我們會將拍賣所得款項、扣除
              {toPercent(rate)}
              手續費後撥至您的「會員帳戶」→「帳戶紀錄」，讓您隨時提領；本平台將於當月15日或次月1日，將您所提領的款項匯至您設定的銀行帳戶。
            </li>
          </ol>
        </li>

        <li>
          <p>如何使用「期約金額收購」服務？</p>
          <ol className='pl-5'>
            <li>
              在網站首頁上方工具列中，點擊進入「我的物品」頁面，選擇「+ 新增物品」。
              <Image
                src={img1}
                className='border border-blue-700'
                alt=''
                quality={100}
              />
            </li>

            <li>
              請勿勾選「是否為定價商品」，只需填妥其他資料，按下「送出」即可。
              <Image
                src={img8}
                className='border border-blue-700'
                alt=''
                quality={100}
              />
            </li>

            <li>
              之後您就能在「我的物品」裡面，查詢到自己物品的狀態，包含我們的鑑價結果、待確認事項、物品進度….等等一切資訊，我們都會詳細為您揭露。
            </li>
            <li>
              點擊欲查詢的物品，即可查看物品狀態頁面。若為「已估價」之物品，在頁面右上可以查詢到我們提供的估價結果；在頁面右下的「物品進度」，則列舉出完整的交易流程，並提示您目前進行到哪個階段。
              <div className='space-y-2'>
                <Image
                  src={img4}
                  className='border border-blue-700'
                  alt=''
                  quality={100}
                />
                <Image
                  src={img5}
                  className='border border-blue-700'
                  alt=''
                  quality={100}
                />
                <Image
                  src={img6}
                  className='border border-blue-700'
                  alt=''
                  quality={100}
                />
              </div>
            </li>

            <li>
              若希望我們將物品上架日本雅虎拍賣供人競標，請選擇「
              <span className={docStyle.red}>期約金額銷售</span>」
              。您必須將物品寄來、或親送至我方倉儲據點，由我方再次確認；若您有超過20個以上、最低估值超過新台幣＄500元的物品，可享有寄件免運費之優惠。
            </li>
            <li>
              請注意，我方有可能根據物品的實際狀態而調整收購金額以及估值，您可以在上述頁面中查詢到完整而透明的現況資訊，用以判斷是否改變交易形式。
            </li>
            <li>
              當您確定同意期約金額收購後，我們會將物品上架至日本雅虎拍賣，供人競標。若物品成功售出，我們會將拍賣所得款項、扣除
              {toPercent(rate)}
              手續費後撥至您的「會員帳戶」→「帳戶紀錄」，讓您隨時提領；本平台將於當月15日或次月1日，將您所提領的款項匯至您設定的銀行帳戶。
            </li>
          </ol>
        </li>

        <li>
          <p>
            請問為什麼要估價兩次？上傳物品照片完要估價一次，寄到你們那邊後又說會再調整一次估價？
          </p>
          <p>
            在您提交新增物品之後，我們會先根據照片，請鑑價師幫忙粗估物品的價值。由於全部的資訊就只有照片以及您所描述的文字而已，所以我們也只能概略告訴您這物品的價值範圍在哪裡。您的照片越清晰、細節越全面、甚至連條碼和證紙之類都拍得很清楚的話，那鑑價師就越能給出準確的估價。
            然而，這個估價只是參考而已，用來給您作為選擇交易形式的依據；最終還是需要依照您寄來的物品，實際了解物品的狀態後，才能給出正式的估值。
          </p>
        </li>

        <li>
          <p>如果我不想交易了，可以取消嗎？</p>
          <p>
            當然可以，您可在上述的物品狀態頁面直接操作，取消交易。若您已將物品寄到我們這邊了，則需請您負擔寄回物品的運費，
            <span className={docStyle.red}>以及相關之作業費用。</span>
          </p>
          <ol className={clsx('pl-5', docStyle.red)}>
            <li>「賣斷交易」的形式下，取消交易之作業費用為新台幣＄2,000元。</li>
            <li>
              「定價銷售」或「期約金額收購」的形式下，取消交易之作業費用為新台幣＄500元。
            </li>
          </ol>
        </li>
        <li>
          <p>如果我的物品上架到日本雅虎拍賣了，我該怎麼掌握它的競標或銷售狀況？</p>
          <p>
            請在「我的物品」中，點擊欲查詢的物品，即可查看物品狀態頁面。在頁面右下的「物品進度」中，您可以清楚得知目前的進度狀況，也能點擊連結前往日拍查看。我們的作業流程都是透明的，敬請放心。
          </p>
        </li>
        <li>
          <p>如果我的物品在拍賣中流標的話，該怎麼處理？</p>
          <p>
            若您沒有主動取消期約金額收購的話，我們會再次安排物品上架，並依此原則重複直到物品售出為止；或者，您也可以主動取消交易。
          </p>
        </li>
        <li>
          <p>如果我的物品在拍賣中被人棄標的話，該怎麼處理？</p>
          <p>
            若物品於日本雅虎拍賣結標金額高於本平台估值之最低價格，但出價方最後棄標不完成交易，則本平台有以下3種處理方式可供您選擇：
          </p>
          <ol className='pl-5'>
            <li>
              我們以等同於最低估值扣除{toPercent(rate)}手續費之款項，向您收購此物品。
            </li>
            <li>或者，我們將此物品重新上架至「日本雅虎拍賣」進行標售。</li>
            <li>您若決定不賣了，可主動選擇取消交易。</li>
          </ol>
          <p>
            但若物品之結標金額低於最低估值，則我們將一律比照流標的處理方式，再次安排物品上架拍賣，或者由您主動取消交易。
          </p>
        </li>

        <li>
          <p>如果我的物品在拍賣中以低於最低估值的價格結標的話，該怎麼處理？</p>
          <p>
            我們承諾，將支付等同於最低估值扣除{toPercent(rate)}
            手續費之款項給您。
            <CalcExample price={1000} endPrice={100} rate={rate} />
          </p>
        </li>

        <li>
          <p>
            原來你們提供的最低估值是用來保障我們的基本收益啊！那最高估值呢？最高估值是做什麼用的？
          </p>
          <p>
            最高估值是我們根據物品的實際狀況，並參考其他相同或類似物品的歷史行情，概略估算此物品若送去日本拍賣的話，最高大約會以多少金額成交。本數據僅供您參考之用，我們並不保證物品會以最高估值結標，也不會用最高估值跟您收購物品。如果您的物品最終結標金額超過最高估值，我們將照價與您完成交易，不會受限於最高估值。
          </p>
        </li>

        <li>
          <p>如果我把物品直接賣斷給你們，你們會跟我收取手續費之類的費用嗎？</p>
          <p>
            不會，賣斷就是一口價，一手交錢、一手交貨，沒有其他額外的收費；但，若您把物品寄來後，才決定取消交易不賣了，則我們將請您負擔寄回物品的運費，以及新台幣
            <span className={docStyle.red}>＄2,000</span>元之作業費用。
          </p>
        </li>

        <li>
          <p>那如果我的物品是期約金額收購，你們會跟我收取哪些費用？</p>
          <p>
            在期約金額收購的情況下，不管是「定價銷售」的形式，還是「期約金額收購」的形式，只要物品上到了日本雅虎拍賣，一旦成交（註：包含物品不幸被棄標後、您同意由我們以最低估值收購該物品的狀況），我們就是收取成交價格的
            {toPercent(rate)}作為手續費。
          </p>
        </li>

        <li>
          <div className={docStyle.red}>
            <p>如果沒有成交，則有以下幾種情況及收費方式：</p>
            <ol className='pl-5'>
              <li>您同意讓我們再度將物品上架拍賣，則我們不會再收取任何額外費用。</li>
              <li>
                您決定取消交易不賣了，則我們將請您負擔寄回物品的運費，以及新台幣＄500元之作業費用。
              </li>
              <li>
                您在競標過程中喊停、或者在結標後反悔不願意出貨，但又希望我們再度幫您將物品上架拍賣，則我們每次都會跟您收取新台幣＄500元之作業費用。
              </li>
            </ol>
          </div>
          <p>
            另外一種狀況，如果您的物品被我們鑑定為無效物品，亦即狀態不佳難以估價，或者價值低於新台幣500元、不符合上架日本雅虎拍賣的效益，但您依然決定要指名我們期約金額收購的話，則我們會把物品放到台灣Facebook的相關社團進行販售。若成功售出，我們會收取成交金額的50%作為手續費；若未能成交，則比照上述說明，讓我們重新上架拍賣，或者由您支付運費及作業費
            <span className={docStyle.red}>新台幣＄500元</span>取回物品。
          </p>
        </li>

        <li>
          <p>
            如果我的物品在日本雅虎拍賣成交了，該怎麼寄送到日本？送到日本的運費由誰支付？
          </p>
          <p>
            您無須擔心，您在一開始就把物品寄給我們了，接下來就全都交給我們處理吧！我們會直接對接日拍得標者，並負責處理寄送貨運等相關事宜。寄送到日本的運費一律是由得標者支付，所以您也不需為此煩惱喔！
          </p>
        </li>

        <li>
          <p>
            如果我把物品寄給你們期約金額收購，結果物品在你們倉儲保存的期間發生損壞，你們怎麼處理？
          </p>
          <p>
            我們始終致力於確保倉儲物品的安全與完整。然而，若不幸發生損壞情況，我們必定坦誠告知並妥善處理。如您的物品採用「定價銷售」形式，我們將依您設定的期望金額，以40%作為收購價直接向您購買；如採用「期約金額銷售」形式，則將依物品的最低估值進行收購。全程無需支付任何手續費或保管費。若是難以估價的無效物品發生損壞，我們將統一支付新台幣＄50元作為補償收購金額。
          </p>
        </li>

        <li>
          <p>物品交易出去後，我要怎麼做才能拿到錢？</p>
          <p>
            我們會將款項撥到您的會員帳戶內，您可透過「帳戶紀錄」查詢並申請提領。由於作業流程的關係，在您申請提領後，我們將統一於當月15日、或次月1日匯款至您所設定的銀行帳戶內；以上匯款日期如遇例假日，則順延至下一個工作日處理。
          </p>
        </li>

        <li>
          <p>匯率怎麼算？</p>
          <p className={docStyle.red}>
            依據臺灣銀行公告之現金匯率，採用台銀買入匯率作為準則。
          </p>
        </li>

        <li>
          <p>任何物品都能請你們估價嗎？</p>
          <p className={docStyle.red}>
            也不是。請盡量避免具備效期限制之物品（例如：食品、票券等）。當然，違法的物品（例如：槍械、動物屍體等）也是絕對禁止！
          </p>
        </li>
      </ul>
    </main>
  )
}

function CalcExample({
  price,
  endPrice,
  rate,
}: {
  price: number
  endPrice: number
  rate: number
}) {
  return (
    <>
      例：若物品最低估值為1000日圓，最終結標金額僅100日圓，我們仍將支付您700日圓（1000
      × (1 - {toPercent(rate)})）
    </>
  )
}
