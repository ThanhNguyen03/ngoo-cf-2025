import { twMerge } from 'tailwind-merge'
import { formatUnits } from 'viem'
import { ClassValue, clsx } from './clsx'

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
