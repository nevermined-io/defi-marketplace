import React, { ReactNode, Props, useContext, useState, useEffect } from 'react'
import { DDO/*, SearchQuery*/ } from '@nevermined-io/nevermined-sdk-js'

import { BEM, modList, extendClassName, UiButton } from 'ui'
import { User } from '../../context'
import styles from './assets-query.module.scss'

interface AssetsQueryProps {
  query?: any
  content: (assets: DDO[]) => ReactNode | undefined;
}

const b = BEM('assets-query', styles)
export function XuiAssetsQuery({content, query}: AssetsQueryProps) {
  const [assets, setAssets] = useState<DDO[]>([])
  const {sdk} = useContext(User)
 
  useEffect(() => {
    if (!sdk.assets) {
      return
    }
    sdk.assets
      .query({
        offset: 12,
        page: 1,
        query,
        sort: {
          created: -1
        }
      })
      .then(({results}) => setAssets(results))
  }, [sdk])

  return (
    <>
      {content(assets)}
    </>
  )
}
