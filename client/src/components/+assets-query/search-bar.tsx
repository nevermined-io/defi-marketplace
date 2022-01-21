
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
}

const b = BEM('assets-query', styles)

export function XuiSearchBar({ onSearch }: SearchBarProps) {
  const { searchInputText, fromDate, toDate, selectedCategories, setSelectedCategories, setToDate, setFromDate, setSearchInputText } = useContext(User)


  const inputChanges = useCallback((event: any) => {
    setSearchInputText(event.target.value)
  }, [])


  const inputOnEnter = useCallback((event: any) => {
    if (event.key === 'Enter')
      onSearch()
  }, [searchInputText])


  return (
    <>
      <UiDivider />
      <UiLayout>
        <input
          className={b('input')}
          value={searchInputText}
          onChange={inputChanges}
          onKeyDown={inputOnEnter}
          placeholder="Search networks, protocols, DEXES & more..."
        />
        <UiDropdown
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
        <div className={b('form-button')} onClick={onSearch}>
          <UiIcon icon="search" />
        </div>
      </UiLayout>
    </>

  )
}

