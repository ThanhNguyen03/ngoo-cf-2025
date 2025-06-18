'use client'
import {
  CheckIcon,
  InfoIcon,
  SpinnerGapIcon,
  WarningIcon,
  XIcon,
} from '@phosphor-icons/react/dist/ssr'
import { FC } from 'react'
import { ToastContainer, ToastIcon, TypeOptions } from 'react-toastify'

import { cn } from '@/utils'

type TContextClassMap = {
  [key in TypeOptions | 'loading' | 'default']: string
}

const AUTO_CLOSE = 10 * 1000 // 10 second

const Toaster: FC = () => {
  const toastClassName: TContextClassMap = {
    success: 'bg-green-700 border-green-500/70 shadow-green-700',
    error: 'bg-pink-700 border-pink-500/70 shadow-pink-700',
    info: 'bg-blue-700 border-blue-500/70 shadow-blue-700',
    warning: 'bg-orange-700 border-orange-500/70 shadow-orange-700',
    loading: 'bg-blue-700 border-blue-500/70 shadow-blue-700',
    default: 'bg-gray-600',
  }

  const ToastIcons: ToastIcon = ({ isLoading, type }) => {
    switch (type) {
      case 'success':
        return (
          <div className='bg-green-500 rounded-lg p-2'>
            {isLoading ? (
              <SpinnerGapIcon
                className='animate-spin text-white'
                size={20}
                weight='bold'
              />
            ) : (
              <CheckIcon className='text-white' size={20} weight='bold' />
            )}
          </div>
        )
      case 'error':
        return (
          <div className='bg-pink-500 rounded-lg p-2'>
            {isLoading ? (
              <SpinnerGapIcon
                className='animate-spin text-white'
                size={20}
                weight='bold'
              />
            ) : (
              <XIcon className='text-white' size={20} weight='bold' />
            )}
          </div>
        )
      case 'info':
        return (
          <div className='bg-blue-500 rounded-lg p-2'>
            {isLoading ? (
              <SpinnerGapIcon
                className='animate-spin text-white'
                size={20}
                weight='bold'
              />
            ) : (
              <InfoIcon className='text-white' size={20} weight='bold' />
            )}
          </div>
        )
      case 'warning':
        return (
          <div className='bg-orange-500 rounded-lg p-2'>
            {isLoading ? (
              <SpinnerGapIcon
                className='animate-spin text-white'
                size={20}
                weight='bold'
              />
            ) : (
              <WarningIcon className='text-white' size={20} weight='bold' />
            )}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <ToastContainer
      position='top-center'
      autoClose={AUTO_CLOSE}
      toastClassName={(context) =>
        cn(
          'text-16 relative !mx-2 my-2 flex max-w-xl min-w-[95%] cursor-pointer items-center gap-4 overflow-hidden rounded-lg border px-4 pt-2 pb-3 font-semibold shadow-lg md:min-w-md',
          toastClassName[context?.type || 'default']
        )
      }
      icon={ToastIcons}
    />
  )
}

export default Toaster
