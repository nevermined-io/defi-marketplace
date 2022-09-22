import React from 'react'
import { BEM, UiButton } from '@nevermined-io/styles'
import { MetaMask } from '@nevermined-io/catalog-providers'
import { User } from '../../context'
import styles from './wallet.module.scss'
import Link from 'next/link'
import { SubscriptionBadge } from 'ui/subscription-badge/subscription-badge'

const b = BEM('wallet', styles)

export function XuiWallet() {
  const { network, isLogged, getCurrentUserSubscription } = React.useContext(User)
  const { walletAddress, loginMetamask } = MetaMask.useWallet()
  const currentUserSubscription = getCurrentUserSubscription()

  return !(isLogged && walletAddress) ? (
    <UiButton onClick={loginMetamask}>Connect wallet</UiButton>
  ) : (
    <>
      <Link href={'/account'}>
        <div className={b('block', ['address'])}>
          <span className={b('logged')} />
          <span className={b('account')}>Account</span>
          <span className={b('separator')} />
          {`${walletAddress.substr(0, 6)}...${walletAddress.substr(-4)}`}
        </div>
      </Link>
      <Link href={'/account'}>
        <div className={b('block', [currentUserSubscription ? 'subscription' : 'no-subscription'])}>
          {currentUserSubscription ? (
            <SubscriptionBadge
              className={b('subscription-badge')}
              tier={currentUserSubscription.tier}
              logoOnly
            />
          ) : (
            <>
              <span className={b('separator')} />
              {'No Subscription'}
            </>
          )}
        </div>
      </Link>
      {network && <div className={b('block', ['network'])}>{network}</div>}
    </>
  )
}
