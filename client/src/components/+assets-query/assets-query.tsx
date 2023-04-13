import React, { ReactNode, useContext, useState, useEffect } from 'react'
import { DDO } from '@nevermined-io/sdk'
import { Catalog } from '@nevermined-io/catalog'
import { useWallet } from '@nevermined-io/providers'
import { SearchQuery } from '@nevermined-io/sdk'

import { Loader } from '@nevermined-io/styles'
import { User } from '../../context'
import { networkPrefix, subcategoryPrefix } from '../../shared'
import { XuiPagination } from './pagination'
import { XuiSearchBar } from './search-bar'
import { NFT_TIERS } from 'src/config'

interface AssetsQueryProps {
  search?: 'onsite' | 'search-page'
  query?: SearchQuery['query']
  onlyBookmark?: boolean
  pageSize?: number
  content: (assets: DDO[]) => ReactNode | undefined
}

// loads all the asset then filters them looking at the variables defined in the user context
export function XuiAssetsQuery({
  search,
  content,
  pageSize = 12,
  onlyBookmark = false
}: AssetsQueryProps) {
  const {
    assets,
    searchInputText,
    selectedCategories,
    setSelectedNetworks,
    setAssets,
    setSelectedCategories,
    setToDate,
    setFromDate,
    setSearchInputText,
    setBookmarks,
    bookmarks,
    dropdownFilters
  } = useContext(User)
  const { selectedNetworks, selectedSubscriptions, selectedSubtypes, fromDate, toDate } =
    dropdownFilters
  const { sdk } = Catalog.useNevermined()
  const { walletAddress } = useWallet()
  const [totalPages, setTotalPages] = useState<number>(1)
  const [page, setPage] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)

  const selectedCategoriesEvent = selectedCategories.map((cat) => `${subcategoryPrefix}:${cat}`)
  const selectedNetworkEvent = selectedNetworks.map((cat) => `${networkPrefix}:${cat}`)

  const textFilter = {
    nested: {
      path: 'service',
      query: {
        query_string: {
          query: `*${searchInputText}*`, fields: ['service.attributes.main.name']
        }
      }
    }
  }

  const datasetCategory = {
    nested: {
      path: 'service',
      query: {
        match: {
          'service.attributes.additionalInformation.categories':
            selectedCategoriesEvent.length === 0 ? 'UseCase:defi-datasets' : selectedCategoriesEvent.join(', ')
        }
      }
    }
  }
  const datasetNetwork = {
    match: {
      'service.attributes.additionalInformation.blockchain':
        selectedNetworkEvent.length === 0 ? '' : selectedNetworks.join(', ')
    }
  }
  const nftAccess = { nested: { path: 'service', query: { match: { 'service.type': 'nft-access' } } } }

  const subscriptionFilter = () => {
    if (selectedSubscriptions.length === 0) return ''
    const tierAddresses = selectedSubscriptions.map(
      (subscription) => NFT_TIERS.find((tier) => tier.name === subscription)?.address
    )
    return (
      tierAddresses && {
        match: {
          'service.attributes.serviceAgreementTemplate.conditions.parameters.value':
            tierAddresses.join(', ')
        }
      }
    )
  }

  const datasetAssetType = {
    match: {
      'service.attributes.additionalInformation.customData.subtype':
        selectedSubtypes.length === 0 ? '' : selectedSubtypes.join(', ')
    }
  }

  const dateFilter = fromDate !== '' &&
    toDate !== '' && {
      range: {
        'service.attributes.main.dateCreated': {
          time_zone: '+01:00',
          gte: fromDate,
          lte: toDate
        }
      }
    }

  // add listed into mustArray once we have a dataset with that property in the metadata
  //  const listed = { match: { 'service.attributes.curation.isListed': 'true' } }
  const mustArray = [textFilter, datasetCategory, nftAccess]
  selectedNetworkEvent.length > 0 && mustArray.push(datasetNetwork as any)
  dateFilter && mustArray.push(dateFilter as any)
  subscriptionFilter() && mustArray.push(subscriptionFilter() as any)
  selectedSubtypes.length > 0 && mustArray.push(datasetAssetType as any)

  const notBundleFilter = {
    match: { 'service.attributes.additionalInformation.categories': 'EventType:bundle' }
  }
  const mustNotArray = [notBundleFilter]

  const query = {
    bool: {
      must: mustArray,
      must_not: mustNotArray
    }
  }

  useEffect(() => {
    if (!sdk?.services?.profiles) {
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(async () => {
      if (!walletAddress) return
      try{
          const userProfile = await sdk.services.profiles.findOneByAddress(walletAddress)
          if (!userProfile?.userId) {
            return
          }
          const bookmarksData = await sdk.services.bookmarks.findManyByUserId(userProfile.userId)
          const bookmarksDDO = await Promise.all(
            bookmarksData.results.map((b) => sdk.assets.resolve(b.did))
          )
          setBookmarks([...bookmarksDDO])
      } catch(error:unknown){
          console.error("Error loading user info: " + error)
      }
    })()
  }, [sdk])

  //this happen when the page is loaded to get the query string
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    for (const [key, value] of queryParams.entries()) {
      switch (key) {
        case 'searchInputText':
          queryParams.get('searchInputText')
            ? setSearchInputText(value)
            : setSearchInputText(searchInputText)
          break
        case 'selectedCategories':
          queryParams.get('selectedCategories')
            ? setSelectedCategories(value.split(','))
            : setSelectedCategories(selectedCategories)
          break
        case 'selectedNetworks':
          queryParams.get('selectedNetworks')
            ? setSelectedNetworks(value.split(','))
            : setSelectedNetworks(selectedNetworks)
          break
        case 'toDate':
          queryParams.get('toDate') ? setToDate(value) : setToDate(toDate)
          break
        case 'fromDate':
          queryParams.get('fromDate') ? setFromDate(value) : setFromDate(fromDate)
          break
        default:
          break
      }
    }
  }, [])

  useEffect(() => {
    if (!sdk.assets) {
      return
    }
    setLoading(true)
    sdk.search
      .query({
        offset: pageSize,
        page,
        query: query! as any,
        sort: {
          created: 'desc'
        }
      })
      .then(({ results, totalPages }) => {
        if (onlyBookmark) {
          results = results.filter((item) => bookmarks?.some((bookmark) => bookmark.id === item.id))
        }

        setLoading(false)
        setAssets(results)
        setTotalPages(totalPages)
        history.replaceState(
          null,
          '',
          `/list?searchInputText=${searchInputText}&fromDate=${fromDate}&toDate=${toDate}&selectedCategories=${selectedCategories}&selectedNetworks=${selectedNetworks}`
        )
      })
  }, [sdk, page, JSON.stringify(query), bookmarks])

  return (
    <>
      {loading && <Loader />}
      {search && (
        <div>
          <XuiSearchBar />
        </div>
      )}

      {content(assets)}

      {totalPages > 1 && <XuiPagination setPage={setPage} page={page} totalPages={totalPages} />}
    </>
  )
}
