import { GetConfigs } from '@/api/frontend/GetConfigs'
import { getToken } from '@/domain/auth/getToken'
import { toPercent } from '@/domain/static/static'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline'
import { Button } from '../../catalyst-ui/button'
import heroImg1 from './hero-img-1.jpg'
import heroImg2 from './hero-img-2.png'
import heroImg3 from './hero-img-3.png'
import HeroCarousel, { HeroCarouselItem } from './HeroCarousel'

export default async function Page() {
  return (
    <>
      <main className='isolate'>
        {/* Hero section */}
        <div className='relative'>
          <div
            className='absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'
            aria-hidden='true'
          >
            <div
              className='relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]'
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>
          <div className='pb-24 pt-8 sm:py-32 sm:pt-16'>
            <div className='mx-auto max-w-7xl px-6 lg:px-8'>
              <div className='mx-auto text-center'>
                <p className='text-balance text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl'>
                  看看我們在日拍的競標高價記錄
                </p>
                <p className='mt-6 text-lg leading-8 text-gray-600'>
                  我們能將您的商品盡可能賣高價
                  <br />
                  這也是對於您物品價值的一種肯定
                </p>

                {!process.env.NEXT_PUBLIC_IS_MAINTENANCE && <JoinButtons />}

                <div className='mt-10 rounded-lg bg-gray-100 p-2 shadow-md'>
                  <HeroCarousel>
                    <HeroCarouselItem>
                      <img
                        src={heroImg1.src}
                        className='size-full object-contain object-center'
                        alt=''
                      />
                    </HeroCarouselItem>
                    <HeroCarouselItem>
                      <img
                        src={heroImg2.src}
                        className='size-full object-contain object-center'
                        alt=''
                      />
                    </HeroCarouselItem>
                    <HeroCarouselItem>
                      <img
                        src={heroImg3.src}
                        className='size-full object-contain object-center'
                        alt=''
                      />
                    </HeroCarouselItem>
                  </HeroCarousel>
                </div>
              </div>
            </div>
          </div>
        </div>

        {!process.env.NEXT_PUBLIC_IS_MAINTENANCE && <FaqSection />}

        <div
          className='absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]'
          aria-hidden='true'
        >
          <div
            className='relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]'
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </main>
    </>
  )
}

async function JoinButtons() {
  const { token } = await getToken()

  if (token) {
    return null
  }

  return (
    <div className='mt-10 flex items-center justify-center gap-x-6'>
      <Button href='/sign-up' color='indigo'>
        立即加入
      </Button>
      <Button plain>
        瞭解更多 <span aria-hidden='true'>→</span>
      </Button>
    </div>
  )
}

async function FaqSection() {
  const configs = await GetConfigs()

  return (
    <div className=''>
      <div className='mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40'>
        <div className='mx-auto max-w-4xl divide-y divide-gray-900/10'>
          <h2 className='text-2xl font-bold leading-10 tracking-tight text-gray-900'>
            常見問答
          </h2>
          <dl className='mt-10 space-y-6 divide-y divide-gray-900/10'>
            <FaqDisclosure title='我們提供哪些服務？'>
              <FaqDisclosurePanel>
                <p>
                  我們可以幫助您將有價值的物品，透過
                  {"'"}日本雅虎拍賣{"'"}（以下簡稱日拍）出售給全球感興趣的買家。
                  日拍作為全球性的銷售平台，讓您的物品擺脫單一銷售的限制。
                  透過我們的服務，您能獲得更多的曝光和廣泛的買家群體，從而提升競標價格，避免低價出售的情況。
                </p>
              </FaqDisclosurePanel>
            </FaqDisclosure>

            <FaqDisclosure title='我們的收費方式'>
              {(function () {
                const price = 25000

                return (
                  <FaqDisclosurePanel>
                    <p>日拍手續費：{toPercent(configs.data.yahooAuctionFeeRate)}</p>
                    <p>
                      平台手續費：
                      {toPercent(configs.data.commissionRate)}
                    </p>

                    <p className='mt-4'>
                      範例：
                      <br />
                      若您的物品最終競標金額為 {price.toLocaleString()} 日圓
                    </p>

                    <p className='mt-4'>
                      日拍手續費：
                      {(
                        price * configs.data.yahooAuctionFeeRate
                      ).toLocaleString()}{' '}
                      日圓
                      <br />
                      平台手續費：
                      {(price * configs.data.commissionRate).toLocaleString()} 日圓
                      <br />
                      您將實際獲得：
                      {(
                        price -
                        price * configs.data.yahooAuctionFeeRate -
                        price * configs.data.commissionRate
                      ).toLocaleString()}{' '}
                      日圓
                    </p>
                  </FaqDisclosurePanel>
                )
              })()}
            </FaqDisclosure>
          </dl>
        </div>
      </div>
    </div>
  )
}

function FaqDisclosure({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <Disclosure as='div' className='pt-6'>
      <dt>
        <DisclosureButton className='group flex w-full items-start justify-between text-left text-gray-900'>
          <span className='text-base font-semibold leading-7'>{title}</span>
          <span className='ml-6 flex h-7 items-center'>
            <PlusSmallIcon
              aria-hidden='true'
              className='h-6 w-6 group-data-[open]:hidden'
            />
            <MinusSmallIcon
              aria-hidden='true'
              className='h-6 w-6 [.group:not([data-open])_&]:hidden'
            />
          </span>
        </DisclosureButton>
        {children}
      </dt>
    </Disclosure>
  )
}

function FaqDisclosurePanel({ children }: { children: React.ReactNode }) {
  return (
    <DisclosurePanel as='dd' className='mt-2 pr-12'>
      <div className='text-base leading-7 text-gray-600'>{children}</div>
    </DisclosurePanel>
  )
}
