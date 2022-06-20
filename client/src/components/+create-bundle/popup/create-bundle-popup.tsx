import React, { useContext, useEffect, useState, useCallback } from 'react'
import { DDO, OrderProgressStep } from '@nevermined-io/nevermined-sdk-js'
import { BEM, UiText, UiDivider, UiLayout, UiButton, UiIcon, UiCircleProgress, CircleSpinner } from '@nevermined-io/styles'
import { User } from '../../../context'
import styles from './create-bundle-popup.module.scss'
import { createBundle, checkBundleStatus } from 'src/shared'
import { BUNDLE_MAX_RETRYS, BUNDLE_STATUS_COMPLETED, BUNDLE_RETRY_TIMEOUT } from 'src/config'
import { MetamaskErrorCodes, MetamaskCustomErrors } from '../../../shared/constants'
import Router from 'next/router'
import Image from 'next/image'


interface CreateBundlePopupProps {
  assets: DDO[],
  price: number,
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
  const { close, assets, price } = props
  const { sdk, setAllUserBundles } = useContext(User)
  const [error, setError] = useState<string | undefined>(undefined)
  const [bundleId, setBundleId] = useState<string | undefined>(undefined)
  const [did, setDID] = useState<string>("")
  const [view, setView] = useState<0 | 1 | 2 | 3 | 4 | 5>(0)
  const [step, setStep] = useState<OrderProgressStep>(0)
  const maxStep = (Object.keys(OrderProgressStep).length / 2) - 1
  const { removeFromBasket } = useContext(User)


  const startPurchase = useCallback(async () => {
    setStep(0)
    setView(4)

    const account = (await sdk.accounts.list())[0]
    const promise = sdk.assets.order(did, 'access', account)
    promise.subscribe(step => setStep(step))
    promise
      .then(async agreementId => {
        await sdk.assets.consume(agreementId, did, account)
        setView(5)
        emptyBasket()
      })
      .catch(error => setError(error.code === MetamaskErrorCodes.CANCELED ? MetamaskCustomErrors.CANCELED[1] : error.message))
  }, [did])


  const emptyBasket = () => {
    removeFromBasket(assets.map(asset => asset.id))
  }

  const start = async () => {
    const account = (await sdk.accounts.list())[0]
    setView(1)
    createBundle(account.getId(), assets, price)
      .then(async response => {
        await setBundleId(response.data.bundle_id)
        await setAllUserBundles(account.getId())
      })
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
      if (retrys == BUNDLE_MAX_RETRYS) setView(3)
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

  const goToProfile = () => {
    emptyBasket()
    Router.push('/profile')
  }

  const showDownloadView = async () => {
    if (step === 3 && view === 4) {
      await new Promise(r => setTimeout(r, 2000));
      setView(5)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [bundleId])

  useEffect(() => {
    if (did != "") setView(2)
  }, [did])

  useEffect(() => {
    clean()
  }, [])

  useEffect(() => {
    showDownloadView()
  }, [step])



  if (error) {
    return (
      <>
        <div className={b('confirm')} style={{ height: '420px' }}>
          <UiDivider type="s" />
          <UiIcon className={b('icon', ['error'])} icon="circleError" size="xxl" />
          <UiDivider type="s" />
          <UiText block type="h3" className={b('text')}>Purchase failed!</UiText>
          <UiDivider />
          <UiText block className={b('text', ['content'])}>{error}</UiText>
          <UiDivider type="s" />
          <UiButton className={b('button')} type="error" onClick={cleanAndClose}>Return</UiButton>
        </div>
      </>
    )

  } else if (view == 0) {
    return (
      <>
        <div className={b('confirm')}>
          <UiText block type="h3" className={b('text')}>Do you really want to <br /> make this purchase?</UiText>
          <UiDivider type="xl" />
          <UiLayout style={{ padding: '30px' }}>
            <UiButton className={b('button')} onClick={start}>Yes</UiButton>
            <UiDivider vertical />
            <UiButton className={b('button')} type="secondary" onClick={cleanAndClose}>Cancel</UiButton>
          </UiLayout>
        </div>
      </>
    )
  } else if (view == 1) {
    return (
      <>
        <div className={b('options')}>
          <UiText block type="h3" className={b('text', ['title'])}>multiple asset package being created....</UiText>
          <UiDivider type="s" />
          <CircleSpinner width="150" height="150" />
          <UiText block type="p" className={b('text')} >
            If the package takes too long to create, you can leave this page.
            As soon as the purchase is ready, we will notify you on your profile page.
          </UiText>
          <UiLayout>
          </UiLayout>
          <UiLayout style={{ padding: '5px', justifyContent: "center" }}>
            <UiButton className={b('button')} onClick={goToProfile} >Go to profile</UiButton>
            <UiDivider vertical />
            <UiButton className={b('button')} type="secondary" onClick={cleanAndClose}>Cancel</UiButton>
          </UiLayout>
        </div>
      </>
    )
  }
  else if (view == 2) {
    return (
      <>
        <div className={b('confirm')}>
          <UiText block type="h3" className={b('text')}>Your datasets are ready to download</UiText>
          <UiDivider type="s" />
          <Image width="50" height="50" src="/assets/nevermined-color.svg" />
          <UiDivider type="s" />
          <UiLayout style={{ padding: '5px', justifyContent: "center" }}>
            <UiButton className={b('button')} onClick={startPurchase} >Purchase</UiButton>
            <UiDivider vertical />
            <UiButton className={b('button')} type="secondary" onClick={cleanAndClose}>Cancel</UiButton>
          </UiLayout>
        </div>
      </>
    )
  }
  else if (view == 3) {
    return (
      <>
        <div className={b('confirm')} style={{ height: '450px' }}>
          <UiText block type="h3" className={b('text')}>This process is taking more than expected</UiText>
          <Image width="50" height="50" src="/assets/nevermined-color.svg" />
          <UiText block type="p" className={b('text', ['more-than-expected'])}>
            The process is taking longer than expected, you can now leave this page.
            As soon as the purchase is ready, we will notify you on your profile page.
          </UiText>
          <UiLayout style={{ padding: '5px', justifyContent: "center" }}>
            <UiButton className={b('button')} onClick={goToProfile}>Go to profile</UiButton>
            <UiDivider vertical />
            <UiButton className={b('button')} type="secondary" onClick={cleanAndClose}>Cancel</UiButton>
          </UiLayout>
        </div>
      </>
    )
  } else if (view === 4) {
    return (
      <>
        <div className={b('options')} style={{ height: '480px' }}>
          <UiText block type="h3" className={b('text')}>Transaction in <br /> progress...</UiText>
          <UiCircleProgress
            progress={step / maxStep}
            content={stepMessages[step]} />
        </div>
      </>
    )
  } else if (view === 5) {
    return (
      <>
        <div className={b('confirm')} style={{ height: '480px' }}>
          <UiIcon className={b('icon', ['success'])} icon="circleOk" size="xxl" />
          <UiText block type="h3" className={b('text')}>Purchase Successful!</UiText>
          <CircleSpinner width="150" height="150" />
          <UiText block className={b('text', ['content'])}>Plase sign the message and the datasets will be downloaded shortly. You can always download this dataset from you profile page.</UiText>
          <UiDivider type="l" />
        </div>
      </>
    )
  } else {
    return <span />
  }
}
