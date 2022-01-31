import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { User } from 'src/context'

import { BEM } from 'ui'
import styles from './filter-dropdown.module.scss'

interface NetworkBoxProps {
    network: string
}

const b = BEM('filter-dropdown', styles)
export function XuiNetworkBox(props: NetworkBoxProps) {
    const { selectedNetworks, setSelectedNetworks } = useContext(User)
    const [selected, setSelected] = useState<boolean>()

    useMemo(() => {
        if (selectedNetworks.length === 0) {
            setSelected(false)
        }
        if (selectedNetworks.includes(props.network)) setSelected(true)
    }, [selectedNetworks])

    const addRemoveNetworkToFilter = (network: string) => {
        if (selectedNetworks.includes(network)) {
            setSelectedNetworks(selectedNetworks.filter(selectedNetwork => selectedNetwork !== network))
            setSelected(false)
        } else {
            setSelectedNetworks(selectedNetworks.concat(network))
            setSelected(true)
        }
    }

    return <div
        // className={selected ? b('toggle', ["selected"]) : b('toggle')}
        className={selected  ? b("network-selector-box", ['selected']) : b("network-selector-box")}
        onClick={() => addRemoveNetworkToFilter(props.network)}
    >
        {props.network}
    </div>
}
