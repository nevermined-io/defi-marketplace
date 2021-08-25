import React, { Props, useContext } from 'react'
import { User } from '../../context'

export const XuiTokenName = React.memo(function() {
  const {tokenSymbol} = useContext(User)

  return <>{tokenSymbol}</>
})