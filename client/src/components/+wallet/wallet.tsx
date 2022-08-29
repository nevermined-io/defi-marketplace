import React from 'react'
import { BEM, UiButton } from '@nevermined-io/styles'
import { MetaMask } from '@nevermined-io/catalog-providers'
import { User } from '../../context'
import styles from './wallet.module.scss'
import Link from 'next/link'
import Router from 'next/router'

const b = BEM('wallet', styles)

export function XuiWallet() {
  const { network, isLogged, getCurrentUserSubscription } = React.useContext(User)
  const { walletAddress, loginMetamask } = MetaMask.useWallet()

  return !(isLogged && walletAddress) ? (
    <UiButton onClick={loginMetamask}>Connect wallet</UiButton>
  ) : (
    <>
      <div className={b('block')}>
        <Link href={'/account'}>
          <span style={{ cursor: 'pointer', display: 'flex' }}>
           {
             getCurrentUserSubscription()? <span>{getCurrentUserSubscription()?.tier.toString()}</span>:<span>No Subscription</span>
           } 
          </span>
        </Link>
      </div>

      <div className={b('block', ['address'])} onClick={() => Router.push('/account')}>
        <span className={b('logged')} />
        {`${walletAddress.substr(0, 6)}...${walletAddress.substr(-4)}`}
      </div>

      <div className={b('block', ['network'])}>{network}</div>
    </>
  )
}
