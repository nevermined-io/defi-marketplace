import React, { useEffect, useContext, useState } from 'react'
import type { NextPage } from 'next'
import styles from './status.module.scss'

import { BEM, UiText, UiLayout, UiDivider } from 'ui'
import { User } from '../context'
import { PlatformVersions } from '@nevermined-io/nevermined-sdk-js'

const b = BEM('details', styles)

export const Status: NextPage = () => {
  const {sdk} = useContext(User)
  const [versions, setVersions] = useState<PlatformVersions>()

  useEffect(() => {
    if (!sdk.versions) {
      return
    }
    sdk.versions.get()
      .then(v => setVersions(v))
  }, [sdk])

  return (
    <>
      <UiLayout type="container">
        <UiText block wrapper="h1" type="h1" variants={['heading']}>Marketplace Status</UiText>
        <UiText block type="h3" wrapper="h3" variants={['underline']}>Components status</UiText>
        <UiText>{JSON.stringify(versions?.status!)}</UiText>
        <UiDivider/>
        <UiText>{JSON.stringify(versions?.gateway!)}</UiText>
        <UiDivider/>
        <UiText>{JSON.stringify(versions?.metadata)}</UiText>
        <UiDivider/>
        <UiText>{JSON.stringify(versions?.sdk!)}</UiText>
      </UiLayout>
    </>
  )
}
