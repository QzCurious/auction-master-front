const products = [
  {
    id: 1,
    name: 'Nomad Pouch',
    href: '#',
    price: '$50',
    availability: 'White and Black',
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/category-page-07-product-01.jpg',
    imageAlt:
      'White fabric pouch with white zipper, black zipper pull, and black elastic loop.',
  },
  {
    id: 2,
    name: 'Zip Tote Basket',
    href: '#',
    price: '$140',
    availability: 'Washed Black',
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/category-page-07-product-02.jpg',
    imageAlt:
      'Front of tote bag with washed black canvas body, black straps, and tan leather handles and accents.',
  },
  {
    id: 3,
    name: 'Medium Stuff Satchel',
    href: '#',
    price: '$220',
    availability: 'Blue',
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/category-page-07-product-03.jpg',
    imageAlt:
      'Front of satchel with blue canvas body, black straps and handle, drawstring top, and front zipper pouch.',
  },
  {
    id: 4,
    name: 'High Wall Tote',
    href: '#',
    price: '$240',
    availability: 'Black and Orange',
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/category-page-07-product-04.jpg',
    imageAlt: '',
  },
  {
    id: 5,
    name: 'Zip Tote Basket',
    href: '#',
    price: '$140',
    availability: 'White and black',
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/category-page-07-product-05.jpg',
    imageAlt: '',
  },
  {
    id: 6,
    name: 'Zip High Wall Tote',
    href: '#',
    price: '$170',
    availability: 'White and blue',
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/category-page-07-product-05.jpg',
    imageAlt: '',
  },
]

export default function Page() {
  return (
    <div className='bg-white'>
      <div className='mx-auto max-w-7xl overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8'>
        <div className='md:flex md:items-center md:justify-between'>
          <h2 className='text-2xl font-bold tracking-tight text-gray-900'>
            Trending products
          </h2>
          <a
            href='#'
            className='hidden text-sm font-medium text-indigo-600 hover:text-indigo-500 md:block'
          >
            Shop the collection
            <span aria-hidden='true'> &rarr;</span>
          </a>
        </div>

        <div className='mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8'>
          {products.map((product) => (
            <a key={product.id} href={product.href} className='group text-sm'>
              <div className='aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75'>
                <img
                  src={product.imageSrc}
                  alt={product.imageAlt}
                  className='h-full w-full object-cover object-center'
                />
              </div>
              <h3 className='mt-4 font-medium text-gray-900'>{product.name}</h3>
              <p className='italic text-gray-500'>{product.availability}</p>
              <p className='mt-2 font-medium text-gray-900'>{product.price}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
