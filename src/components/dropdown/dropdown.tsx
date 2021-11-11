import React, { HTMLAttributes, Props, useEffect, useRef, useState } from 'react'
import { BEM } from 'ui'
import Image from "next/image"
import styles from './dropdown.module.scss'

interface DropdownProps {
  imgHeight: string
  imgSrc: string
  imgWidth: string
  onClickOutside: Function
  title: string
}

const b = BEM('dropdown', styles)

export function UiDropdown(props: DropdownProps & HTMLAttributes<any> & Props<any>) {
  const { children, imgHeight, imgSrc, title, imgWidth } = props
  const [clicked, setClicked] = useState<boolean>(false)
  let ref = useRef(null)

  const handleClickOutside = (event: any) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setClicked(false)
    }
  }
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  })

  return <div className={b('wrapper')} ref={ref}>
    <div className={b('toggle')} onClick={() => {
      setClicked(!clicked)
    }}>
      {title}
      <div className={b(`${clicked ? 'image-wrapper' : 'image-wrapper--clicked'}`)}>
        <Image height={imgHeight} width={imgWidth} src={imgSrc}/>
      </div>
    </div>
    <div className={b('menu')} style={{ display: clicked ? 'block' : 'none' }}>
      {children}
    </div>
  </div>
}
