import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { Catalog } from '@nevermined-io/catalog-core'

import { UiText, UiLayout, UiDivider, CircleSpinner } from '@nevermined-io/styles'
import { PlatformVersions } from '@nevermined-io/nevermined-sdk-js'

export const Status: NextPage = () => {
  const { sdk } = Catalog.useNevermined()
  const [versions, setVersions] = useState<PlatformVersions>()

  useEffect(() => {
    if (!sdk.versions) {
      return
    }
    sdk.versions.get().then((v) => {
      console.log(v)
      setVersions(v)
    })
  }, [sdk])

  return versions ? (
    <>
      <UiLayout type="container">
        <UiText block wrapper="h1" type="h1" variants={['heading']}>
          Marketplace Status
        </UiText>
        <UiText block type="h3" wrapper="h3" variants={['underline']}>
          Components status
        </UiText>
        <UiDivider />

        <UiLayout type="container">
          <UiText>Marketplace Status:</UiText>
          <UiLayout style={{ paddingLeft: '10px' }}>
            <UiText variants={['secondary']}>
              status{' '}
              <UiText variants={['highlight']}>
                {versions.status.ok ? 'Working' : 'Offline'}{' '}
              </UiText>
              <br />
            </UiText>
          </UiLayout>
        </UiLayout>
        <UiDivider />

        <UiLayout type="container">
          <UiText>Gateway Status:</UiText>
          <UiLayout style={{ paddingLeft: '10px' }}>
            <UiText variants={['secondary']}>
              status <UiText variants={['highlight']}>{versions.gateway.status} </UiText>
              <br />
              version <UiText variants={['highlight']}>{versions.gateway.version} </UiText>
              <br />
            </UiText>
          </UiLayout>
        </UiLayout>

        <UiDivider />
        <UiLayout type="container">
          <UiText>Metadata:</UiText>
          <UiLayout style={{ paddingLeft: '10px' }}>
            <UiText variants={['secondary']}>
              status <UiText variants={['highlight']}>{versions.metadata.status} </UiText>
              <br />
              version <UiText variants={['highlight']}>{versions.metadata.version} </UiText>
              <br />
            </UiText>
          </UiLayout>
        </UiLayout>
        <UiDivider />
        <UiLayout type="container">
          <UiText>SDK:</UiText>
          <UiLayout style={{ paddingLeft: '10px' }}>
            <UiText variants={['secondary']}>
              status <UiText variants={['highlight']}>{versions.sdk.status} </UiText>
              <br />
              commit <UiText variants={['highlight']}>{versions.sdk.commit} </UiText>
              <br />
              version <UiText variants={['highlight']}>{versions.sdk.version} </UiText>
              <br />
              keeperVersion <UiText variants={['highlight']}>{versions.sdk.keeperVersion} </UiText>
              <br />
              network <UiText variants={['highlight']}>{versions.sdk.network} </UiText>
              <br />
            </UiText>
          </UiLayout>
        </UiLayout>
      </UiLayout>
    </>
  ) : (
    <UiLayout type="container">
      <UiText block wrapper="h1" type="h1" variants={['heading']}>
        Marketplace Status
      </UiText>
      <UiText block type="h3" wrapper="h3" variants={['underline']}>
        Components status
      </UiText>
      <UiDivider />
      <CircleSpinner circleSpimmerSrc="/assets/circle-loadspinner.svg" width="150" height="150" />
    </UiLayout>
  )
}
