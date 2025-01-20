import clsx from 'clsx'
import docStyle from '@/app/doc.module.scss'

export default function Page() {
  return (
    <main className={clsx('mx-auto max-w-prose px-4', docStyle.doc)}>
      <h1 className='h1'>物品寄送相關</h1>

      <ul className='mt-4 pl-6'>
        <li>
          <p>你們的倉儲地址是？</p>
          <p>新北市板橋區富山街18巷2-1號1樓。</p>
        </li>

        <li>
          <p>你們的聯絡電話是？</p>
          <p>
            <span className={docStyle.red}>請使用LINE語音通話功能與客服聯繫。</span>
          </p>
        </li>

        <li>
          <p>你們的營業時間是？</p>
          <p>星期一至星期五  AM09:00 ～ PM18:00；公休日為 星期六&星期日</p>
        </li>

        <li>
          <p>如果我想親自把物品送到你們倉庫，需要事先聯絡嗎？</p>
          <p>建議事先透過客服與我們聯繫。</p>
        </li>

        <li>
          <p>物品親送一定要本人嗎？我可以請別人代替我嗎？</p>
          <p>
            由於物品在運送過程中可能會發生遺失、損傷、甚至掉包的狀況，為免糾紛產生，我們建議本人親送。
          </p>
        </li>

        <li>
          <p>寄送物品給你們，我需要出運費嗎？</p>
          <p>
            要，您必須自行負擔寄送物品過來的運費；如果您在將物品交付給我們後，才選擇取消交易，則您也必須負擔退貨所產生的運費。
          </p>
        </li>

        <li>
          <p>有沒有免運服務呀？</p>
          <p>
            有！若您有超過20個以上、最低估值或收購金額超過新台幣＄500元的物品，
            <span className={docStyle.red}>可享有寄件免運費之優惠。</span>
          </p>
        </li>
      </ul>
    </main>
  )
}
