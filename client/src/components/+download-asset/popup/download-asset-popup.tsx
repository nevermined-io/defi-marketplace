import React, { useState, useCallback } from 'react'
import { Catalog } from '@nevermined-io/catalog-core'
import {
  BEM,
  UiText,
  UiDivider,
  UiLayout,
  UiButton,
  UiIcon,
  CircleSpinner
} from '@nevermined-io/styles'

import styles from './download-asset-popup.module.scss'
import { MetamaskErrorCodes, MetamaskCustomErrors } from '../../../shared/constants'

interface DownloadAssetPopupProps {
  assetDid: string
  close: () => any
}

const b = BEM('download-asset-popup', styles)

export function XuiDownloadAssetPopup(props: DownloadAssetPopupProps) {
  const { close, assetDid } = props
  const { sdk } = Catalog.useNevermined()
  const [view, setView] = useState<0 | 1 | 2>(0)
  const [error, setError] = useState<string | undefined>(undefined)
  const start = useCallback(async () => {
  
    setView(1)
    const account = (await sdk.accounts.list())[0]
    sdk.nfts.access(assetDid, account)
    .then(() => setView(2))
    .catch((error) =>
        setError(
          error.code === MetamaskErrorCodes.CANCELED
            ? MetamaskCustomErrors.CANCELED[1]
            : error.message
        )
    )
  }, [])

  const cleanError = useCallback(() => {
    setError(undefined)
    setView(0)
  }, [])

  if (error) {
    return (
      <>
        <UiDivider type="l" />
        <UiIcon className={b('icon', ['error'])} icon="circleError" size="xxl" />
        <UiDivider type="l" />
        <UiText block type="h3" className={b('text')}>
          Asset Downloading failed!
        </UiText>
        <UiDivider />
        <UiText block className={b('text', ['content'])}>
          {error}
        </UiText>
        <UiDivider type="l" />
        <UiButton className={b('button')} type="error" onClick={() => {cleanError; close()}}>
          Return
        </UiButton>
      </>
    )
  } else if (view === 0) {
    return (
      <>
        <div className={b('confirm')}>
          <UiText block type="h3" className={b('text')}>
            Download this Asset?
          </UiText>
          <UiDivider type="xl" />
          <UiLayout style={{ padding: '30px' }}>
            <UiButton className={b('button')} onClick={start}>
              Yes
            </UiButton>
            <UiDivider vertical />
            <UiButton className={b('button')} type="secondary" onClick={close}>
              Cancel
            </UiButton>
          </UiLayout>
        </div>
      </>
    )
  } else if (view === 1) {
    return (
      <>
        <div className={b('confirm')} style={{ height: '480px' }}>
          <UiIcon className={b('icon', ['success'])} icon="circleOk" size="xxl" />
          <UiText block type="h3" className={b('text')}>
            Downloading in <br /> progress...
          </UiText>
          <CircleSpinner
            width="150"
            height="150"
            circleSpimmerSrc="/assets/circle-loadspinner.svg"
          />
          <UiText block className={b('text', ['content'])}>
            Please sign the message with Metamask and the datasets will be downloaded shortly.
          </UiText>
          <UiDivider type="l" />
        </div>
      </>
    )
  } else if (view === 2){
    return (
      <>
        <UiDivider type="l" />
        <UiIcon className={b('icon', ['ok'])} icon="circleOk" size="xxl" />
        <UiDivider type="l" />
        <UiText block type="h3" className={b('text')}>
           Asset Downloading OK!
        </UiText>
        <UiDivider />
        <UiText block className={b('text', ['content'])}>
          {error}
        </UiText>
        <UiDivider type="l" />
        <UiButton className={b('button')}  onClick={() => {close()}}>
          Return
        </UiButton>
      </>
    )

  }else {
    return <span />
  }
}
