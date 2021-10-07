import React, { Props, HTMLAttributes, useState, useCallback, useContext, createRef } from 'react'
import { DDO, OrderProgressStep } from '@nevermined-io/nevermined-sdk-js'

import { BEM, UiText, UiDivider, UiLayout, UiButton, UiCircleProgress, UiIcon } from 'ui'
import { useUserContext } from 'src/context'

import styles from './buy-asset-popup.module.scss'

interface BuyAssetPopupProps {
  asset: DDO
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
  const {close, asset} = props
  const {sdk} = useUserContext()
  const [view, setView] = useState<0 | 1 | 2>(0)
  const [step, setStep] = useState<OrderProgressStep>(0)
  const [error, setError] = useState<string | undefined>(undefined)
  const maxStep = (Object.keys(OrderProgressStep).length / 2) - 1

  const start = useCallback(async () => {
    setStep(0)
    setView(1)

    const promise = sdk.assets.order(asset.id, 'access', (await sdk.accounts.list())[0])

    promise.subscribe(step => setStep(step))
    promise
      .then(() => setTimeout(() => setView(2), 2000))
      .catch(error => setError(error.message))
  }, [])

  const cleanError = useCallback(() => {
    setError(undefined)
    setView(0)
  }, [])

  if (error) {
    return (
      <>
        <UiDivider type="l"/>
        <UiIcon className={b('icon', ['error'])} icon="circleError" size="xxl"/>
        <UiDivider type="l"/>
        <UiText block type="h3" className={b('text')}>Purchase failed!</UiText>
        <UiDivider/>
        <UiText block className={b('text', ['content'])}>{error}</UiText>
        <UiDivider type="l"/>
        <UiButton className={b('button')} type="error" onClick={cleanError}>Return</UiButton>
      </>
    )

  } else if (view === 0) {
    return (
      <>
        <UiText block type="h3" className={b('text')}>Do you really want to <br/> make this purchase?</UiText>
        <UiDivider type="xl"/>
        <UiLayout>
          <UiButton className={b('button')} onClick={start}>Yes</UiButton>
          <UiDivider vertical/>
          <UiButton className={b('button')} type="secondary" onClick={close}>Cancel</UiButton>
        </UiLayout>
      </>
    )
  } else if (view === 1) {
    return (
      <>
        <UiText block type="h3" className={b('text')}>Transaction in <br/> progress...</UiText>
        <UiDivider type="l"/>
        <UiDivider/>
        <UiCircleProgress
          progress={step / maxStep}
          content={stepMessages[step]}/>
        <UiDivider/>
      </>
    )
  } else if (view === 2) {
    return (
      <>
        <UiDivider type="l"/>
        <UiIcon className={b('icon', ['success'])} icon="circleOk" size="xxl"/>
        <UiDivider type="l"/>
        <UiText block type="h3" className={b('text')}>Purchase Successful!</UiText>
        <UiDivider/>
        <UiText block className={b('text', ['content'])}>You can now download your report anytime from your the history page you have here.</UiText>
        <UiDivider type="l"/>
        <UiLayout>
          <UiButton className={b('button')} onClick={close}>Complete</UiButton>
          <UiDivider vertical/>
          <UiButton className={b('button')} type="secondary" onClick={close}>Download</UiButton>
        </UiLayout>
      </>
    )
  } else {
    return <span/>
  }
}
