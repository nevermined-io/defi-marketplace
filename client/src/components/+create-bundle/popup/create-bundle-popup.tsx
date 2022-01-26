import React, { useContext, useEffect, useState, useCallback } from 'react'
import { DDO, OrderProgressStep } from '@nevermined-io/nevermined-sdk-js'
import { BEM, UiText, UiDivider, UiLayout, UiButton, UiIcon, UiCircleProgress } from 'ui'
import { User } from '../../../context'
import styles from './create-bundle-popup.module.scss'
import { createBundle, checkBundleStatus } from 'src/shared'
import { BUNDLE_MAX_RETRYS, BUNDLE_STATUS_COMPLETED, BUNDLE_RETRY_TIMEOUT } from 'src/config'
import { MetamaskErrorCodes, MetamaskCustomErrors } from '../../../shared/constants'


interface CreateBundlePopupProps {
  assets: DDO[]
  close: () => any
}

const stepMessages = {
  [OrderProgressStep.CreatingAgreement]: 'Creating a new agreement',
  [OrderProgressStep.AgreementInitialized]: 'Agreement created successfully',
  [OrderProgressStep.LockingPayment]: 'Locking payment',
  [OrderProgressStep.LockedPayment]: 'Payment locked successfully',
}

const b = BEM('create-bundle-popup', styles)

export function XuiCreateBundlePopup(props: CreateBundlePopupProps) {
  const { close, assets } = props
  const { sdk } = useContext(User)
  const [error, setError] = useState<string | undefined>(undefined)
  const [bundleId, setBundleId] = useState<string | undefined>(undefined)
  const [did, setDID] = useState<string>("")
  const [view, setView] = useState<0 | 1 | 2 | 3 | 4 | 5>(0)
  const [step, setStep] = useState<OrderProgressStep>(0)
  const maxStep = (Object.keys(OrderProgressStep).length / 2) - 1


  const startPurchase = useCallback(async () => {
    setStep(0)
    setView(4)

    const account = (await sdk.accounts.list())[0]
    const promise = sdk.assets.order(did, 'access', account)
    promise.subscribe(step => setStep(step))
    promise
      .then(async agreementId => {
        await sdk.assets.consume(agreementId, did, account)
      })
      .catch(error => setError(error.code === MetamaskErrorCodes.CANCELED ? MetamaskCustomErrors.CANCELED[1] : error.message))
  }, [did])


  const start = async () => {
    const account = (await sdk.accounts.list())[0]
    setView(1)
    createBundle(account.getId(), assets)
      .then(response => setBundleId(response.data.bundle_id))
      .catch(err => setError(err.message))
  }

  const checkStatus = async () => {
    if (bundleId) {
      let retrys = 0
      while (retrys < BUNDLE_MAX_RETRYS) {
        const status = await checkBundleStatus(bundleId)
        if (status.data.bundle.status === BUNDLE_STATUS_COMPLETED) {
          setDID(status.data.bundle.did)
          break
        } else {
          retrys++
          await new Promise(r => setTimeout(r, BUNDLE_RETRY_TIMEOUT));
        }
      }
      if (retrys == BUNDLE_MAX_RETRYS)  setView(3)
    }
  }

  const clean = async () => {
    setBundleId(undefined)
    setError(undefined)
    setError(undefined)
    setView(0)
  }

  const cleanAndClose = () => {
    clean()
    close()
  }

  useEffect(() => {
    checkStatus()
  }, [bundleId])


  useEffect(() => {
    if(did != "") setView(2)
  }, [did])

  useEffect(() => {
    clean()
  }, [])

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
        <UiButton className={b('button')} type="error" onClick={cleanAndClose}>Return</UiButton>
      </>
    )

  } else if (view == 0) {
    return (
      <>
        <UiText block type="h3" className={b('text')}>Do you really want to <br /> make this purchase?</UiText>
        <UiDivider type="xl" />
        <UiLayout>
          <UiButton className={b('button')} onClick={start}>Yes</UiButton>
          <UiDivider vertical />
          <UiButton className={b('button')} type="secondary" onClick={cleanAndClose}>Cancel</UiButton>
        </UiLayout>
      </>
    )
  } else if (view == 1) {
    return (
      <>
        <UiText block type="h3" className={b('text')}>multiple asset package being created....</UiText>
        <UiDivider type="xl" />
        <UiLayout>
          <UiButton className={b('button')}>Go to profile</UiButton>
          <UiDivider vertical />
          <UiButton className={b('button')} type="secondary" onClick={cleanAndClose}>Cancel</UiButton>
        </UiLayout>
      </>
    )
  }
  else if (view == 2) {
    return (
      <>
        <UiText block type="h3" className={b('text')}>Your datasets are ready to download</UiText>
        <UiDivider type="xl" />
        <UiLayout>
          <UiButton className={b('button')} onClick={startPurchase} >Purchase</UiButton>
          <UiDivider vertical />
          <UiButton className={b('button')} type="secondary" onClick={cleanAndClose}>Cancel</UiButton>
        </UiLayout>
      </>
    )
  }
  else if (view == 3) {
    return (
      <>
        <UiText block type="h3" className={b('text')}>This process is taking more than expected</UiText>
        <UiDivider type="xl" />
        <UiLayout>
          <UiButton className={b('button')}>Go to profile</UiButton>
          <UiDivider vertical />
          <UiButton className={b('button')} type="secondary" onClick={cleanAndClose}>Cancel</UiButton>
        </UiLayout>
      </>
    )
  } else if (view === 4) {
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
  } else if (view === 5) {
    return (
      <>
        <UiDivider type="l" />
        <UiIcon className={b('icon', ['success'])} icon="circleOk" size="xxl" />
        <UiDivider type="l" />
        <UiText block type="h3" className={b('text')}>Purchase Successful!</UiText>
        <UiDivider />
        <UiText block className={b('text', ['content'])}>You can now download your report anytime from your the history page you have here.</UiText>
        <UiDivider type="l" />
        <UiLayout>
          <UiButton className={b('button')} onClick={close}>Complete</UiButton>
          <UiDivider vertical />
          <UiButton className={b('button')} type="secondary" onClick={close}>Download</UiButton>
        </UiLayout>
      </>
    )
  } else {
    return <span />
  }
}
