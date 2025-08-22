const Loading = () => {
  return (
    <div className='fixed inset-0 z-[88] flex h-screen w-screen items-center justify-center bg-white'>
      <div className='flex flex-col items-center gap-4'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-red-500 border-t-transparent'></div>
        <p className='text-gray-600'>Loading...</p>
      </div>
    </div>
  )
}

export default Loading
