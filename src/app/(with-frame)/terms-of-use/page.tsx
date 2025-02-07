import clsx from 'clsx'
import docStyle from '@/app/doc.module.scss'

export default function Page() {
  return (
    <main className={clsx('mx-auto max-w-prose px-4', docStyle.doc)}>
      <h1 className='h1'>日拍大師條款</h1>

      <ul className='mt-4 !list-[cjk-ideographic] pl-6'>
        <li>
          會員經註冊，即表示已同意日拍大師網路服務平台（以下簡稱日拍大師）之使用條款，網站各項服務之規定與說明，亦構成使用條款之一部。如不同意使用條款，請即停止使用本服務。
        </li>
        <li>
          會員如未滿18歲，除需會員本人同意，尚須經會員之法定代理人或監護人之同意，始得為之。未滿18歲之會員經註冊，即表示會員之法定代理人或監護人已同意使用條款。
        </li>
        <li>
          日拍大師是對於會員所提供之物品進行估價、議定價金並收受取得物品的網路服務平台。日拍大師於取得物品後，可能透過諸如日本YAHOO拍賣（Yahoo!オークション）之交易平台，將物品轉售。會員確認，經本平台收受的物品所有權即移轉予日拍大師，會員不得再對該物品主張任何權利，除非另有約定。
        </li>
        <li>
          日拍大師除提供會員物品之估價服務、議定價金外，消費者得以【
          <span className={docStyle.red}>定價銷售</span>
          】或【<span className={docStyle.red}>期約金額收購</span>
          】之方式，取得額外會員回饋金之期待權。日拍大師將告知會員轉售之平台上架資訊或連結網址，以利會員評估可能的會員回饋金。
        </li>
        <li>
          日拍大師與前述之第三方網路服務平台無任何關係，對該等第三方平台之正確性、即時性、完整性等，不負擔保與損害賠償責任。會員對於是否下載、瀏覽、使用相關第三方網路服務平台，請謹慎斟酌判斷。
        </li>
        <li>
          關於【<span className={docStyle.red}>定價銷售</span>
          】或【<span className={docStyle.red}>期約金額收購</span>
          】之附約，日拍大師與會員所議定之價金及會員回饋金，將於日拍大師於轉售後一定期間內，一次支付。會員理解，如轉售過程因不可抗力或其他第三方原因而失敗，日拍大師僅需依最低保障金額或契約約定金額支付賣家，會員不得追索額外賠償。
        </li>
        <li className={docStyle.red}>
          同意【定價銷售】或【期約金額收購】附約之情形，會員得隨時解除契約，惟須支付日拍大師作業費用新台幣500元整，並自行承擔相關之物流費用。
        </li>
        <li>
          會員有擔保其所提供物品未侵害他人權利或違反法令之責任。如有違反之疑慮，日拍大師得終止其會員權利；造成日拍大師損失並負損害賠償責任。基於非法目的或使用非法方法使用本服務，或違反其他使用條款者，亦同。若日拍大師因此遭受第三方權利人之主張或政府機關之處罰，會員應負全額賠償責任，包括但不限於罰款、訴訟費用及律師費。
        </li>
        <li>
          會員經註冊即同意日拍大師蒐集、處理、利用、傳輸其所提供之基本資料，並得於必要時提供予合作夥伴，以利服務之提供。會員應擔保其提供或更新之基本資料之正確性，如有不實，日拍大師得終止其會員權利。會員如需撤回同意，應以書面通知本平台，並了解撤回可能影響本服務之提供。
        </li>
        <li>
          當會員上傳任何照片、圖片或其他形式之視覺資料至本平台時，視為會員已同意授權日拍大師在全球範圍內、永久且不可撤銷地免費使用該等資料。此授權包括但不限於以下用途：
          <ol className='pl-5'>
            <li>用於本平台的物品估價、交易展示及相關服務；</li>
            <li>用於推廣、宣傳本平台或相關服務的行銷活動；</li>
            <li>用於其他與平台運營相關的用途。</li>
          </ol>
          <p>
            會員同意，日拍大師有權根據需要對該等資料進行必要的修改、翻譯、重製、發佈、展示或以其他形式使用，而無需另行取得會員的同意或支付任何費用。
          </p>
          <p>
            會員保證對上傳的所有資料擁有完整的權利，並確保該等資料不侵犯任何第三方之權利（包括但不限於著作權、商標權或其他智慧財產權）。若因此導致日拍大師遭受任何損失，會員應負全責並賠償日拍大師因此產生的所有損害及費用。
          </p>
        </li>
        <li>
          會員於完成註冊後，應妥善保管個人帳號及密碼，並對其帳號於本服務進行之一切行為負責，切勿將帳號與密碼洩露或提供予第三人知悉，或出借或轉讓他人使用。若會員帳號因會員未妥善保管而遭第三方使用，會員應自行負責相關後果，日拍大師不承擔任何責任。
        </li>
        <li>
          日拍大師因營運及提供服務之需求，或服務平台有更新、故障之情形，保留暫停、變更或終止本服務之全部或一部之權利。日拍大師將於合理時間內通知會員，惟因不可抗力或緊急情況無法事先通知者除外。
        </li>
        <li>
          會員因交易所生之所得稅等稅捐稽徵須自行負責，日拍大師對此不付任何擔保責任。
        </li>
        <li>
          日拍大師保留更新服務條款之權利。日拍大師對於服務條款更新及其他一切事務之通知，得以郵件、電子郵件、訊息或電話及其他可能之通訊方式為之；如為文字形式，於郵件、電子郵件、訊息發送至會員可讀取之處所或裝置或註冊信箱時，該通知即發生送達效力。會員應定期查閱日拍大師相關通知，若未依通知內容處理，日拍大師不負延誤責任。
        </li>
        <li>
          本服務條款以中華民國相關法令為準據法。如有涉訟，雙方同意以台灣新北地方法院為第一審管轄法院。
        </li>
      </ul>
    </main>
  )
}
