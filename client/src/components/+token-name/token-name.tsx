import React, { useContext, useEffect, useState } from 'react'
import { MetaMask } from '@nevermined-io/catalog-providers'
import { ethers } from 'ethers'
import { User } from '../../context'


const ERC20SymbolAbi = ["function symbol() view returns (string)"]

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

  static async getSymbol(provider: MetaMask.MetamaskProvider, address?: string) {
    if (!address) {
      return;
    }
    
    if (this.symbols[address]) {
      return this.symbols[address]
    }

    const contract = new ethers.Contract(address, ERC20SymbolAbi, provider)
    try {
      const symbol = await contract.symbol()
      this.symbols[address].value = symbol
    } catch {
        this.symbols[address].value = null    
    }
    return this.symbols[address]
  }
}


interface TokenNameProps {
  address?: string
}

export const XuiTokenName = React.memo(function({address}: TokenNameProps) {
  const {tokenSymbol } = useContext(User)
  const instantSymbol = TokenNameGetter.getInstantSymbol(address)
  const initialSymbol = instantSymbol || (instantSymbol === null ? tokenSymbol : '#')
  const [token, setToken] = useState(initialSymbol)

  useEffect(() => {
    if (instantSymbol !== undefined) {
      return
    }
    TokenNameGetter.getSymbol(window.ethereum)
      .then((_: any) => _ ? setToken(_) : setToken(tokenSymbol))
  }, [address])

  return <>{token}</>
})
