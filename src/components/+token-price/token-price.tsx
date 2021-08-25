import React, { Props, useContext } from 'react'
import BN from 'bn.js'
import { User } from '../../context'

interface TokenPriceProps {
  children: number | string | number[] | Uint8Array | Buffer | BN
}

export const XuiTokenPrice = React.memo(function({children}: TokenPriceProps) {
  const {tokenDecimals, web3} = useContext(User)

  return <>{new BN(children).div(new BN(10).pow(new BN(tokenDecimals))).toString()}</>
})