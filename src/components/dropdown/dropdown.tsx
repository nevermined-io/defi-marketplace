import React, { HTMLAttributes, Props, useState } from 'react'
import { BEM } from 'ui'
import Image from "next/image"
import styles from './dropdown.module.scss'

interface DropdownProps {
}

const b = BEM('dropdown', styles)

export function UiDropdown(props: DropdownProps & HTMLAttributes<any> & Props<any>) {
  const { children } = props
  const [clicked, setClicked] = useState<boolean>(false)

  return <div className={b('wrapper')}>
    <div className={b('toggle')} onClick={() => {
      setClicked(!clicked)
    }}>
      Category
      <div className={b(`${clicked ? 'image-wrapper' : 'image-wrapper--clicked'}`)}>
        <Image height="6px" width="10px" src="/assets/arrow.svg"/>
      </div>
    </div>
    <div className={b('menu')} style={{ display: clicked ? 'block' : 'none' }}>
      {children}
    </div>
  </div>
}
