import { Metadata } from 'next'
import Hero from './_components/Hero'

export const metadata: Metadata = {
  title: 'Land of Prosperity',
}

export default function LandOfProsperityPage() {
  return (
    <main>
      <Hero />
      <div className='h-[1562px] bg-linear-to-b from-[#ECFAFE] to-white to-25%'></div>
    </main>
  )
}
