import React, { useContext, useMemo, useState } from 'react'
import { User } from 'src/context'

import { BEM } from '@nevermined-io/styles'
import styles from './filter-dropdown.module.scss'

interface SubscriptionBoxProps {
  subscription: string
}

const b = BEM('filter-dropdown', styles)
export function XuiSubscriptionBox(props: SubscriptionBoxProps) {
  const { selectedSubscriptions, setSelectedSubscriptions } = useContext(User)
  const [selected, setSelected] = useState<boolean>()

  useMemo(() => {
    if (selectedSubscriptions.length === 0) {
      setSelected(false)
    }
    if (selectedSubscriptions.includes(props.subscription)) setSelected(true)
  }, [selectedSubscriptions])

  const addRemoveSubscriptionToFilter = (subscription: string) => {
    if (selectedSubscriptions.includes(subscription)) {
      setSelectedSubscriptions(selectedSubscriptions.filter((selectedSubscriptions) => selectedSubscriptions !== subscription))
      setSelected(false)
    } else {
      setSelectedSubscriptions(selectedSubscriptions.concat(subscription))
      setSelected(true)
    }
  }

  return (
    <div
      className={selected ? b('network-selector-box', ['selected']) : b('network-selector-box')}
      onClick={() => addRemoveSubscriptionToFilter(props.subscription)}
    >
      {props.subscription}
    </div>
  )
}
