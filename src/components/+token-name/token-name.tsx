import React, { Props, useContext, useEffect, useState } from 'react'
import Web3 from 'web3'

import { User } from '../../context'


const ERC20SymbolAbi = {
  constant: true,
  inputs: [],
  name: 'symbol',
  outputs: [
    {
      name: '',
      type: 'string'
    }
  ],
  payable: false,
  stateMutability: 'view' as const,
  type: 'function' as const,
}

class TokenNameGetter {
  private static symbols: any = {}

  static getInstantSymbol(address?: string) {
    if (!address) {
      return null
    }
    if (this.symbols[address]) {
      return this.symbols[address].value
    }
  }

  static getSymbol(web3: Web3, address?: string) {
    if (!address) {
      return Promise.resolve(undefined)
    }
    if (this.symbols[address]) {
      return this.symbols[address]
    }

    this.symbols[address] = new Promise(async resolve => {
      const contract = new web3.eth.Contract([ERC20SymbolAbi], address)
      try {
        const symbol = await contract.methods.symbol().call()
        this.symbols[address].value = symbol
        resolve(symbol)
      } catch {
        this.symbols[address].value = null
        resolve(undefined)
      }
    })
    return this.symbols[address]
  }
}


interface TokenNameProps {
  address?: string
}

export const XuiTokenName = React.memo(function({address}: TokenNameProps) {
  const {tokenSymbol, web3} = useContext(User)
  const instantSymbol = TokenNameGetter.getInstantSymbol(address)
  const initialSymbol = instantSymbol || (instantSymbol === null ? tokenSymbol : '#')
  const [token, setToken] = useState(initialSymbol)

  useEffect(() => {
    if (instantSymbol !== undefined) {
      return
    }
    TokenNameGetter.getSymbol(web3, address)
      .then(_ => _ ? setToken(_) : setToken(tokenSymbol))
  }, [address])

  return <>{token}</>
})
