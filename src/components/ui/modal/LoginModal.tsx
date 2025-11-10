'use client'

import { googleIcon } from '@/assets/icons'
import { loginBg } from '@/assets/images'
import { Button } from '@/components/ui'
import { TModalProps } from '@/types'
import { cn } from '@/utils'
import { XIcon } from '@phosphor-icons/react/dist/ssr'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { FC, useState } from 'react'
import { Modal } from './Modal'

export const LoginModal: FC<TModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState<boolean>(true)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className='bg-beige-50 rounded-4 w-80 border-0 md:h-[50dvh] md:w-[560px] lg:w-[680px]'
      closable={false}
      closeOnOutsideClick
    >
      <div
        className={cn(
          'relative flex size-full duration-500',
          isLogin ? 'flex-row' : 'flex-row-reverse',
        )}
      >
        <Button
          onClick={onClose}
          disableAnimation
          className='bg-beige-50/60 fixed top-4 right-4 z-10 flex items-center justify-center gap-0 rounded-full border border-neutral-900/10 p-1 backdrop-blur-2xl'
        >
          <XIcon size={16} className='text-dark-600' />
        </Button>

        <div className='h-full w-1/2'>
          <Image
            alt={'Login background'}
            src={loginBg}
            width={500}
            height={500}
            className='rounded-l-3.5 size-full object-cover'
          />
        </div>
        <div className='flex h-full w-1/2 flex-col items-center justify-center gap-6 px-4 py-20 md:gap-10 md:px-10'>
          <h1 className='font-lobster text-secondary-500 text-center text-4xl font-semibold'>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </h1>
          <div className='flex w-full flex-col items-center justify-center gap-2 md:gap-4'>
            <form
              id='login'
              className='mx-auto flex w-full flex-col items-center justify-center gap-2'
            >
              <div className='group flex h-14 w-full flex-col items-start gap-1'>
                <p className='font-small-caps text-14 font-semibold'>Email</p>
                <input
                  type='email'
                  name='email'
                  placeholder='Email'
                  className={cn(
                    'border-dark-600/10 text-16 placeholder:font-shantell max-h-0 w-full border-b pb-1 placeholder:text-transparent focus:ring-0 focus:ring-offset-0 focus:outline-none',
                    'group-hover:border-dark-600 group-hover:placeholder:text-dark-600/10 group-hover:relative group-hover:max-h-8 group-hover:border-b-2',
                    'focus:border-dark-600 focus:relative focus:max-h-8 focus:border-b-2',
                    'transition-all duration-300',
                  )}
                />
              </div>

              <div className='group flex h-14 w-full flex-col items-start gap-1'>
                <p className='font-small-caps text-14 font-semibold'>
                  Password
                </p>
                <input
                  type='password'
                  name='password'
                  placeholder='Password'
                  className={cn(
                    'border-dark-600/10 text-16 placeholder:font-shantell max-h-0 w-full border-b pb-1 placeholder:text-transparent focus:ring-0 focus:ring-offset-0 focus:outline-none',
                    'group-hover:border-dark-600 group-hover:placeholder:text-dark-600/10 group-hover:relative group-hover:max-h-8 group-hover:border-b-2',
                    'focus:border-dark-600 focus:relative focus:max-h-8 focus:border-b-2',
                    'transition-all duration-300',
                  )}
                />
              </div>

              <Button
                className='bg-primary-500 hover:bg-primary-600 w-full px-4 py-2'
                type='submit'
                form='login'
                disableAnimation
              >
                {isLogin ? 'Sign In' : 'Sign Up'}
              </Button>
            </form>

            {/* divider */}
            <div className='h-px w-full bg-linear-to-r from-black/[2%] via-black/10 to-black/[2%]' />

            <div className='flex flex-col items-center justify-center gap-2 md:gap-3'>
              <p className='text-dark-600/70 text-14 text-center'>
                Or login with
              </p>
              <button
                type='button'
                onClick={() => signIn('google', { callbackUrl: '/' })}
                className='border-dark-600/10 font-shantell rounded-3 text-dark-600 flex w-full cursor-pointer items-center justify-center gap-2 border bg-white px-4 py-2 font-semibold focus:ring-0 focus:ring-offset-0 focus:outline-none md:px-6'
              >
                <Image
                  src={googleIcon}
                  alt='Google Logo'
                  width={20}
                  height={20}
                  className='object-contain'
                />
                Login with Google
              </button>
            </div>

            <div className='text-14 text-dark-600/70 flex gap-1'>
              {isLogin && <p>Don&apos;t have any account?</p>}
              <button
                className='cursor-pointer font-semibold text-blue-300 underline'
                onClick={() => setIsLogin((prev) => !prev)}
              >
                {isLogin ? 'Sign up here' : 'Back to login'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
