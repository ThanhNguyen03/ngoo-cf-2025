import { TIconProps } from '@/types'
import { FC } from 'react'

const SaleTagIcon: FC<TIconProps> = ({
  fill = '#E63946',
  size = 32,
  text = 'Sale',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 256 256'
      xmlns='http://www.w3.org/2000/svg'
    >
      <defs>
        <linearGradient id='tagGradient' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stopColor={fill} />
          <stop offset='100%' stopColor='#00000022' />
        </linearGradient>
      </defs>
      <path
        d='M246.66,123.56L201,55.12A16,16,0,0,0,187.72,48H32a8,8,0,0,0-6.66,12.44L70.39,128l-45,67.56A8,8,0,0,0,32,208H187.72A16,16,0,0,0,201,200.88l45.63-68.44A8,8,0,0,0,246.66,123.56ZM187.72,192H47l39.71-59.56a8,8,0,0,0,0-8.88L47,64H187.72l42.67,64Z'
        fill='url(#tagGradient)'
      />
      <text
        x='50%'
        y='55%'
        dominantBaseline='middle'
        textAnchor='middle'
        fontSize={12}
        fill='#fff'
        fontWeight='bold'
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        {text}
      </text>
    </svg>
  )
}

export default SaleTagIcon
