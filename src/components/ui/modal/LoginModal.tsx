'use client'

import { googleIcon } from '@/assets/icons'
import { loginBg } from '@/assets/images'
import { Button } from '@/components/ui'
import { useDebounce } from '@/hooks'
import useAuthStore from '@/store/auth-store'
import { TModalProps } from '@/types'
import { cn } from '@/utils'
import { EyeIcon, EyeSlashIcon, XIcon } from '@phosphor-icons/react/dist/ssr'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { FC, useEffect, useState } from 'react'
import { Modal } from './Modal'

type TErrorMessage = {
  email: string
  password: string
}

const PASSWORD_REGEX_UPPERCASE = /[A-Z]/
const PASSWORD_REGEX_LOWERCASE = /[a-z]/
const PASSWORD_REGEX_NUMBER = /\d/
// special char, except "." và ","
const PASSWORD_REGEX_SPECIAL = /[^A-Za-z0-9/\\]/

export const validateLoginInput = (
  email: string,
  password: string,
): TErrorMessage => {
  const errors: TErrorMessage = { email: '', password: '' }

  // Email validation
  if (!email.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Invalid email format'
  }

  // Password validation
  if (!password.trim()) {
    errors.password = 'Password is required'
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
  } else if (password.length > 16) {
    errors.password = 'Password must not exceed 16 characters'
  } else if (!PASSWORD_REGEX_LOWERCASE.test(password)) {
    errors.password = 'At least 1 lowercase letter'
  } else if (!PASSWORD_REGEX_UPPERCASE.test(password)) {
    errors.password = 'At least 1 uppercase letter'
  } else if (!PASSWORD_REGEX_NUMBER.test(password)) {
    errors.password = 'At least 1 number'
  } else if (!PASSWORD_REGEX_SPECIAL.test(password)) {
    errors.password = 'At least 1 special character (except "/" and "\\")'
  }

  return errors
}

const DEBOUNCE_DELAY = 500

export const LoginModal: FC<TModalProps> = ({ isOpen, onClose }) => {
  const login = useAuthStore((state) => state.login)

  const [isLogin, setIsLogin] = useState<boolean>(true)
  const [startAnimation, setStartAnimation] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [emailInput, setEmailInput] = useState<string>('')
  const [passwordInput, setPasswordInput] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<TErrorMessage>({
    email: '',
    password: '',
  })

  const emailDebounce = useDebounce(emailInput, DEBOUNCE_DELAY)
  const passwordDebounce = useDebounce(passwordInput, DEBOUNCE_DELAY)
  const inputClassName = cn(
    'border-dark-600/10 text-16 placeholder:font-shantell max-h-0 w-full border-b font-medium placeholder:text-transparent focus:ring-0 focus:ring-offset-0 focus:outline-none',
    'group-hover:border-dark-600 group-hover:placeholder:text-dark-600/10 group-hover:relative group-hover:max-h-8 group-hover:border-b-2',
    'focus:border-dark-600 focus:relative focus:max-h-8 focus:border-b-2',
    'transition-all duration-300',
  )

  // Re-validate when debounced values changed
  useEffect(() => {
    const errors = validateLoginInput(emailDebounce, passwordDebounce)
    setErrorMessage(errors)
  }, [emailDebounce, passwordDebounce])

  // Clear touched+errors on close / mode change
  useEffect(() => {
    if (!isOpen) {
      setEmailInput('')
      setPasswordInput('')
      setErrorMessage({ email: '', password: '' })
    }
  }, [isOpen])

  const handleChangeMode = () => {
    setIsLogin((prev) => !prev)
    setEmailInput('')
    setPasswordInput('')
    setErrorMessage({ email: '', password: '' })
    setStartAnimation(true)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className='rounded-4 w-80 border-0 md:h-[500px] md:w-[560px] lg:w-[680px]'
      closable={false}
      closeOnOutsideClick
    >
      <div className='bg-beige-50 rounded-4 relative flex size-full overflow-hidden'>
        <Button
          onClick={onClose}
          disableAnimation
          className='bg-beige-50/60 center absolute top-4 right-4 z-10 gap-0 rounded-full border border-neutral-900/10 p-1 backdrop-blur-2xl'
        >
          <XIcon size={16} className='text-dark-600' />
        </Button>

        <div
          className={cn(
            'bg-dark-600 absolute left-0 z-10 h-full w-1/2',
            startAnimation &&
              (isLogin
                ? 'animate-login-moving-reverse'
                : 'animate-login-moving'),
          )}
        >
          <Image
            alt={'Login background'}
            src={loginBg}
            width={500}
            height={500}
            className={cn(
              'z-10 size-full max-w-40 object-cover duration-500 md:max-w-[280px] lg:max-w-[340px]',
              isLogin ? 'rounded-l-3.5' : 'rounded-r-3.5',
            )}
          />
        </div>
        <div
          className={cn(
            'flex h-full w-1/2 flex-col items-center justify-center gap-6 px-4 py-20 duration-700 ease-in md:gap-10 md:px-10',
            isLogin && 'translate-x-full',
          )}
        >
          <h1 className='font-lobster text-secondary-500 text-center text-4xl font-semibold'>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </h1>
          <div className='flex w-full flex-col items-center justify-center gap-2 md:gap-4'>
            <form
              id='login'
              className='mx-auto flex w-full flex-col items-center justify-center gap-3'
              onSubmit={() =>
                login(
                  { email: emailDebounce, password: passwordDebounce },
                  !isLogin,
                )
              }
            >
              <div
                className={cn(
                  'group relative flex h-14 w-full flex-col items-start gap-1',
                  errorMessage.email && 'pb-1',
                )}
              >
                <p className='font-small-caps text-14 font-semibold'>Email</p>
                <input
                  type='email'
                  name='email'
                  placeholder='Email'
                  className={cn(
                    inputClassName,
                    emailInput && 'border-dark-600 relative max-h-8 border-b-2',
                  )}
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />
                {errorMessage.email && emailDebounce && (
                  <p className='text-secondary-500 text-12 absolute -bottom-1.75 left-0 font-semibold'>
                    {errorMessage.email}
                  </p>
                )}
              </div>

              <div
                className={cn(
                  'group relative flex h-14 w-full flex-col items-start gap-1',
                  errorMessage.password && 'pb-1',
                )}
              >
                <p className='font-small-caps text-14 font-semibold'>
                  Password
                </p>

                <input
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  placeholder='Password'
                  className={cn(
                    inputClassName,
                    passwordInput &&
                      'border-dark-600 relative max-h-8 border-b-2',
                  )}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                />
                {passwordDebounce && (
                  <button
                    type='button'
                    className='absolute top-1/2 right-0 -translate-y-1/2 cursor-pointer'
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon fill='weight' size={18} />
                    ) : (
                      <EyeIcon fill='weight' size={18} />
                    )}
                  </button>
                )}
                {errorMessage.password && passwordDebounce && (
                  <p className='text-secondary-500 text-12 absolute -bottom-1.75 left-0 h-fit min-w-[300px] font-semibold'>
                    {errorMessage.password}
                  </p>
                )}
              </div>

              <Button
                className='bg-primary-500 hover:bg-primary-600 font-shantell w-full px-4 py-2'
                type='submit'
                form='login'
                disableAnimation
                disabled={
                  !!errorMessage.email ||
                  !!errorMessage.password ||
                  !emailDebounce ||
                  !passwordDebounce
                }
              >
                {isLogin ? 'Sign In' : 'Sign Up'}
              </Button>
            </form>

            {/* divider */}
            <div className='h-px w-full bg-linear-to-r from-black/[2%] via-black/10 to-black/[2%]' />

            <div className='flex flex-col items-center justify-center gap-2 md:gap-3'>
              <p className='text-dark-600/70 text-14 text-center'>Or</p>
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
                onClick={handleChangeMode}
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
