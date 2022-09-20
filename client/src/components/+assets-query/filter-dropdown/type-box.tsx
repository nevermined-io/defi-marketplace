import React, { useContext, useMemo, useState } from 'react'
import { User } from 'src/context'

import { BEM } from '@nevermined-io/styles'
import styles from './filter-dropdown.module.scss'

interface TypeBoxProps {
  type: string
}

const b = BEM('filter-dropdown', styles)
export function XuiTypeBox(props: TypeBoxProps) {
  const { selectedSubtypes, setSelectedSubtypes } = useContext(User)
  const [selected, setSelected] = useState<boolean>()

  useMemo(() => {
    if (selectedSubtypes.length === 0) {
      setSelected(false)
    }
    if (selectedSubtypes.includes(props.type)) setSelected(true)
  }, [selectedSubtypes])

  const addRemoveTypeToFilter = (type: string) => {
    if (selectedSubtypes.includes(type)) {
      setSelectedSubtypes(selectedSubtypes.filter((selectedType) => selectedType !== type))
      setSelected(false)
    } else {
      setSelectedSubtypes(selectedSubtypes.concat(type))
      setSelected(true)
    }
  }

  return (
    <div
      className={selected ? b('network-selector-box', ['selected']) : b('network-selector-box')}
      onClick={() => addRemoveTypeToFilter(props.type)}
    >
      {props.type}
    </div>
  )
}
