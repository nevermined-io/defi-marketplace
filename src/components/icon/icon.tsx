import React, { Props, HTMLAttributes } from 'react'
import { BEM, modList, extendClassName } from 'ui'
import styles from './icon.module.scss'

const icons = {
  folder: (
    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 16.6667H2.49996C2.27878 16.669 2.06609 16.5817 1.91023 16.4247C1.75438 16.2678 1.66862 16.0545 1.67246 15.8333H1.66663V4.16667C1.66663 3.24619 2.41282 2.5 3.33329 2.5H8.33329C8.51943 2.50018 8.70014 2.56266 8.84663 2.6775L10.75 4.16667H15C15.9204 4.16667 16.6666 4.91286 16.6666 5.83333V9.16667H17.5C17.7801 9.1667 18.0414 9.30746 18.1956 9.54133C18.3498 9.77519 18.3762 10.0709 18.2658 10.3283L15.7658 16.1617C15.6345 16.468 15.3333 16.6667 15 16.6667ZM5.54996 10.8333L3.76413 15H14.4508L16.2366 10.8333H5.54996ZM3.33329 5.83333V11.775L4.23413 9.67167C4.36545 9.36533 4.66666 9.1667 4.99996 9.16667H15V5.83333H3.33329Z"/>
    </svg>
  )
}

interface IconProps {
  icon: keyof typeof icons
  color?: 'primary' | 'secondary'
  size?: number | 's' | 'm' | 'l'
}

const b = BEM('icon', styles)
export function UiIcon(props: IconProps & HTMLAttributes<any> & Props<any>) {
  let {icon, size, color} = props
  if (!size) {
    size = 20
  } else {
    switch (size) {
      case 's': size = 16; break
      case 'm': size = 20; break
      case 'l': size = 24; break
    }
  }

  return (
    <div
      className={extendClassName(props, b([color]))}
      style={{
        '--ui-icon-fill': 'currentColor',
        '--ui-icon-size': `${size}px`,
      }}
    >
      {icons[icon]}
    </div>
  )
}
