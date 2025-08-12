import { Geist, Geist_Mono } from 'next/font/google'
import { ProductResponse } from './api/products'
import Image from 'next/image'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export async function getServerSideProps() {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL! + '/products')
  const data = await res.json()
  const products = data.products as ProductResponse[]
  return { props: { products } }
}

export default function Home({ products }: { products: ProductResponse[] }) {
  return (
    <div className={`${geistSans.className} ${geistMono.className} font-sans`}>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-2 sm:gap-4'>
        {products.map((product) => (
          <div
            key={product.id}
            className='border-2 border-gray-400 p-2.5 rounded-lg shadow-2xl'
          >
            <div
              style={{ width: '100%', height: '250px', position: 'relative' }}
            >
              <Image
                src={product.image}
                alt={product.title}
                fill={true}
                objectFit='cover'
              />
            </div>

            <h3 className='text-xl'>{product.title}</h3>
            <p>{product.category}</p>
            <div className='flex justify-between mt-2.5'>
              <p>${product.price}</p>
              <p>{product.rating.rate}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
