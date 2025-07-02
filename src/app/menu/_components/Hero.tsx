import {
  cloudCube,
  cloudDoubleCube,
  cloudDoubleRectangle,
  cloudFlat,
  fenceCloud,
  fenceFaded,
} from '@/menu'
import Image from 'next/image'

const Hero = () => {
  return (
    <section className='relative h-[1024px] overflow-hidden bg-[url(/land-of-prosperity/hero-banner.png)] bg-cover bg-center bg-no-repeat'>
      <div className='absolute top-0 left-1/2 z-10 mx-auto hidden h-fit w-full max-w-[1440px] -translate-x-1/2 md:flex'>
        {/* <div className='relative w-full'>
          <Image
            alt='snow-island'
            src={islandSnow}
            width={640}
            height={740}
            className='absolute top-61 h-80 w-[318px] object-contain object-center opacity-90 blur-[2px] md:-left-49 lg:-left-11.25'
          />
          <Image
            alt='desert-island'
            src={islandDesert}
            width={640}
            height={680}
            className='absolute top-95.75 h-60 w-[238px] object-contain object-center opacity-80 blur-[6px] md:-right-43 lg:right-10.75'
          />
        </div> */}
      </div>
      <div className='absolute top-0 left-1/2 z-10 mx-auto h-[1024px] w-[1440px] -translate-x-1/2'>
        <div className='relative size-full'>
          {/* island */}
          {/* <Image
            alt='grass-island'
            src={islandGrass}
            width={640}
            height={714}
            className='absolute top-45 left-66.25 size-20 object-contain object-center opacity-60 blur-sm'
          />
          <Image
            alt='grass-island'
            src={islandGrass}
            width={640}
            height={714}
            className='absolute -top-10.25 right-[480px] size-20 object-contain object-center blur-md'
          /> */}

          {/* content */}
          <div className='absolute top-48 left-1/2 h-fit w-[640px] -translate-x-1/2'>
            <div className='relative flex size-full flex-col gap-2 md:gap-6 lg:gap-10'>
              {/* title */}
              <div className='flex w-full flex-col items-center justify-center gap-6'>
                <h1 className='font-shantell text-center text-[39px] leading-[120%] font-bold text-neutral-900'>
                  Build Your Land,
                  <br />
                  Earn Real Rewards!
                </h1>
                <p className='text-18 font-shantell text-center leading-[150%] text-neutral-900/70'>
                  Customize your NFT island, generate Point,
                  <br />
                  and turn your creativity into real value.
                </p>
              </div>
              {/* dowload button */}
              <div></div>
            </div>
          </div>

          {/* main island */}
          <div className='absolute -bottom-42.25 left-1/2 h-[681px] w-[600px] -translate-x-1/2'>
            <div className='relative h-[681px] w-[600px]'>
              {/* <Image
                alt='default-island'
                src={islandDefault}
                width={640}
                height={726}
                className='size-full object-fill object-center'
              /> */}

              {/* items */}
              {/* <Image
                alt='item-golden-trees'
                src={itemGoldenTrees}
                width={200}
                height={220}
                className='absolute -top-11 left-0 size-40 -rotate-[15deg] object-fill object-center'
              />
              <Image
                alt='item-house-waterwheel'
                src={itemHouseWaterwheel}
                width={240}
                height={252}
                className='absolute -top-10.25 right-7.25 size-44 rotate-[15deg] object-fill object-center'
              />
              <Image
                alt='item-house-windmill'
                src={itemHouseWindmill}
                width={200}
                height={206}
                className='absolute right-19 bottom-60.25 size-39 rotate-[15deg] object-fill object-center'
              /> */}
            </div>
          </div>

          {/* cloud */}
          <Image
            alt='double-cube-cloud'
            src={cloudDoubleCube}
            width={200}
            height={200}
            className='absolute bottom-59 left-40 size-40 object-fill object-center'
          />
          <Image
            alt='flat-cloud'
            src={cloudFlat}
            width={200}
            height={151}
            className='absolute right-76.25 bottom-82.25 h-[70px] w-[93px] object-fill object-center'
          />
          <Image
            alt='double-rectangle-cloud'
            src={cloudDoubleRectangle}
            width={200}
            height={186}
            className='absolute top-39.25 right-43.25 h-[137px] w-[147px] object-fill object-center blur-md'
          />
          <Image
            alt='cube-cloud'
            src={cloudCube}
            width={51}
            height={60}
            className='absolute right-63.5 bottom-74.75 h-[60px] w-[51px] object-fill object-center'
          />
        </div>
      </div>

      <div className='absolute bottom-0 flex h-fit w-[100dvw] items-center justify-center'>
        {/* fence */}
        <Image
          alt='fade-fence'
          src={fenceFaded}
          width={1854}
          height={417}
          className='absolute -bottom-21 z-0 h-[507px] w-full min-w-[1440px] object-center'
        />
        <Image
          alt='cloud-fence'
          src={fenceCloud}
          width={1748}
          height={280}
          className='absolute -bottom-19 z-10 h-[360px] w-full min-w-[1440px] object-center'
        />
      </div>
    </section>
  )
}

export default Hero
