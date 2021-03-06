import React, { useContext, useState, useCallback } from 'react'
import Image from "next/image"

import { BEM, UiLayout, UiDivider, UiButton } from '@nevermined-io/styles'
import { UiDropdown } from '@nevermined-io/styles'
import { User } from '../../context'
import styles from './assets-query.module.scss'
import { XuiCategoryDropdown } from 'ui/+assets-query/category-dropdown/category-dropdown'
import { XuiFilterDropdown } from 'ui/+assets-query/filter-dropdown/filter-dropdown'

interface SearchBarProps {
  search?: 'onsite' | 'search-page'
  onSearch?: (searchString?: any, priceRange?:any) => void
}

const b = BEM('assets-query', styles)

export function XuiSearchBar({ onSearch }: SearchBarProps) {
  const { fromDate, toDate, selectedCategories, selectedNetworks, selectedPrice, setSelectedCategories, setToDate, setFromDate, setSearchInputText, setSelectedNetworks, setSelectedPriceRange } = useContext(User)

  const [textValue, setTextValue] = useState('')
  const [priceValue, setPriceValue] = useState<number>(0)

  //write the text in the serchbar
  const inputChanges = useCallback((event: any) => {
    setTextValue(event.target.value)
  }, [])


  const inputOnEnter = useCallback((event: any) => {
    if (event.key === 'Enter') {
      onSearch ? onSearch(event.target.value, priceValue) : setSearchInputText(textValue)
    }
  }, [textValue])

  const submitSearch = () => {
    if (onSearch) return onSearch(textValue, priceValue)
    else {
      setSearchInputText(textValue)
      setSelectedPriceRange(priceValue)
    }
  }

  const resetCategories = () => {
    setSelectedCategories([])
    setSelectedNetworks([])
    setToDate('')
    setFromDate('')
    setTextValue('')
    setSearchInputText('')
    setSelectedPriceRange(0)
  }

  const setPriceRange = (price: number) => {
    setPriceValue(price)
  }


  return (
    <>
      <UiDivider />
      <UiLayout type='sides' justify='end'>
        {
          (selectedCategories.length || selectedNetworks.length > 0 || fromDate || toDate || selectedPrice > 0) &&
          <div onClick={resetCategories} className={b('clear-div')} >
            <span className={b('clear-div', ['clear-button'])} >
              Clear
            </span>
            <span className={b('clear-div')} >
              <Image width="10" height="10" src="/assets/blue-cross.svg" />
            </span>
          </div>
        }
      </UiLayout>
      <UiLayout>
        <div className={b('search-icon')}>
          <img src="/assets/search-grey.svg" width="21" />
        </div>
        <input
          className={b('input')}
          value={textValue}
          onChange={inputChanges}
          onKeyDown={inputOnEnter}
          placeholder="Search protocols..."
        />
        <UiDropdown
          selected={selectedCategories.length ? true : false}
          imgHeight="6px"
          imgSrc="/assets/arrow.svg"
          title="Category"
          imgWidth="10px"
        >
          <XuiCategoryDropdown/>
        </UiDropdown>
        <UiDropdown
          selected={fromDate || toDate || selectedPrice > 0 || selectedNetworks.length ? true : false}
          imgHeight="10px"
          imgSrc="/assets/filter.svg"
          title="Filters"
          imgWidth="10px"
        >
          <XuiFilterDropdown
            setPriceRange={setPriceRange}
          />
        </UiDropdown>
        <div className={b('form-button')} onClick={submitSearch}>
          <UiButton
            cover
            style={{ fontSize: '18px', fontWeight: 'normal', height: '64px', textTransform: 'none' }}
          >Search</UiButton>
        </div>
      </UiLayout>
    </>

  )
}

