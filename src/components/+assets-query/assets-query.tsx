import React, { ReactNode, useContext, useState, useEffect, useCallback } from 'react'
import { DDO } from '@nevermined-io/nevermined-sdk-js'
import { SearchQuery } from '@nevermined-io/nevermined-sdk-js/dist/node/metadata/Metadata'

import { BEM, UiDropdown, UiButton, UiIcon, UiLayout, UiDivider, UiText } from 'ui'
import { User } from '../../context'
import styles from './assets-query.module.scss'
import { XuiCategoryDropdown } from 'ui/+assets-query/category-dropdown/category-dropdown'
import { XuiFilterDropdown } from 'ui/+assets-query/filter-dropdown/filter-dropdown'
import { Loader } from 'ui/Loader/loader'
import { getAttributes, getCategories, getVersion, sortBy, uniqByKeepLastReverse } from '../../shared'

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
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [loading, setLoading] = useState<boolean>(false)

  const textFilter = { "query_string": { "query": `*${searchText}*`, "fields": ["service.attributes.main.name"] } }
  const datasetCategory = { "match": { "service.attributes.additionalInformation.categories": selectedCategories.length === 0 ? "defi-datasets" : selectedCategories.join(', ') } }
  const dateFilter = fromDate !== '' && toDate !== '' && {
    "range": {
      "service.attributes.main.dateCreated": {
        "time_zone": "+01:00",
        "gte": fromDate,
        "lte": toDate
      }
    }
  }
  const mustArray = [textFilter, datasetCategory]
  dateFilter && mustArray.push(dateFilter)

  const query = {
    "bool": { "must": mustArray }
  }

  useEffect(() => {
    if (!sdk.assets) {
      return
    }
    setLoading(true)
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
        const sortedResults = sortBy(results, (res: DDO) => getVersion(getCategories(getAttributes(res))))
        const dedupedResults = uniqByKeepLastReverse(sortedResults, (res: DDO) => `${(getAttributes(res)).main.name}${(getAttributes(res)).main.dateCreated.split('T')[0]}`)
        setLoading(false)
        setAssets(dedupedResults)
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
      {loading && <Loader/>}
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
