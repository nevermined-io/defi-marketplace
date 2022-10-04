import React, { useState, useCallback, useRef } from 'react'
import { Catalog } from '@nevermined-io/catalog-core'
import { BEM, UiButton, UiPopupHandlers } from '@nevermined-io/styles'
import styles from './download-asset-popup.module.scss'
import { MetamaskErrorCodes, MetamaskCustomErrors } from '../../../shared/constants'
import NeverminedColorIcon from '../../../../public/assets/nevermined-color.svg'
import ErrorIcon from '../../../../public/assets/error.svg'
import SuccessIcon from '../../../../public/assets/success.svg'
import LoadingIcon from '../../loading-icon/loading-icon'
import { PopupContent } from '../../popup/popup'

interface DownloadAssetPopupProps {
  assetDid: string
  close: () => any
}

const b = BEM('download-asset-popup', styles)

export function XuiDownloadAssetPopup(props: DownloadAssetPopupProps) {
  const popupRef = useRef<UiPopupHandlers>()
  const { close, assetDid } = props
  const { sdk } = Catalog.useNevermined()
  const [view, setView] = useState<0 | 1 | 2>(0)
  const [error, setError] = useState<string | undefined>(undefined)
  const start = useCallback(async () => {
    setView(1)
    const account = (await sdk.accounts.list())[0]
    sdk.nfts
      .access(assetDid, account)
      .then(() => setView(2))
      .catch((error) =>
        setError(
          error.code === MetamaskErrorCodes.CANCELED
            ? MetamaskCustomErrors.CANCELED[1]
            : error.message
        )
      )
  }, [])

  const clearError = useCallback(() => {
    setError(undefined)
    setView(0)
  }, [])

  if (error) {
    return (
      <PopupContent
        popupRef={popupRef}
        image={<ErrorIcon />}
        message="Asset Downloading failed!"
        additionalMessage={error}
        buttons={
          <UiButton
            className={b('button')}
            type="error"
            onClick={() => {
              clearError()
              close()
            }}
          >
            Return
          </UiButton>
        }
      />
    )
  } else if (view === 0) {
    return (
      <PopupContent
        popupRef={popupRef}
        image={<NeverminedColorIcon />}
        message="Download this Asset?"
        buttons={
          <>
            <UiButton className={b('button')} type="secondary" onClick={close}>
              Cancel
            </UiButton>
            <UiButton className={b('button')} onClick={start}>
              Yes
            </UiButton>
          </>
        }
      />
    )
  } else if (view === 1) {
    return (
      <PopupContent
        popupRef={popupRef}
        image={<LoadingIcon />}
        message="Downloading in progress..."
        additionalMessage="Please sign the message with Metamask and the datasets will be downloaded shortly."
      />
    )
  } else if (view === 2) {
    return (
      <PopupContent
        popupRef={popupRef}
        image={<SuccessIcon />}
        message="Asset Downloading OK!"
        buttons={
          <UiButton
            className={b('button')}
            onClick={() => {
              close()
            }}
          >
            Return
          </UiButton>
        }
      />
    )
  } else {
    return <span />
  }
}
