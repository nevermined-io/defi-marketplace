import React, { useState, useCallback, useEffect } from 'react'
import { OrderProgressStep } from '@nevermined-io/nevermined-sdk-js'
import Catalog from '@nevermined-io/components-catalog'
import { BEM, UiText, UiDivider, UiLayout, UiButton, UiCircleProgress, UiIcon, CircleSpinner } from '@nevermined-io/styles'

import styles from './buy-asset-popup.module.scss'
import { MetamaskErrorCodes, MetamaskCustomErrors } from '../../../shared/constants'

interface BuyAssetPopupProps {
  asset: string
  close: () => any
}

const stepMessages = {
  [OrderProgressStep.CreatingAgreement]: 'Creating a new agreement',
  [OrderProgressStep.AgreementInitialized]: 'Agreement created successfully',
  [OrderProgressStep.LockingPayment]: 'Locking payment',
  [OrderProgressStep.LockedPayment]: 'Payment locked successfully',
}

const b = BEM('buy-asset-popup', styles)

export function XuiBuyAssetPopup(props: BuyAssetPopupProps) {
  const { close, asset } = props
  const { sdk } = Catalog.useNevermined()
  const [view, setView] = useState<0 | 1 | 2>(0)
  const [step, setStep] = useState<OrderProgressStep>(0)
  const [error, setError] = useState<string | undefined>(undefined)
  const maxStep = (Object.keys(OrderProgressStep).length / 2) - 1

  const start = useCallback(async () => {
    setStep(0)
    setView(1)

    const account = (await sdk.accounts.list())[0]
    const promise = sdk.assets.order(asset, 'access', account)
    promise.subscribe(step => setStep(step))
    promise
      .then(async agreementId => {
        await sdk.assets.consume(agreementId, asset, account)
        close()
      })
      .catch(error => setError(error.code === MetamaskErrorCodes.CANCELED ? MetamaskCustomErrors.CANCELED[1] : error.message))
  }, [])

  const cleanError = useCallback(() => {
    setError(undefined)
    setView(0)
  }, [])


  const showDownloadView = async () => {
    if (step === 3 && view === 1) {
      await new Promise(r => setTimeout(r, 2000));
      setView(2)
    }
  }

  useEffect(() => {
    showDownloadView()
  }, [step])

  if (error) {
    return (
      <>
        <UiDivider type="l" />
        <UiIcon className={b('icon', ['error'])} icon="circleError" size="xxl" />
        <UiDivider type="l" />
        <UiText block type="h3" className={b('text')}>Purchase failed!</UiText>
        <UiDivider />
        <UiText block className={b('text', ['content'])}>{error}</UiText>
        <UiDivider type="l" />
        <UiButton className={b('button')} type="error" onClick={cleanError}>Return</UiButton>
      </>
    )

  } else if (view === 0) {
    return (
      <>
        <div className={b('confirm')}>
          <UiText block type="h3" className={b('text')}>Do you really want to <br /> make this purchase?</UiText>
          <UiDivider type="xl" />
          <UiLayout style={{ padding: '30px' }}>
            <UiButton className={b('button')} onClick={start}>Yes</UiButton>
            <UiDivider vertical />
            <UiButton className={b('button')} type="secondary" onClick={close}>Cancel</UiButton>
          </UiLayout>
        </div>
      </>
    )
  } else if (view === 1) {
    return (
      <>
        <UiText block type="h3" className={b('text')}>Transaction in <br /> progress...</UiText>
        <UiDivider type="l" />
        <UiDivider />
        <UiCircleProgress
          progress={step / maxStep}
          content={stepMessages[step]} />
        <UiDivider />
      </>
    )
  } else if (view === 2) {
    return (
      <>
        <div className={b('confirm')} style={{ height: '480px' }}>
          <UiIcon className={b('icon', ['success'])} icon="circleOk" size="xxl" />
          <UiText block type="h3" className={b('text')}>Purchase Successful!</UiText>
          <CircleSpinner width="150" height="150" circleSpimmerSrc='/assets/circle-loadspinner.svg'/>
          <UiText block className={b('text', ['content'])}>Plase sign the message and the datasets will be downloaded shortly. You can always download this dataset from you profile page.</UiText>
          <UiDivider type="l" />
        </div>
      </>
    )
  } else {
    return <span />
  }
}
