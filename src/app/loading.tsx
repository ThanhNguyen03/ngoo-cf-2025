const Loading = () => {
  return (
    <div className='from-primary-50 to-secondary-50 fixed inset-0 z-[88] flex h-screen w-screen items-center justify-center bg-linear-to-b'>
      <div className='flex flex-col items-center gap-4'>
        <div className='border-secondary-500 h-10 w-10 animate-spin rounded-full border-4 border-t-transparent'></div>
        <p className='font-shantell text-center font-medium text-neutral-900/70'>
          Loading your page. <br />
          Please hold on a moment while we gather all the latest updates for
          you...
        </p>
      </div>
    </div>
  )
}

export default Loading
