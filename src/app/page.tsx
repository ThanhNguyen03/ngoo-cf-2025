import BestSeller from '@/components/section/best-seller'
import Hero from '@/components/section/hero'

export default function Home() {
  return (
    <>
      <Hero />
      <div className='px-2 pt-6 pb-10 md:px-6 md:pb-20 md:pt-10 lg:pt-20 lg:px-10 lg:pb-30 bg-white'>
        <div className='max-w-[1024px] w-full mx-auto'>
          <BestSeller />
        </div>
      </div>
      <div className='text-gray-500 max-w-2xl mx-auto mt-4 flex flex-col gap-4'>
        <p>
          NgOo EST. 2023, Còn bạn? <br />
          Started when we was 20! <br />
        </p>
        <p>
          Nhắc nhỏ cho mọi người nhớ rằng, vào tháng 7 này khi đặt bất kì món
          nước nào của NgOo với số lượng 2 ly trở lên thì sẽ được tặng miễn phí
          2 Panna Cotta.
        </p>
        <p>
          Và chắc chắn sắp tới NgOo sẽ ra mắt rất nhiều món mới để phục vụ mọi
          người. Vì thế mọi người nhớ like cũng như là theo dõi NgOo để cập nhật
          thông tin mới sớm nhất nha!
        </p>
        <p>
          Biết đâu, crush của bạn thích món nước đó thì sao. Vậy thì còn chần
          chờ gì nữa mà không nhanh tay mà đặt nước cho bản thân cùng người
          aays!
        </p>
      </div>
    </>
  )
}
