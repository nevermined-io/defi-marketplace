import React from 'react'
import { BEM, UiButton} from '@nevermined-io/styles'
import { User } from '../../context'
import Catalog from 'components-catalog-nvm-test'
import { correctNetworkName } from '../../config'
import styles from './wallet.module.scss'
import Link from 'next/link'
import Image from "next/image"

interface WalletProps {
}

const b = BEM('wallet', styles)

export function XuiWallet(props: WalletProps) {
  const { isLogged, walletAddress, network, basket, loginMetamask } = React.useContext(User)

  return !(isLogged && walletAddress)
    ? (
      <UiButton onClick={loginMetamask}>
        Connect wallet
      </UiButton>
    ) :
    (
      <>
        <div className={b('block', ['cart'])}>
          <Link href={'/checkout'} >
            <span style={{ cursor: 'pointer', display:'flex' }}>
              <Image width="17" height="16" src="/assets/basket_icon.svg" />
             <span style={{ marginLeft: '14px' }} >{basket.length}</span>
            </span>
          </Link>
        </div>

        <div className={b('block')}>
          <span className={b('logged')} />
          {`${walletAddress.substr(0, 6)}...${walletAddress.substr(-4)}`}
        </div>

        <div className={b('block', ['network'])}>
          {network}
        </div>
      </>
    )
}
