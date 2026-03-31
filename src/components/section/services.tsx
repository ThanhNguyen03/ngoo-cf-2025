'use client'

// NOTE: 'use client' added to support framer-motion hooks (useRef, useInView).
// services.tsx had no directive before, but it was already bundled as client-side JS
// because page.tsx (its parent) is 'use client'. Adding the directive here makes the
// boundary explicit and allows direct hook usage — zero bundle size regression.

import { cn } from '@/utils'
import {
  BankIcon,
  CurrencyEthIcon,
  MoneyWavyIcon,
} from '@phosphor-icons/react/dist/ssr'
import { motion, useInView } from 'framer-motion'
import { FC, useRef } from 'react'

type TService = {
  icon: React.ReactNode
  title: string
  description: number | string
  // NOTE: isHover added here so ServiceCard text can adapt to dark background.
  // When isHover=true, section bg switches to from-dark-600 — without this fix,
  // text-violet-700 and text-dark-600 become invisible on the dark bg (WCAG AA fail).
  isHover?: boolean
}

const ServiceCard: FC<TService> = ({ icon, description, title, isHover }) => {
  return (
    // Mobile-first: horizontal layout (icon + text side by side) on small screens
    // md: switches to vertical centered card layout for desktop grid
    <div className='flex w-full gap-6 lining-nums md:min-h-50 md:max-w-60 md:flex-col md:items-center md:gap-3 md:text-center'>
      {icon}
      <div className='flex flex-col justify-center py-4 md:p-0'>
        <p
          className={cn(
            'text-16 font-semibold transition-colors duration-500',
            // NOTE: duration-500 matches the section background transition duration
            // so text and background color shift finish at the same time.
            isHover ? 'text-primary-300' : 'text-violet-700',
          )}
        >
          {title}
        </p>
        <p
          className={cn(
            'text-14 transition-colors duration-500',
            isHover ? 'text-beige-300/80' : 'text-dark-600',
          )}
        >
          {description}
        </p>
      </div>
    </div>
  )
}

type TServicesProps = {
  isHover?: boolean
}

const LIST_SERVICE_DATA: TService[] = [
  {
    icon: (
      <div className='flex size-20 items-center justify-center'>
        <MoneyWavyIcon size={70} weight='fill' className='text-tint-300' />
      </div>
    ),
    title: 'COD',
    description:
      'Cash on Delivery (COD), simple and familiar for everyone, ensuring safety and convenience in every transaction.',
  },
  {
    icon: (
      <div className='flex size-20 items-center justify-center'>
        <BankIcon size={70} weight='fill' className='text-orange-500' />
      </div>
    ),
    title: 'Banking',
    description:
      'Fast and reliable bank transfers, supporting most major banks in Vietnam with secure and seamless payments.',
  },
  {
    icon: (
      <div className='flex size-20 items-center justify-center'>
        <CurrencyEthIcon size={70} weight='fill' className='text-shade-700' />
      </div>
    ),
    title: 'Cryptography',
    description:
      'Pay with cryptocurrencies like ETH or USDT – borderless, secure, and tailored for Web3 users.',
  },
]

export const Services: FC<TServicesProps> = ({ isHover }) => {
  // Ref used to detect when the section enters the viewport for scroll animations
  const sectionRef = useRef<HTMLElement>(null)

  // NOTE: once: true — animation fires once on first scroll-in, then detaches the
  // IntersectionObserver. Prevents re-triggering on scroll-up, which feels unpolished.
  // margin: '-15%' means trigger fires when 15% of viewport has scrolled past section top —
  // gives a slight delay so cards animate in when they're comfortably visible.
  const inView = useInView(sectionRef, { once: true, margin: '-15%' })

  return (
    <section
      ref={sectionRef}
      className={cn(
        // Mobile-first padding: small → md → lg
        'relative overflow-hidden px-2 pt-20 pb-10 md:px-6 md:pt-30 md:pb-20 lg:px-10 lg:pt-40 lg:pb-30',
        isHover
          ? 'from-dark-600 bg-linear-to-b to-white to-20%'
          : 'bg-linear-to-b from-[#dfd7be] to-white to-20%',
      )}
    >
      <div className='mx-auto flex w-full max-w-[1200px] flex-col gap-4 md:gap-6 lg:gap-10'>
        {/* Heading block animates in first, then cards stagger in after */}
        <motion.div
          className='flex flex-col items-start gap-2'
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* NOTE: Heading changed from "Services" (generic, zero SEO value) to
              "Payment Methods" — directly describes the section content and matches
              user search intent ("how to pay", "payment methods coffee online").
              Also adapts color when bg goes dark (isHover). */}
          <h2
            className={cn(
              'text-18 font-small-caps w-fit font-semibold transition-colors duration-500',
              isHover ? 'text-beige-300' : 'text-primary-600',
            )}
          >
            Payment Methods
          </h2>
          {/* NOTE: Subheading changed from "We offer the best services" (filler, self-
              congratulatory) to "Choose how you pay — your way" which communicates user
              control and flexibility. More engaging, more specific. */}
          <p
            className={cn(
              'text-23 font-semibold transition-colors duration-500',
              isHover ? 'text-beige-50' : 'text-dark-600/70',
            )}
          >
            Choose how you pay — your way
          </p>
        </motion.div>

        {/* NOTE: staggerChildren animates cards sequentially (0.15s apart) rather
            than all-at-once. delayChildren: 0.15 gives the heading time to finish
            its own entrance (0.5s) before cards start. This creates a choreographed
            "reveal" that guides the user's eye from label → title → card1 → card2 → card3. */}
        <motion.div
          className='flex flex-col justify-between gap-6 md:flex-row md:items-center md:gap-10'
          initial='hidden'
          animate={inView ? 'visible' : 'hidden'}
          variants={{
            visible: {
              transition: { staggerChildren: 0.15, delayChildren: 0.15 },
            },
          }}
        >
          {LIST_SERVICE_DATA.map((data) => (
            <motion.div
              key={data.title}
              variants={{
                hidden: { opacity: 0, y: 28 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.45, ease: 'easeOut' },
                },
              }}
            >
              <ServiceCard {...data} isHover={isHover} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
