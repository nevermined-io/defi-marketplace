import React, { Props, createRef, useEffect, useState } from 'react'
import { BEM, modList, extendClassName, UiButton, UiPopup, UiPopupHandlers } from 'ui'
import { User } from '../../context'
import styles from './wallet.module.scss'

interface WalletProps {
}

const b = BEM('wallet', styles)

export function XuiWallet(props: WalletProps) {
  const { isLogged, account, network, loginMetamask, switchToCorrectNetwork } = React.useContext(User)
  const [connected, connect] = useState(false)

  const UiRef = createRef<UiPopupHandlers>()

  useEffect(() => {
    network && network !== 'mumbai' ?
      UiRef.current?.open() : connected ?
        UiRef.current?.close() : null
  }, [UiRef, network, connected]);

  const handleChangeNetwork = () => {
    switchToCorrectNetwork()
    connect(true)
  }

  return !(isLogged && account)
    ? (
      <UiButton onClick={loginMetamask}>
        Connect wallet
      </UiButton>
    ) :
    (
      <>
        <div className={b('block')}>
          <span className={b('logged')} />
          {`${account.substr(0, 6)}...${account.substr(-4)}`}
        </div>
        <div className={b('block', ['network'])}>
          {network}
        </div>
        <UiPopup ref={UiRef}>
          <UiButton onClick={handleChangeNetwork}>
            Switch To Mumbai Network
          </UiButton>
        </UiPopup>
      </>
    )
}
