export type ClassValue =
  | ClassArray
  | ClassDictionary
  | string
  | number
  | bigint
  | null
  | boolean
  | undefined
export type ClassDictionary = Record<string, unknown>
export type ClassArray = ClassValue[]

function toVal(mix: ClassValue): string {
  let str = ''

  if (typeof mix === 'string' || typeof mix === 'number') {
    str += mix
  } else if (Array.isArray(mix)) {
    for (let i = 0; i < mix.length; i += 1) {
      const y = mix[i] && toVal(mix[i])
      if (y) {
        if (str) str += ' '
        str += y
      }
    }
  } else if (mix && typeof mix === 'object') {
    for (const key in mix) {
      if (mix[key]) {
        if (str) str += ' '
        str += key
      }
    }
  }

  return str
}

export function clsx(...args: ClassValue[]): string {
  let str = ''
  for (let i = 0; i < args.length; i += 1) {
    const x = toVal(args[i])
    if (x) {
      if (str) str += ' '
      str += x
    }
  }
  return str
}
