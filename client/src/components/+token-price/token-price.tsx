import React from 'react'
import BN from 'bn.js'

interface TokenPriceProps {
  children: number | string | number[] | Uint8Array | Buffer | BN
}

export const XuiTokenPrice = React.memo(function({children}: TokenPriceProps) {

  try {
    const length = new BN(10).pow(new BN(6))
    const int = new BN(children).div(length).toString()
    const decimals = new BN(children)
      .mod(length)
      .toString()
      .padStart(6, '0')
      .replace(/0+$/, '')

    return <>{int}{decimals ? `.${decimals}` : ''}</>
  } catch {
    return <>n/a</>
  }
})
