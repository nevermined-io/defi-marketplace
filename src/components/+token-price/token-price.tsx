import React, { Props, useContext } from 'react'
import BN from 'bn.js'
import { User } from '../../context'

interface TokenPriceProps {
  children: number | string | number[] | Uint8Array | Buffer | BN
}

export const XuiTokenPrice = React.memo(function({children}: TokenPriceProps) {
  const {tokenDecimals, web3} = useContext(User)

  try {
    const length = new BN(10).pow(new BN(tokenDecimals))
    const int = new BN(children).div(length).toString()
    const decimals = new BN(children)
      .mod(length)
      .toString()
      .padStart(tokenDecimals, '0')
      .replace(/0+$/, '')

    return <>{int}{decimals ? `.${decimals}` : ''}</>
  } catch {
    return <>n/a</>
  }
})
