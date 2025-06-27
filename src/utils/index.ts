import { twMerge } from 'tailwind-merge'
import { formatUnits } from 'viem'
import { ClassValue, clsx } from './clsx'

export function cn(...args: ClassValue[]) {
  return twMerge(clsx(args))
}

export const truncateAddress = (
  address?: string,
  start: number = 4,
  end: number = 4,
): string => {
  if (typeof address !== 'string' || address.length <= start + end) {
    return address ?? ''
  }

  return `${address.slice(0, start)}...${address.slice(-end)}`
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
