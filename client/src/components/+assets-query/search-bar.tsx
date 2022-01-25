import React, { useContext, useState, useEffect, useCallback } from 'react'
import Image from "next/image"

import { BEM, UiDropdown, UiIcon, UiLayout, UiDivider, UiText, UiButton } from 'ui'
import { User } from '../../context'
import styles from './assets-query.module.scss'
import { XuiCategoryDropdown } from 'ui/+assets-query/category-dropdown/category-dropdown'
import { XuiFilterDropdown } from 'ui/+assets-query/filter-dropdown/filter-dropdown'

interface SearchBarProps {
  search?: 'onsite' | 'search-page'
  onSearch?: (value?: any) => void
  showButton?: boolean
}

const b = BEM('assets-query', styles)

export function XuiSearchBar({ onSearch, showButton = true }: SearchBarProps) {
  const { fromDate, toDate, selectedCategories, setSelectedCategories, setToDate, setFromDate, setSearchInputText } = useContext(User)

  const [textValue, setTextValue] = useState('')

  //write the text in the serchbar
  const inputChanges = useCallback((event: any) => {
    setTextValue(event.target.value)
  }, [])


  const inputOnEnter = useCallback((event: any) => {
    if (event.key === 'Enter') {
      onSearch ? onSearch(event.target.value) : setSearchInputText(textValue)
    }
  }, [textValue])

  const submitSearch = () => {
    if (onSearch) return onSearch(textValue)
    else setSearchInputText(textValue)
  }

  const resetCategories = () => {
    setSelectedCategories([])
    setToDate('')
    setFromDate('')
    setTextValue('')
    setSearchInputText('')
  }


  return (
    <>
      <UiDivider />
      <UiLayout type='sides' justify='end'>
        {
          (selectedCategories.length || fromDate || toDate) &&
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
          <img src="/assets/search-grey.svg" width="21"/>
        </div>
        <input
          className={b('input')}
          value={textValue}
          onChange={inputChanges}
          onKeyDown={inputOnEnter}
          placeholder="Search networks, protocols, DEXES & more..."
        />
        <UiDropdown
          selected={selectedCategories.length ? true : false}
          imgHeight="6px"
          imgSrc="/assets/arrow.svg"
          title="Category"
          imgWidth="10px"
        >
          <XuiCategoryDropdown
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
        </UiDropdown>
        <UiDropdown
          selected={fromDate || toDate ? true : false}
          imgHeight="10px"
          imgSrc="/assets/filter.svg"
          title="Filters"
          imgWidth="10px"
        >
          <XuiFilterDropdown
            setFromDate={setFromDate}
            setToDate={setToDate}
            fromDate={fromDate}
            toDate={toDate}
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

