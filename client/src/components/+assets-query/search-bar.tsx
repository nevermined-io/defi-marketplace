import React, { useContext, useState, useCallback } from 'react'
import Image from 'next/image'

import { BEM, UiLayout, UiDivider, UiButton } from '@nevermined-io/styles'
import { UiDropdown } from '@nevermined-io/styles'
import { User } from '../../context'
import styles from './assets-query.module.scss'
import { XuiCategoryDropdown } from 'ui/+assets-query/category-dropdown/category-dropdown'
import { XuiFilterDropdown } from 'ui/+assets-query/filter-dropdown/filter-dropdown'

interface SearchBarProps {
  search?: 'onsite' | 'search-page'
  onSearch?: (searchString?: any, priceRange?: any) => void
}

const b = BEM('assets-query', styles)

export function XuiSearchBar({ onSearch }: SearchBarProps) {
  const {
    selectedCategories,
    setSelectedCategories,
    setSearchInputText,
    setSelectedSubscriptions,
    dropdownFilters,
    clearDropdownFilters
  } = useContext(User)
  const { selectedNetworks, selectedSubscriptions, selectedSubtypes, fromDate, toDate } =
    dropdownFilters

  const [textValue, setTextValue] = useState('')

  //write the text in the serchbar
  const inputChanges = useCallback((event: any) => {
    setTextValue(event.target.value)
  }, [])

  const inputOnEnter = useCallback(
    (event: any) => {
      if (event.key === 'Enter') {
        onSearch ? onSearch(event.target.value) : setSearchInputText(textValue)
      }
    },
    [textValue]
  )

  const submitSearch = () => {
    if (onSearch) return onSearch(textValue)
    else {
      setSearchInputText(textValue)
    }
  }

  const resetCategories = () => {
    setSelectedCategories([])
    clearDropdownFilters()
    setTextValue('')
    setSearchInputText('')
  }

  return (
    <>
      <UiDivider />
      <UiLayout type="sides" justify="end">
        {(selectedCategories.length ||
          selectedNetworks.length > 0 ||
          setSelectedSubscriptions.length > 0 ||
          selectedSubtypes.length > 0 ||
          fromDate ||
          toDate) && (
          <div onClick={resetCategories} className={b('clear-div')}>
            <span className={b('clear-div', ['clear-button'])}>Clear</span>
            <span className={b('clear-div')}>
              <Image width="10" height="10" src="/assets/blue-cross.svg" />
            </span>
          </div>
        )}
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
          <XuiCategoryDropdown />
        </UiDropdown>
        <UiDropdown
          selected={
            fromDate || toDate || selectedNetworks.length
              ? true
              : false || selectedSubscriptions.length
              ? true
              : false || selectedSubtypes.length
              ? true
              : false
          }
          imgHeight="10px"
          imgSrc="/assets/filter.svg"
          title="Filters"
          imgWidth="10px"
        >
          <XuiFilterDropdown />
        </UiDropdown>
        <div className={b('form-button')} onClick={submitSearch}>
          <UiButton
            cover
            style={{
              fontSize: '18px',
              fontWeight: 'normal',
              height: '64px',
              textTransform: 'none'
            }}
          >
            Search
          </UiButton>
        </div>
      </UiLayout>
    </>
  )
}
