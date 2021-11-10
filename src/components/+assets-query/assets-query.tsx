import React, { ReactNode, Props, useContext, useState, useEffect, useCallback } from 'react'
import { DDO } from '@nevermined-io/nevermined-sdk-js'
import { SearchQuery } from '@nevermined-io/nevermined-sdk-js/dist/node/metadata/Metadata'

import { BEM, modList, UiDropdown, UiButton, UiIcon, UiLayout, UiDivider, UiText } from 'ui'
import { User } from '../../context'
import styles from './assets-query.module.scss'
import { XuiCategoryDropdown } from 'ui/+assets-query/category-dropdown/category-dropdown'

interface AssetsQueryProps {
  search?: 'onsite' | 'search-page'
  query?: SearchQuery['query']
  pageSize?: number
  content: (assets: DDO[]) => ReactNode | undefined;
}

const b = BEM('assets-query', styles)

export function XuiAssetsQuery({ search, content, pageSize = 12 }: AssetsQueryProps) {
  const categoryFilter = 'defi-datasets' // Must be defined on config
  const { sdk } = useContext(User)

  const [assets, setAssets] = useState<DDO[]>([])
  const [totalPages, setTotalPages] = useState<number>(1)
  const [page, setPage] = useState<number>(1)

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  // searchInputText is used to set searchText when click on search
  const [searchInputText, setSearchInputText] = useState('')
  const [searchText, setSearchText] = useState('')

  const textFilter = { "query_string": { "query": `*${searchText}*`, "fields": ["service.attributes.main.name"] } }
  const datasetCategory = { "match": { "service.attributes.additionalInformation.categories": selectedCategories.length === 0 ? "defi-datasets" : selectedCategories.join(', ') } }
  const mustArray = [textFilter, datasetCategory]

  const query = {
    "bool": { "must": mustArray }
  }

  useEffect(() => {
    if (!sdk.assets) {
      return
    }
    sdk.assets
      .query({
        offset: pageSize,
        page,
        query: query!,
        sort: {
          created: -1
        }
      })
      .then(({ results, totalPages }) => {
        setAssets(results)
        setTotalPages(totalPages)
      })
  }, [sdk, page, JSON.stringify(query)])

  const inputChanges = useCallback((event: any) => {
    setSearchInputText(event.target.value)
  }, [])

  const onSearch = useCallback(() => {
    setSearchText(searchInputText)
  }, [searchInputText])

  const inputOnEnter = useCallback((event: any) => {
    if (event.key === 'Enter')
      onSearch()
  }, [searchInputText])

  return (
    <>
      {search && (
        /* Move to components*/
        <>
          <UiDivider/>
          <UiLayout>
            <input
              className={b('input')}
              value={searchInputText}
              onChange={inputChanges}
              onKeyDown={inputOnEnter}
              placeholder="Search..."
            />
            <UiDropdown>
              <XuiCategoryDropdown
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
              />
            </UiDropdown>
            <div className={b('form-button')} onClick={onSearch}>
              <UiIcon icon="search"/>
            </div>
          </UiLayout>
          <UiDivider/>
        </>
      )}

      {content(assets)}

      {totalPages > 1 && (
        <>
          <UiDivider type="l"/>
          <UiLayout justify="center" align="center">
            <UiButton square type="alt" disabled={page === 1} onClick={() => setPage(page - 1)}>
              <UiIcon icon="arrowLeft"/>
            </UiButton>
            <UiDivider vertical/>
            <UiText variants={['detail', 'bold']}>{page} / {totalPages}</UiText>
            <UiDivider vertical/>
            <UiButton square type="alt" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
              <UiIcon icon="arrowRight"/>
            </UiButton>
          </UiLayout>
        </>
      )}
    </>
  )
}
