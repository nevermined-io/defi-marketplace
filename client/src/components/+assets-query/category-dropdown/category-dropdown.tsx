import React, { useContext, useState } from 'react'

import { BEM } from 'ui'
import Image from "next/image"

import styles from './category-dropdown.module.scss'
import { User } from 'src/context'

interface CategoryDropdownProps {
  selectedCategories: string[]
  setSelectedCategories: Function
}

const b = BEM('category-dropdown', styles)

const lendingCategories = ['Borrows', 'Deposits', 'Liquidations', 'Repays', 'Redeems', 'Flashloans']
const DEXCategories = ['Trades', 'Liquidity']

export function XuiCategoryDropdown(props: CategoryDropdownProps) {
  const { selectedCategories, setSelectedCategories} = useContext(User)
  const [expandLending, setExpandLending] = useState<boolean>(true)
  const [expandDEX, setExpandDEX] = useState<boolean>(false)

  return <div className={b('wrapper')}>
    <div
      className={b('item')}
      onClick={() => setExpandLending(!expandLending)}
    >
      <h3 className={b('group')}>Lending protocols</h3>
      <Image
        height="25px"
        src={expandLending ? "/assets/more-blue.svg" : "/assets/more.svg"}
        width="25px"
      />
    </div>
    {expandLending && <ul>
      {lendingCategories.map(category =>
        <li
          key={category}
          onClick={() => selectedCategories.includes(category) ?
            setSelectedCategories(selectedCategories.filter(selectedCategory => selectedCategory !== category)) :
            setSelectedCategories(selectedCategories.concat(category))
          }
        >
          {category}
          <Image
            height="13px"
            src={selectedCategories.includes(category) ? "/assets/checked_box.svg" : "/assets/unchecked_box.svg"}
            width="13px"
          /></li>)}
    </ul>}
    <hr/>
    <div
      className={b('item')}
      onClick={() => setExpandDEX(!expandDEX)}
    >
      <h3 className={b('group')}>DEX Protocols</h3>
      <Image
        height="25px"
        src={expandDEX ? "/assets/more-blue.svg" : "/assets/more.svg"}
        width="25px"
      />
    </div>
    {expandDEX && <ul>
      {DEXCategories.map(category =>
        <li
          key={category}
          onClick={() => selectedCategories.includes(category) ?
            setSelectedCategories(selectedCategories.filter(selectedCategory => selectedCategory !== category)) :
            setSelectedCategories(selectedCategories.concat(category))
          }
        >
          {category}
          <Image
            height="13px"
            src={selectedCategories.includes(category) ? "/assets/checked_box.svg" : "/assets/unchecked_box.svg"}
            width="13px"
          /></li>)}
    </ul>}
  </div>
}
