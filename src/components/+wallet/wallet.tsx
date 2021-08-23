import React, { Props } from 'react'
import { BEM, modList, extendClassName, UiButton } from 'ui'
import { User } from '../../context'
import styles from './wallet.module.scss'

interface WalletProps {
}

const b = BEM('wallet', styles)

export function XuiWallet(props: WalletProps) {
  const {isLogged, account, network, loginMetamask} = React.useContext(User)
  return !(isLogged && account)
    ? (
      <UiButton onClick={loginMetamask}>
        Connect wallet
      </UiButton>
    ) : (
      <>
        <div className={b('block')}>
          <span className={b('logged')}/>
          {`${account.substr(0, 6)}...${account.substr(-4)}`}
        </div>
        <div className={b('block', ['network'])}>
          {network}
        </div>
      </>
    )
}
