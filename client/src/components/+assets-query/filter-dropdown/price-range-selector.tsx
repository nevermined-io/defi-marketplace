import React, { useContext, useEffect, useState } from 'react'
import { User } from 'src/context'

import { BEM } from 'ui'
import { networkArray } from 'src/config'
import styles from './filter-dropdown.module.scss'
import { UiLayout } from 'ui/layout/layout'

const b = BEM('filter-dropdown', styles)
interface PriceRangeProps {
    setPriceRange: Function
}
export function XuiPriceRangeSelector(props: PriceRangeProps) {
    const { selectedPrice } = useContext(User)
    const [priceValue, setPriceValue] = useState(selectedPrice || 10)

    return <div className={b('filter-container')}>
        <h5 className={b('title')}>Price Range</h5>
        <div>
            <UiLayout type="sides" className={b('ranges-limits')}>
                <label >{priceValue} <span>USDC</span></label>
            </UiLayout>
            <input
                className={b('range-bar')}
                onChange={(event) => {
                    props.setPriceRange(parseFloat(event.target.value))
                    setPriceValue(parseFloat(event.target.value))
                }}
                value={priceValue}
                type="range"
            />
        </div>


    </div>
}
