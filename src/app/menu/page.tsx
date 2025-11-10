import { Metadata } from 'next'
import { Hero } from './_components/Hero'
import { Menu } from './_components/Menu'

export const metadata: Metadata = {
  title: 'Land of Prosperity',
}

export default function MenuPage() {
  return (
    <main>
      <Hero />
      <Menu />
    </main>
  )
}
