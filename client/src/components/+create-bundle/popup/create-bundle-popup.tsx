import React, { useContext, useEffect, useState } from 'react'
import { DDO } from '@nevermined-io/nevermined-sdk-js'
import { BEM, UiText, UiDivider, UiLayout, UiButton } from 'ui'
import { User } from '../../../context'
import styles from './create-bundle-popup.module.scss'
import { createBundle, checkBundleStatus } from 'src/shared'
import { BUNDLE_MAX_RETRYS, BUNDLE_STATUS_COMPLETED, BUNDLE_RETRY_TIMEOUT } from 'src/config'

interface CreateBundlePopupProps {
  assets: DDO[]
  close: () => any
}

const b = BEM('create-bundle-popup', styles)

export function XuiCreateBundlePopup(props: CreateBundlePopupProps) {
  const { close, assets } = props
  const { sdk } = useContext(User)
  const [error, setError] = useState<string | undefined>(undefined)
  const [bundleId, setBundleId] = useState<string | undefined>(undefined)
  const [bundleDid, setBundleDid] = useState<string | undefined>(undefined)
  const [timeoutBundle, seTimeoutBundle] = useState<boolean>(false)


  const start = async () => {
    const account = (await sdk.accounts.list())[0]
    createBundle(account.getId(), assets)
      .then(response => setBundleId(response.data.bundle_id))
      .catch(err => setError(err.message))
  }

  const checkStatus = async () => {
    if (bundleId) {
      let retrys = 0
      while (retrys < BUNDLE_MAX_RETRYS && !bundleDid) {
        const status = await checkBundleStatus(bundleId)
        if (status.data.bundle.status === BUNDLE_STATUS_COMPLETED) {
          setBundleDid(status.data.bundle.did)
        }
        retrys++
        await new Promise(r => setTimeout(r, BUNDLE_RETRY_TIMEOUT));
      }
    }
    setBundleId(undefined)
    seTimeoutBundle(true)
  }

  const clean = async () => {
    setBundleId(undefined)
    seTimeoutBundle(false)
    setError(undefined)
    setBundleDid(undefined)
  }

  const cleanAndClose = () => {
    clean()
    close()
  }

  useEffect(() => {
    checkStatus()
  }, [bundleId])

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
        <UiButton className={b('button')} type="error" onClick={cleanError}>Return</UiButton>
      </>
    )

  } else if (!bundleId && !timeoutBundle) {
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
  } else if (bundleId) {
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
  else if (bundleDid) {
    return (
      <>
        <UiText block type="h3" className={b('text')}>Your datasets are ready to download</UiText>
        <UiDivider type="xl" />
        <UiLayout>
          <UiButton className={b('button')}>Donwload</UiButton>
          <UiDivider vertical />
          <UiButton className={b('button')} type="secondary" onClick={cleanAndClose}>Cancel</UiButton>
        </UiLayout>
      </>
    )
  }
  else if (timeoutBundle) {
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
  }
}
