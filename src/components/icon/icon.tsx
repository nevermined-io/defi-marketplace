import React, { Props, HTMLAttributes } from 'react'
import { BEM, modList, extendClassName } from 'ui'
import styles from './icon.module.scss'

const icons = {
  folder: (
    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 16.6667H2.49996C2.27878 16.669 2.06609 16.5817 1.91023 16.4247C1.75438 16.2678 1.66862 16.0545 1.67246 15.8333H1.66663V4.16667C1.66663 3.24619 2.41282 2.5 3.33329 2.5H8.33329C8.51943 2.50018 8.70014 2.56266 8.84663 2.6775L10.75 4.16667H15C15.9204 4.16667 16.6666 4.91286 16.6666 5.83333V9.16667H17.5C17.7801 9.1667 18.0414 9.30746 18.1956 9.54133C18.3498 9.77519 18.3762 10.0709 18.2658 10.3283L15.7658 16.1617C15.6345 16.468 15.3333 16.6667 15 16.6667ZM5.54996 10.8333L3.76413 15H14.4508L16.2366 10.8333H5.54996ZM3.33329 5.83333V11.775L4.23413 9.67167C4.36545 9.36533 4.66666 9.1667 4.99996 9.16667H15V5.83333H3.33329Z"/>
    </svg>
  ),
  tag: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.7475 18.3066C10.305 18.308 9.88035 18.1321 9.56834 17.8183L3.04 11.2891C2.6955 10.9456 2.51885 10.4683 2.55667 9.9833L2.97334 4.51164C3.03275 3.68862 3.6885 3.03465 4.51167 2.97747L9.98334 2.5608C10.0258 2.55164 10.0692 2.55164 10.1117 2.55164C10.5532 2.55277 10.9764 2.72828 11.2892 3.03997L17.8183 9.5683C18.131 9.88088 18.3067 10.3049 18.3067 10.7471C18.3067 11.1892 18.131 11.6132 17.8183 11.9258L11.9258 17.8183C11.614 18.1319 11.1897 18.3077 10.7475 18.3066ZM10.1108 4.2183L4.635 4.63497L4.21834 10.1108L10.7475 16.64L16.6392 10.7483L10.1108 4.2183ZM7.21167 8.87831C6.41654 8.87847 5.73201 8.31694 5.57674 7.53711C5.42146 6.75729 5.83868 5.97637 6.57323 5.67195C7.30778 5.36753 8.15508 5.6244 8.59694 6.28545C9.03881 6.94651 8.95216 7.82764 8.39 8.38997C8.0782 8.70357 7.6539 8.87941 7.21167 8.87831Z"/>
    </svg>
  ),
  download: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 22H5V20H19V22ZM12 18L6 12L7.41 10.59L11 14.17V2H13V14.17L16.59 10.59L18 12L12 18Z" fill="#A97DFB"/>
    </svg>
  ),
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
