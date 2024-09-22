import { getUser } from '@/api/helpers/getUser'
import Image from 'next/image'
import { Button } from '../../catalyst-ui/button'
import heroImg1 from './hero-img-1.jpg'
import heroImg2 from './hero-img-2.png'
import heroImg3 from './hero-img-3.png'
import HeroCarousel, { HeroCarouselItem } from './HeroCarousel'

export default async function Page() {
  const user = await getUser()

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

                {!user && (
                  <div className='mt-10 flex items-center justify-center gap-x-6'>
                    <Button href='/sign-up' color='indigo'>
                      立即加入
                    </Button>
                    <Button plain>
                      瞭解更多 <span aria-hidden='true'>→</span>
                    </Button>
                  </div>
                )}

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
