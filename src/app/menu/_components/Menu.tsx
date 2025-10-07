import MenuDetail from './ui/MenuDetail'
import MenuSearch from './ui/MenuSearch'

const Menu = () => {
  return (
    <section className='relative px-2 py-10 md:px-6 md:py-20 lg:px-10 lg:py-30'>
      <div className='mx-auto flex w-full max-w-[1024px] items-start'>
        <MenuSearch />
        <MenuDetail />
      </div>
    </section>
  )
}

export default Menu
