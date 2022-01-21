
import React, { ReactNode, useContext, useState, useEffect, useCallback } from 'react'
import { DDO } from '@nevermined-io/nevermined-sdk-js'
import { SearchQuery } from '@nevermined-io/nevermined-sdk-js/dist/node/metadata/Metadata'

import { BEM, UiDropdown, UiButton, UiIcon, UiLayout, UiDivider, UiText } from 'ui'
import { User } from '../../context'
import styles from './assets-query.module.scss'
import { XuiCategoryDropdown } from 'ui/+assets-query/category-dropdown/category-dropdown'
import { XuiFilterDropdown } from 'ui/+assets-query/filter-dropdown/filter-dropdown'
import { Loader } from 'ui/Loader/loader'
import { getAttributes, getCategories, getVersion, sortBy } from '../../shared'
import { subcategoryPrefix } from '../../shared/constants'
import { XuiPagination } from './pagination'
import Router from 'next/router'

interface SearchBarProps {
  search?: 'onsite' | 'search-page'
  onSearch: () => void
  buttonSide?: 'left' | 'right'
  showButton?: boolean
}

const b = BEM('assets-query', styles)

export function XuiSearchBar({ onSearch, buttonSide = 'right', showButton = true }: SearchBarProps) {
  const { searchInputText, fromDate, toDate, selectedCategories, setSelectedCategories, setToDate, setFromDate, setSearchInputText } = useContext(User)

  const [textValue, setTextValue] = useState('')

  //write the text in the serchbar and trigger the query after 1,5 seconds
  const inputChanges = useCallback((event: any) => {
    setTextValue(event.target.value)
    setTimeout(() => {
      setSearchInputText(event.target.value)
    }, 1500)
  }, [])


  const inputOnEnter = useCallback((event: any) => {
    if (event.key === 'Enter')
      onSearch()
  }, [searchInputText])


  return (
    <>
      <UiDivider />
      <UiLayout>
        {(buttonSide === 'left' && showButton) &&
          <div className={b('form-button')} onClick={onSearch}>
            <UiIcon icon="search" />
          </div>
        }
        <input
          className={b('input')}
          value={textValue}
          onChange={inputChanges}
          onKeyDown={inputOnEnter}
          placeholder="Search networks, protocols, DEXES & more..."
        />
          <UiDropdown
            selected={ selectedCategories.length ? true : false }
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
          selected={ fromDate || toDate? true : false }
          imgHeight="10px"
          imgSrc="/assets/filter.svg"
          title="More filters"
          imgWidth="10px"
        >
          <XuiFilterDropdown
            setFromDate={setFromDate}
            setToDate={setToDate}
            fromDate={fromDate}
            toDate={toDate}
          />
        </UiDropdown>
        {(buttonSide === 'right' && showButton) &&
          <div className={b('form-button')} onClick={onSearch}>
            <UiIcon icon="search" />
          </div>
        }
      </UiLayout>
    </>

  )
}

