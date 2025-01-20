import docStyle from '@/app/doc.module.scss'
import clsx from 'clsx'

export default function Page() {
  return (
    <main className={clsx('mx-auto max-w-prose px-4', docStyle.doc)}>
      <h1 className='h1'> 註冊與個資相關</h1>

      <ul className='mt-4 pl-6'>
        <li>
          <p>如何加入成為會員？</p>
          <p>
            在網站首頁點選「立即加入」，填寫註冊相關資料，並完成身份認證，即可免費成為本平台的會員。
          </p>
        </li>

        <li>
          <p> 我所上傳的身份證資料，會被拿來做什麼用？</p>
          <p>主要是用在以下幾點：</p>
          <ol className='pl-5'>
            <li>
              <span className='font-bold'>身份驗證</span>
              ：確保會員的真實性，避免虛假帳號或重複註冊的情況。
            </li>
            <li>
              <span className='font-bold'>年齡確認</span>
              ：確認會員是否符合平台使用的年齡限制。
            </li>
            <li>
              <span className='font-bold'>帳號恢復</span>
              ：若會員日後帳號遺失或發生異常，可用身份證明文件協助恢復帳號。
            </li>
          </ol>
        </li>

        <li>
          <p>我的個人資料會被拿來做什麼用？</p>
          <p>
            您在註冊時所輸入之各項資料（包含姓名、銀行帳戶、地址等資訊），以及瀏覽使用本平台網站時所自動產生之各項資訊（包含IP、機體識別、作業系統識別、瀏覽器識別、cookie資訊等），僅作為以下服務所用：{' '}
          </p>
          <ol className='pl-5'>
            <li>
              <span className='font-bold'>服務提供</span>
              ：交易匯款、寄送貨物、參與活動時所需的必要資訊。
            </li>
            <li>
              <span className='font-bold'>客服聯繫</span>
              ：當交易有問題或需要確認時，我們會透過您提供的聯絡資訊聯繫您。
            </li>
            <li>
              <span className='font-bold'>提升服務</span>
              ：用於平台內部之數據資料分析，以優化我們的服務品質。
            </li>
          </ol>
          <p className='mt-2'>
            此外，我們承諾遵守《個人資料保護法》，您的資料僅限於平台內部使用，絕不會在未經您的同意下提供給第三者，也不會因而與特定使用者產生特定的關聯或識別性。
          </p>
        </li>

        <li>
          <p>我的個資能受到什麼樣的保障？</p>
          <p className='font-bold'>本平台保障個人資料安全的方式：</p>
          <ol className='pl-5'>
            <li>
              <span className='font-bold'>資料加密</span>
              ：會員上傳的身份證資料會經過加密處理（例如使用SSL/TLS協議）以防止資料在傳輸過程中被攔截。
            </li>
            <li>
              <span className='font-bold'>存儲安全</span>
              ：網站會將身份證資料存儲在受保護的伺服器內，並採用加密存儲技術確保資料不被未授權訪問。
            </li>
            <li>
              <span className='font-bold'>訪問控制</span>
              ：只有授權的員工或系統可存取身份證資料，並設定嚴格的存取紀錄以防內部濫用。
            </li>
            <li>
              <span className='font-bold'>定期安全審查</span>
              ：網站將定期進行安全性測試與系統更新，以防範駭客攻擊或其他資料洩漏風險。
            </li>
            <li>
              <span className='font-bold'>通知機制</span>
              ：若不幸發生個資外洩，本平台將迅速通知受影響會員，並採取補救措施如強制更改密碼等。
            </li>
          </ol>
          <p className='mt-2'>
            本公司將因應時勢變化，而不定時修訂網站政策規章。當修訂內容牽涉到您的個人資料時，我們會在網頁上張貼告示、或以客服聯繫通知相關事項。您若對此抱有任何疑問，敬請與我們聯絡。
          </p>
        </li>
      </ul>
    </main>
  )
}
