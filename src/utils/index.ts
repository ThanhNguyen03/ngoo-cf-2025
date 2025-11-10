import { twMerge } from 'tailwind-merge'
import { formatUnits } from 'viem'
import { ClassValue, clsx } from './clsx'
import { toast } from '@/components/ui'

export function cn(...args: ClassValue[]) {
  return twMerge(clsx(args))
}

export const truncateAddress = (input: string, nums?: number): string => {
  if (input.length <= 10) {
    return input
  }
  const start = input.slice(0, nums || 5) // First 5 characters
  const end = input.slice(nums ? nums * -1 : -5) // Last 5 characters
  return `${start}...${end}`
}

export const formatBalance = (
  value: bigint,
  decimals: number,
  symbol: string,
) => {
  const formattedValue = formatUnits(value, decimals)

  return {
    toFixed: (fractionDigits: number = 5) =>
      `${Number(formattedValue).toFixed(fractionDigits)} ${symbol}`,
    toPrecision: (precision: number = 5) =>
      `${parseFloat(formattedValue).toPrecision(precision)} ${symbol}`,
    rawValue: `${formattedValue} ${symbol}`,
  }
}

/**
 * Formats a number with thousands separators and decimal places
 *
 * @param value - The number to format (number, string, or bigint)
 * @param minimumFractionDigits - Minimum number of decimal places (default: 0)
 * @param maximumFractionDigits - Maximum number of decimal places, use Infinity to preserve all decimals (default: 2)
 * @returns Formatted number string with locale formatting
 *
 * @example
 * formatNumber(1234.5) // "1,234.5"
 * formatNumber(1234.567, 0, 2) // "1,234.57"
 * formatNumber(123456.123456789, 0, Infinity) // "123,456.123456789"
 * formatNumber(1234n) // "1,234"
 * formatNumber("1234.5", 2, 2) // "1,234.50"
 */
export const formatNumber = (
  value: number | string | bigint,
  minimumFractionDigits = 0,
  maximumFractionDigits = 2,
): string => {
  // Handle bigint - convert to number for formatting
  if (typeof value === 'bigint') {
    return Number(value).toLocaleString('en-US', {
      minimumFractionDigits,
      maximumFractionDigits,
    })
  }

  // Handle number and string
  const num = typeof value === 'number' ? value : parseFloat(value)
  if (isNaN(num)) return '0'

  // For Infinity maximumFractionDigits, manually format to preserve all decimals
  if (maximumFractionDigits === Infinity) {
    const [integer, decimal] = num.toString().split('.')
    const formattedInteger = parseInt(integer).toLocaleString('en-US')
    return decimal ? `${formattedInteger}.${decimal}` : formattedInteger
  }

  return num.toLocaleString('en-US', {
    minimumFractionDigits,
    maximumFractionDigits,
  })
}

const USER_REJECT_TRANSACTION_ERROR_MESSAGE = 'User rejected the request.'
/**
 * Log the error and show error toast with appropriate message.
 *
 * @param error - The error to handle
 * @param customErrorMessage - Custom error message
 * @param isDevMode - Optional flag to control error message to show toast (default: true)
 */
export const handleError = (
  error: unknown,
  customErrorMessage: string,
  isDevMode: boolean = true,
) => {
  let errorMessage = customErrorMessage

  if (error instanceof Error) {
    const { message } = error

    // Internal errors — show actual message without prefix
    // if (message.startsWith(INTERNAL_ERROR_PREFIX)) {
    //   errorMessage = message.slice(INTERNAL_ERROR_PREFIX.length)
    // }

    // User rejected transaction
    if (message.includes(USER_REJECT_TRANSACTION_ERROR_MESSAGE)) {
      errorMessage = USER_REJECT_TRANSACTION_ERROR_MESSAGE
    }

    // Non-production: show full error message for debugging
    errorMessage = isDevMode
      ? `${customErrorMessage}:\n${message}`
      : customErrorMessage
  }

  // Log details in dev, only simplified message in prod
  if (isDevMode) {
    console.error(customErrorMessage, error)
  } else {
    console.error(errorMessage)
  }

  toast.error(errorMessage)
}
