import React from 'react'

import { BEM } from '@nevermined-io/styles'
import { assetTypes } from 'src/config'
import styles from './filter-dropdown.module.scss'
import { XuiTypeBox } from './type-box'

const b = BEM('filter-dropdown', styles)
export function XuiTypeSelector() {
  return (
    <div className={b('filter-container')}>
      <h5 className={b('title')}>Type</h5>
      <div className={b('network-selector-container')}>
        {assetTypes.map((type: string) => (
          <XuiTypeBox key={type} type={type} />
        ))}
      </div>
    </div>
  )
}
