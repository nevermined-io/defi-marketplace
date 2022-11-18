import React, { useEffect, useContext, useState, createRef, useCallback, useRef } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { DDO } from '@nevermined-io/nevermined-sdk-js'
import { Catalog } from '@nevermined-io/catalog-core'
import { useWallet } from '@nevermined-io/catalog-providers'
import styles from './details.module.scss'
import {
  BEM,
  UiText,
  UiIcon,
  UiLayout,
  UiDivider,
  UiButton,
  UiPopupHandlers,
  NotificationPopup
} from '@nevermined-io/styles'
import { XuiTokenName } from 'ui'
import { Loader } from '@nevermined-io/styles'
import { User } from '../context'
import {
  toDate,
  getDdoTokenAddress,
  calculateStartEndPage,
  calculatePages,
  getDefiInfo,
  getDdoSubscription,
  DDOSubscription
} from 'src/shared'
import { Markdown } from 'ui/markdown/markdown'
import Image from 'next/image'
import { XuiPagination } from 'ui/+assets-query/pagination'
import { correctNetworkId, correctNetworkName } from 'src/config'
import { loadAssetProvenance } from 'src/shared/graphql'
import DatasetIcon from '../../public/assets/dataset.svg'
import { SubscriptionBadge } from '../components/subscription-badge/subscription-badge'
import { XuiDownloadAsset } from '../components/+download-asset/download-asset'

const b = BEM('details', styles)
const PROVENANCE_PER_PAGE = 4

interface NftProvenance {
  id: string
  action: string
  address: string
  date: string
  blockNumber: string
}

export const AssetDetails: NextPage = () => {
  const {
    query: { did }
  } = useRouter()
  const [asset, setAsset] = useState<DDO | false>()
  const [isConnected, setIsConnected] = useState(false)
  const [ownAsset] = useState(false)
  const { isLogged, userSubscriptions } = useContext(User)
  const { assets, sdk } = Catalog.useNevermined()
  const { getProvider, login, walletAddress, getConnectors } = useWallet()
  const popupRef = createRef<UiPopupHandlers>()
  const downloadPopupRef = useRef<UiPopupHandlers>()
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true)
  const [provenance, setProvenance] = useState<NftProvenance[]>([])
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [errorMessage, setErrorMessage] = useState('')
  const [assetDid, setAssetDid] = useState<string>('')

  const closePopup = (event: any) => {
    popupRef.current?.close()
    event.preventDefault()
  }

  const startEndPage = useCallback(() => {
    return calculateStartEndPage(page, PROVENANCE_PER_PAGE)
  }, [page])

  const getProvenanceInfo = async () => {
    const events: any = await loadAssetProvenance(sdk, getProvider(), String(did))
    const nftProvenance: NftProvenance[] = events.map((event: any) => {
      return {
        id: event.id,
        action: event._attributes,
        address: event._agentId,
        date: event.date.toISOString().replace(/\.[0-9]{3}/, ''),
        blockNumber: event._blockNumberUpdated.toString()
      }
    })
    setProvenance(nftProvenance)
  }

  const checkAssetInUserSubscription = (subscription: DDOSubscription) => {
    const subs = userSubscriptions.find(
      (s) => s.tier === subscription.tier.toString() && s.address === subscription.address
    )
    if (subs?.access) {
      return true
    }
    return false
  }

  const downloadAsset = async (did: string, subscription: DDOSubscription) => {
    if (!checkAssetInUserSubscription(subscription)) {
      setErrorMessage("You can't download this Asset with your current subscription")
      popupRef.current?.open()
      return
    }
    setAssetDid(did)
    downloadPopupRef.current?.open()
  }

  useEffect(() => {
    getProvenanceInfo()
  }, [])

  useEffect(() => {
    if (!sdk.assets || !did) {
      return
    }

    (async () => {
      setIsConnected(isLogged)

      try {
        const ddo = await assets.findOne(String(did))
        setAsset(ddo)
      } catch (error) {
        console.log(error)
        setAsset(false)
      }
    })()
  }, [sdk])

  // if chain change, show button to swit
  useEffect(() => {
    const checkNetworkAndSetState = (chainId: any) => {
      if (chainId !== correctNetworkId) {
        setIsCorrectNetwork(false)
      }
    }

    window?.ethereum?.on?.('chainChanged', checkNetworkAndSetState)

    //remove the event
    return () => {
      window?.ethereum?.removeListener?.('chainChanged', checkNetworkAndSetState)
    }
  }, [])

  // check network on page load
  useEffect(() => {
    if (!window.ethereum) {
      return
    }

    (async () => {
      try {
        const chainId = await window?.ethereum?.request({ method: 'eth_chainId' })
        if (chainId !== correctNetworkId) {
          setIsCorrectNetwork(false)
        }
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])

  useEffect(() => {
    setTotalPages(calculatePages(provenance.length, PROVENANCE_PER_PAGE))
  }, [provenance])

  if (!asset) {
    return (
      <UiLayout type="grid" align="center" justify="space-between" direction="column">
        {!isCorrectNetwork ? (
          <>
            <UiText style={{ padding: '10px' }} alert>
              Please, switch to {correctNetworkName} to see the details
            </UiText>
            <UiButton
              style={{
                margin: '10px',
                padding: '10px',
                background: '#2E405A',
                textTransform: 'none'
              }}
            >
              switch to {correctNetworkName} network
            </UiButton>
          </>
        ) : asset === false ? (
          <UiText style={{ padding: '10px' }} alert>
            Error loading the asset
          </UiText>
        ) : (
          <UiLayout type="container" className={b('spinner-container')}>
            <UiText className={b('loadspinner')}>
              <Loader />
            </UiText>
          </UiLayout>
        )}
      </UiLayout>
    )
  }
  const metadata = asset.findServiceByType('metadata').attributes
  const defi = getDefiInfo(metadata)
  const subscription = getDdoSubscription(asset)

  return (
    <>
      <UiLayout type="container">
        <XuiDownloadAsset popupRef={downloadPopupRef} assetDid={assetDid} />
        <NotificationPopup closePopup={closePopup} message={errorMessage} popupRef={popupRef} />
        <UiLayout align="start" type="sides">
          <div className={b('content')}>
            <UiText type="h2" wrapper="h2">
              {metadata.main.name || '-'}
            </UiText>
            <UiDivider className={b('divider-line', ['fade'])} />
            {metadata.additionalInformation!.description && (
              <>
                <UiText type="caps" variants={['detail']}>
                  Description
                </UiText>
                <UiDivider type="s" />
                <div>
                  {metadata
                    .additionalInformation!.description?.replaceAll('-', '\n-')
                    .split('\n')
                    .map((_, i) => (
                      <UiText key={i} block>
                        {_}
                      </UiText>
                    ))}
                </div>
                <UiDivider type="l" className={b('divider-line', ['l'])} />
              </>
            )}
            {defi?.category && (
              <>
                <div className={b('field-row')}>
                  <UiText type="caps" variants={['detail']}>
                    Category
                  </UiText>
                  <span>
                    <UiIcon
                      className={b('field-icon', ['folder'])}
                      icon="folder"
                      color="secondary"
                    />
                    <UiText className={b('field-text')} type="caps">
                      {defi?.category}
                      {defi.subcategory && (
                        <>
                          <span className={b('dash')} />
                          {defi.subcategory}
                        </>
                      )}
                    </UiText>
                  </span>
                </div>
                <UiDivider type="s" className={b('divider-line', ['s'])} />
              </>
            )}
            {Boolean(
              metadata?.main?.type || metadata?.additionalInformation?.customData?.subtype
            ) && (
                <>
                  <div className={b('field-row')}>
                    <UiText type="caps" variants={['detail']}>
                      Type
                    </UiText>
                    <span>
                      <DatasetIcon className={b('field-icon', ['dataset'])} />
                      <UiText className={b('field-text')} type="caps">
                        {metadata.additionalInformation?.customData?.subtype || metadata.main?.type}
                      </UiText>
                    </span>
                  </div>
                  <UiDivider type="s" className={b('divider-line', ['s'])} />
                </>
              )}
            {defi?.network && (
              <>
                <div className={b('field-row')}>
                  <UiText type="caps" variants={['detail']}>
                    Network
                  </UiText>
                  <span>
                    {defi.network.toLowerCase() == 'none' || defi.network.toLowerCase() == 'na' ? (
                      <></>
                    ) : (
                      <img
                        className={b('field-icon', ['network'])}
                        alt="network"
                        src={`/assets/logos/${defi.network.toLowerCase()}.svg`}
                      />
                    )}
                    <UiText className={b('field-text')} type="caps">
                      {defi.network}
                    </UiText>
                  </span>
                </div>
                <UiDivider type="s" className={b('divider-line', ['s'])} />
              </>
            )}
            {metadata?.additionalInformation?.customData?.subtype === 'report' &&
              metadata.additionalInformation.customData.report_type && (
                <>
                  <div className={b('field-row')}>
                    <UiText type="caps" variants={['detail']}>
                      Report Type
                    </UiText>
                    <span>
                      <DatasetIcon className={b('field-icon', ['dataset'])} />
                      <UiText className={b('field-text')} type="caps">
                        {metadata.additionalInformation.customData.report_type}
                      </UiText>
                    </span>
                  </div>
                  <UiDivider type="s" className={b('divider-line', ['s'])} />
                </>
              )}
            {metadata?.additionalInformation?.customData?.subtype === 'report' &&
              metadata.additionalInformation.customData.report_format && (
                <>
                  <div className={b('field-row')}>
                    <UiText type="caps" variants={['detail']}>
                      Report Format
                    </UiText>
                    <span>
                      <DatasetIcon className={b('field-icon', ['dataset'])} />
                      <UiText className={b('field-text')} type="caps">
                        {metadata.additionalInformation.customData.report_format}
                      </UiText>
                    </span>
                  </div>
                  <UiDivider type="s" className={b('divider-line', ['s'])} />
                </>
              )}
            {metadata?.additionalInformation?.customData?.subtype === 'notebook' &&
              metadata.additionalInformation.customData.notebook_language && (
                <>
                  <div className={b('field-row')}>
                    <UiText type="caps" variants={['detail']}>
                      Language
                    </UiText>
                    <span>
                      <DatasetIcon className={b('field-icon', ['dataset'])} />
                      <UiText className={b('field-text')} type="caps">
                        {metadata.additionalInformation.customData.notebook_language}
                      </UiText>
                    </span>
                  </div>
                  <UiDivider type="s" className={b('divider-line', ['s'])} />
                </>
              )}
            {metadata?.additionalInformation?.customData?.subtype === 'notebook' &&
              metadata.additionalInformation.customData.notebook_format && (
                <>
                  <div className={b('field-row')}>
                    <UiText type="caps" variants={['detail']}>
                      Format
                    </UiText>
                    <span>
                      <DatasetIcon className={b('field-icon', ['dataset'])} />
                      <UiText className={b('field-text')} type="caps">
                        {metadata.additionalInformation.customData.notebook_format}
                      </UiText>
                    </span>
                  </div>
                  <UiDivider type="s" className={b('divider-line', ['s'])} />
                </>
              )}
            {metadata?.additionalInformation?.customData?.subtype === 'notebook' &&
              metadata.additionalInformation.customData.notebook_requirements && (
                <>
                  <div className={b('field-column')}>
                    <UiText type="caps" variants={['detail']}>
                      Requirements
                    </UiText>
                    <UiText className={b('field-text')}>
                      {metadata.additionalInformation.customData.notebook_requirements}
                    </UiText>
                  </div>
                  <UiDivider type="s" className={b('divider-line', ['s'])} />
                </>
              )}
            <div className={b('field-column')}>
              <UiText type="caps" variants={['detail']}>
                Provenance
              </UiText>
              <UiDivider type="s" />
              {provenance.slice(startEndPage().start, startEndPage().end).map((p) => (
                <div key={p.id}>
                  <UiLayout
                    direction="row"
                    className={
                      p.address.toLowerCase() === walletAddress.toLowerCase()
                        ? b('provenance-entry-userAddress')
                        : b('provenance-entry')
                    }
                  >
                    <UiLayout direction="row" className={b('provenance-entry-data', ['left'])}>
                      <UiLayout className={b('provenance-entry-data-ellipse')}>
                        <Image width="26" height="26" alt="ellipse" src="/assets/ellipse.svg" />
                      </UiLayout>
                      <UiLayout direction="column">
                        <UiText type="p">Action</UiText>
                        <UiText type="small">{p.action}</UiText>
                      </UiLayout>
                    </UiLayout>
                    <UiLayout direction="row" className={b('provenance-entry-data', ['left'])}>
                      <UiLayout direction="column">
                        <UiText type="p">Address</UiText>
                        <UiText type="small">
                          {p.address.slice(0, 10)}...{p.address.slice(-4)}
                        </UiText>
                      </UiLayout>
                    </UiLayout>
                    <UiLayout direction="row" className={b('provenance-entry-data', ['right'])}>
                      <UiLayout direction="column">
                        <UiText type="p">Date</UiText>
                        <UiText type="small">{p.date}</UiText>
                      </UiLayout>
                    </UiLayout>
                    <UiLayout direction="row" className={b('provenance-entry-data', ['right'])}>
                      <UiLayout direction="column">
                        <UiText type="p">Block Number</UiText>
                        <UiText type="small">{p.blockNumber}</UiText>
                      </UiLayout>
                    </UiLayout>
                  </UiLayout>
                </div>
              ))}
              {totalPages > 1 && (
                <XuiPagination totalPages={totalPages} page={page} setPage={setPage} />
              )}
              <UiDivider type="s" className={b('divider-line', ['s'])} />
            </div>
            <div className={b('field-column')}>
              <UiText type="caps" variants={['detail']}>
                Command Line Interface
              </UiText>
              <UiDivider type="s" />
              <UiText type="p">
                To download this dataset directly from the CLI run the following command
              </UiText>
              <Markdown code={`$ ncli assets get ${asset.id}`} />
              <UiDivider type="s" className={b('divider-line', ['s'])} />
            </div>
          </div>

          <UiDivider vertical />

          <div className={b('side-panel')}>
            <div className={b('side-box')}>
              <div className={b('field-row')}>
                <UiText className={b('attr')} type="caps">
                  Author:
                </UiText>
                <UiText className={b('attr', ['value'])}>{metadata.main.author}</UiText>
              </div>
              <div className={b('field-row')}>
                <UiText className={b('attr')} type="caps">
                  Date:
                </UiText>
                <UiText className={b('attr', ['value'])}>
                  {toDate(metadata.main.dateCreated)}
                </UiText>
              </div>
            </div>

            <UiDivider />

            <UiLayout className={b('asset-attributes')}>
              <UiIcon color="secondary" icon="file" className={b('side-box-icon')} />
              <div className={b('fields')}>
                {subscription?.tier && (
                  <div className={b('field-row')}>
                    <UiText className={b('attr')} type="caps">
                      Subscription
                    </UiText>{' '}
                    <SubscriptionBadge
                      tier={subscription.tier}
                      inactive={!checkAssetInUserSubscription(subscription)} />
                  </div>
                )}
                <div className={b('field-row')}>
                  <XuiTokenName address={getDdoTokenAddress(asset)?.toString()} />
                </div>
                <div className={b('field-row')}>
                  <UiText className={b('attr')} type="caps">
                    Files
                  </UiText>{' '}
                  {metadata.main.files?.length}
                </div>
                <div className={b('field-row')}>
                  <UiText className={b('attr')} type="caps">
                    Size
                  </UiText>{' '}
                  {metadata.main.files
                    ?.map((item) => Number(item.contentLength))
                    .reduce((acc, el) => acc + el) + ' bytes'}
                </div>
                <div className={b('field-row')}>
                  <UiText className={b('attr')} type="caps">
                    Type
                  </UiText>{' '}
                  {metadata.main.files
                    ?.map((item) => item.contentType)
                    .reduce((acc, el) => {
                      return acc.includes(el) ? acc : acc.concat(` ${el}`)
                    })}
                </div>
                <UiDivider />
                {ownAsset ? (
                  <UiText className={b('already-purchased')}>
                    You already purchased this dataset,{' '}
                    <span className={b('already-purchased-link')}>
                      <Link href="/profile">see in your bundle</Link>
                    </span>
                  </UiText>
                ) : (
                  <UiButton
                    cover
                    onClick={() => {
                      if (!isConnected) {
                        login(getConnectors()[0])
                        return
                      }

                      downloadAsset(asset.id, subscription)
                    }}
                  >
                    {isConnected ? 'Download' : 'Connect Wallet'}
                  </UiButton>
                )}
              </div>
            </UiLayout>
          </div>
        </UiLayout>
      </UiLayout>
    </>
  )
}
