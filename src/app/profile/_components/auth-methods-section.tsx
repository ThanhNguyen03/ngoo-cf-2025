'use client'

import { SwitchButton, toast } from '@/components/ui'
import { TextInput } from '@/components/ui/TextInput'
import {
  EAuthMethod,
  UserLinkCredentialDocument,
} from '@/lib/graphql/generated/graphql'
import { apolloWrapper } from '@/utils'
import { useApolloClient } from '@apollo/client/react'
import {
  CheckCircleIcon,
  GoogleLogoIcon,
  KeyIcon,
} from '@phosphor-icons/react/dist/ssr'
import { signIn } from 'next-auth/react'
import { type FC, useState } from 'react'

type TAuthMethodsSectionProps = {
  authMethods: Array<EAuthMethod | null>
  onLinkSuccess: () => Promise<void>
}

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,16}$/

export const AuthMethodsSection: FC<TAuthMethodsSectionProps> = ({
  authMethods,
  onLinkSuccess,
}) => {
  const client = useApolloClient()
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | undefined>()
  const [isLinking, setIsLinking] = useState(false)

  const hasCredential = authMethods.includes(EAuthMethod.Credential)
  const hasGoogle = authMethods.includes(EAuthMethod.Google)

  const validatePassword = (value: string) => {
    if (!value) return 'Password is required'
    if (value.length < 8 || value.length > 16)
      return 'Password must be 8–16 characters'
    if (!PASSWORD_REGEX.test(value))
      return 'Password must include uppercase, lowercase, number, and special character'
    return undefined
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setPasswordError(validatePassword(e.target.value))
  }

  const handleLinkCredential = apolloWrapper(
    async () => {
      const error = validatePassword(password)
      if (error) {
        setPasswordError(error)
        return
      }
      setIsLinking(true)
      toast.info('Linking password...', { progressBar: true, id: 'link-credential' })
      const { error: mutationError } = await client.mutate({
        mutation: UserLinkCredentialDocument,
        variables: { password },
      })
      if (mutationError) throw mutationError
      toast.success('Password added successfully!', { id: 'link-credential' })
      setShowPasswordForm(false)
      setPassword('')
      await onLinkSuccess()
    },
    {
      onFinally: () => {
        setIsLinking(false)
        toast.close('link-credential')
      },
    },
  )

  const handleLinkGoogle = () => {
    signIn('google', { callbackUrl: '/profile?tab=profile' })
  }

  return (
    <div className='rounded-2 border-dark-600/10 flex w-full flex-col overflow-hidden border bg-white'>
      <div className='to-beige-100 via-beige-50 text-16 border-dark-600/10 text-dark-600 from-beige-50 border-b bg-gradient-to-r px-3 py-2 font-semibold'>
        Login Methods
      </div>
      <div className='flex w-full flex-col gap-1 px-3 py-4'>
        {/* Credential row */}
        <div className='flex items-center justify-between rounded-xl px-2 py-3'>
          <div className='flex items-center gap-3'>
            <KeyIcon size={20} className='text-dark-600/60' />
            <span className='text-14 text-dark-600 font-medium'>Email &amp; Password</span>
          </div>
          {hasCredential ? (
            <div className='flex items-center gap-1.5 text-kiwi-500'>
              <CheckCircleIcon size={16} weight='fill' />
              <span className='text-13 font-semibold'>Linked</span>
            </div>
          ) : (
            <SwitchButton
              variant='white'
              className='text-13 rounded-2! h-8 min-h-8 w-fit px-3 font-semibold'
              onClick={() => setShowPasswordForm((v) => !v)}
            >
              {showPasswordForm ? 'Cancel' : 'Link'}
            </SwitchButton>
          )}
        </div>

        {/* Inline password form */}
        {showPasswordForm && !hasCredential && (
          <div className='border-dark-600/10 mx-2 flex flex-col gap-3 rounded-xl border bg-white p-4'>
            <TextInput
              label='New Password'
              type='password'
              value={password}
              onChange={handlePasswordChange}
              errorMessage={passwordError}
              placeholder='8–16 chars, upper + lower + number + special'
            />
            <SwitchButton
              className='text-14 rounded-3! ml-auto h-10 min-h-10 w-fit font-semibold text-white'
              disabled={!!passwordError || !password || isLinking}
              onClick={handleLinkCredential}
            >
              {isLinking ? 'Saving...' : 'Save Password'}
            </SwitchButton>
          </div>
        )}

        {/* Google row */}
        <div className='flex items-center justify-between rounded-xl px-2 py-3'>
          <div className='flex items-center gap-3'>
            <GoogleLogoIcon size={20} className='text-dark-600/60' />
            <span className='text-14 text-dark-600 font-medium'>Google</span>
          </div>
          {hasGoogle ? (
            <div className='flex items-center gap-1.5 text-kiwi-500'>
              <CheckCircleIcon size={16} weight='fill' />
              <span className='text-13 font-semibold'>Linked</span>
            </div>
          ) : (
            <SwitchButton
              variant='white'
              className='text-13 rounded-2! h-8 min-h-8 w-fit px-3 font-semibold'
              onClick={handleLinkGoogle}
            >
              Link
            </SwitchButton>
          )}
        </div>
      </div>
    </div>
  )
}
