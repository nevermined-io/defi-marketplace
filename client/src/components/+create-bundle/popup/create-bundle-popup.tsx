import React, { useContext } from 'react'
import { DDO } from '@nevermined-io/nevermined-sdk-js'
import { BEM, UiText, UiDivider, UiLayout, UiButton} from 'ui'
import { User } from '../../../context'
import styles from './create-bundle-popup.module.scss'
import { createBundle } from 'src/shared'

interface CreateBundlePopupProps {
  assets: DDO[]
  close: () => any
}

const b = BEM('create-bundle-popup', styles)

export function XuiCreateBundlePopup(props: CreateBundlePopupProps) {
  const { close, assets } = props
  const { sdk } = useContext(User)

  const start = async () => {
    const account = (await sdk.accounts.list())[0]
    createBundle(account.getId(), assets)
      .then(response => console.log("bundle created!"))
      .catch(err => console.log(err))
  }

  return (
    <>
      <UiText block type="h3" className={b('text')}>Do you really want to <br /> make this purchase?</UiText>
      <UiDivider type="xl" />
      <UiLayout>
        <UiButton className={b('button')} onClick={start}>Yes</UiButton>
        <UiDivider vertical />
        <UiButton className={b('button')} type="secondary" onClick={close}>Cancel</UiButton>
      </UiLayout>
    </>
  )
}
