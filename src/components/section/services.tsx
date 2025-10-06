import { cn } from '@/utils'
import {
  BankIcon,
  CurrencyEthIcon,
  MoneyWavyIcon,
} from '@phosphor-icons/react/dist/ssr'
import { FC } from 'react'

type TService = {
  icon: React.ReactNode
  title: string
  description: number | string
}
const ServiceCard: FC<TService> = ({ icon, description, title }) => {
  return (
    <div className='flex min-h-50 w-full max-w-60 flex-col items-center gap-2 text-center lining-nums md:gap-3'>
      {icon}
      <p className='text-16 text-dark-600 font-semibold'>{title}</p>
      <p className='text-14 text-dark-600/50'>{description}</p>
    </div>
  )
}

type TServicesProps = {
  isHover?: boolean
}
const LIST_SERVICE_DATA: TService[] = [
  {
    icon: (
      <div className='flex size-20 items-center justify-center'>
        <MoneyWavyIcon size={70} weight='fill' className='text-tint-300' />
      </div>
    ),
    title: 'COD',
    description:
      'Cash on Delivery (COD), simple and familiar for everyone, ensuring safety and convenience in every transaction.',
  },
  {
    icon: (
      <div className='flex size-20 items-center justify-center'>
        <BankIcon size={70} weight='fill' className='text-orange-500' />
      </div>
    ),
    title: 'Banking',
    description:
      'Fast and reliable bank transfers, supporting most major banks in Vietnam with secure and seamless payments.',
  },
  {
    icon: (
      <div className='flex size-20 items-center justify-center'>
        <CurrencyEthIcon size={70} weight='fill' className='text-shade-700' />
      </div>
    ),
    title: 'Cryptography',
    description:
      'Pay with cryptocurrencies like ETH or USDT – borderless, secure, and tailored for Web3 users.',
  },
]
const Services: FC<TServicesProps> = ({ isHover }) => {
  return (
    <section
      className={cn(
        'relative overflow-hidden px-2 pt-10 pb-6 md:px-6 md:pt-20 md:pb-10 lg:px-10 lg:pt-40 lg:pb-20',
        isHover
          ? 'from-dark-600 bg-linear-to-b to-white to-20%'
          : 'bg-linear-to-b from-[#dfd7be] to-white to-20%',
      )}
    >
      <div className='mx-auto flex w-full max-w-[1024px] flex-col gap-4 md:gap-6 lg:gap-10'>
        <div className='= flex flex-col items-start gap-2'>
          <h2 className='text-18 text-primary-600 font-small-caps w-fit font-semibold'>
            Services
          </h2>
          <p className='text-23 text-dark-600/70 font-semibold'>
            We offer the best services
          </p>
        </div>
        <div className='flex items-center justify-between gap-6 md:gap-10'>
          {LIST_SERVICE_DATA.map((data) => (
            <ServiceCard key={data.title} {...data} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
