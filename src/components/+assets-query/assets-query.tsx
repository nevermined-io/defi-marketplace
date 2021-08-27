import React, { ReactNode, Props, useContext, useState, useEffect } from 'react'
import { DDO } from '@nevermined-io/nevermined-sdk-js'
import { SearchQuery  } from '@nevermined-io/nevermined-sdk-js/dist/node/metadata/Metadata'

import { BEM, modList, extendClassName, UiButton, UiIcon, UiLayout, UiDivider } from 'ui'
import { User } from '../../context'
import styles from './assets-query.module.scss'

interface AssetsQueryProps {
  query?: SearchQuery['query']
  pageSize?: number
  content: (assets: DDO[]) => ReactNode | undefined;
}

const b = BEM('assets-query', styles)
export function XuiAssetsQuery({content, query, pageSize = 12}: AssetsQueryProps) {
  const [assets, setAssets] = useState<DDO[]>([])
  const [totalPages, setTotalPages] = useState<number>(1)
  const [page, setPage] = useState<number>(1)
  const {sdk} = useContext(User)
 
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
      .then(({results, totalPages}) => {
        setAssets(results)
        setTotalPages(totalPages)
      })
  }, [sdk, page])

  return (
    <>
      {content(assets)}

      {totalPages > 1 && (
        <>
          <UiDivider type="l"/>
          <UiLayout justify="center">
            <UiButton square type="alt" disabled={page === 1} onClick={() => setPage(page - 1)}>
              <UiIcon icon="arrowLeft"/>
            </UiButton>
            <UiDivider type="xl" vertical/>
            <UiButton square type="alt" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
              <UiIcon icon="arrowRight"/>
            </UiButton>
          </UiLayout>
        </>
      )}
    </>
  )
}
