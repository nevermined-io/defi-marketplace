import React, { useEffect, useContext, useState, createRef, useCallback, useMemo } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { DDO, AdditionalInformation } from '@nevermined-io/nevermined-sdk-js'
import { Catalog } from '@nevermined-io/catalog-core'
import { MetaMask } from '@nevermined-io/catalog-providers'
import styles from './details.module.scss'
import {
  BEM,
  UiText,
  UiIcon,
  UiLayout,
  UiDivider,
  UiButton,
  UiPopupHandlers
} from '@nevermined-io/styles'
import { XuiTokenName } from 'ui'
import { Loader } from '@nevermined-io/styles'
import { User } from '../context'
import {
  toDate,
  getDdoTokenAddress,
  calculateStartEndPage,
  calculatePages,
  getSampleURL,
  getDefiInfo,
  getDdoSubscription
} from 'src/shared'
import { Markdown } from 'ui/markdown/markdown'
import { correctNetworkId, correctNetworkName, EVENT_PREFIX, PROTOCOL_PREFIX } from 'src/config'
import { loadAssetProvenance } from 'src/shared/graphql'
import DatasetIcon from '../../public/assets/dataset.svg'
import { SubscriptionBadge } from '../components/subscription-badge/subscription-badge'

const b = BEM('details', styles)
const PROVENANCE_PER_PAGE = 4

interface AdditionalInformationExtended extends AdditionalInformation {
  sampleUrl: string
}

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
  const [ownAsset, setOwnAsset] = useState(false)
  const { isLogged } = useContext(User)
  const { assets, sdk } = Catalog.useNevermined()
  const { getProvider, loginMetamask, switchChainsOrRegisterSupportedChain } = MetaMask.useWallet()
  const popupRef = createRef<UiPopupHandlers>()
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true)
  const [provenance, setProvenance] = useState<NftProvenance[]>([])
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const { walletAddress } = MetaMask.useWallet()

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour12: true,
    hour: 'numeric',
    minute: 'numeric'
  }

  const openPopup = (event: any) => {
    popupRef.current?.open()
    event.preventDefault()
  }

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

  useEffect(() => {
    getProvenanceInfo()
  }, [])

  useEffect(() => {
    if (!sdk.assets || !did) {
      return
    }

    ;(async () => {
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

    window?.ethereum?.on('chainChanged', checkNetworkAndSetState)

    //remove the event
    return () => {
      window?.ethereum?.removeListener('chainChanged', checkNetworkAndSetState)
    }
  }, [])

  // check network on page load
  useEffect(() => {
    if (!window.ethereum) {
      return
    }

    ;(async () => {
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
              onClick={async () => await switchChainsOrRegisterSupportedChain()}
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

  const openSample = async () => {
    const addtionalInfoExtended = metadata.additionalInformation as AdditionalInformationExtended
    const categoryElement = addtionalInfoExtended.categories?.find((category) =>
      category.includes(PROTOCOL_PREFIX)
    )
    const eventElement = addtionalInfoExtended.categories?.find((event) =>
      event.includes(EVENT_PREFIX)
    )
    const category = categoryElement?.substring(categoryElement.indexOf(':') + 1) || ''
    const event = eventElement?.substring(eventElement.indexOf(':') + 1) || ''
    const url = await getSampleURL(category, event)
    const win = window.open(url, '_blank')
    win?.focus()
  }

  return (
    <>
      <UiLayout type="container">
        <UiLayout align="start" type="sides">
          <div className={b('content')}>
            <UiText type="h2" wrapper="h2">
              Report
            </UiText>
            <UiDivider className={b('divider-line', ['fade'])} />
            {metadata.main.name && (
              <>
                <UiText type="h4" wrapper="h4">
                  {metadata.main.name}
                </UiText>
                <UiDivider />
              </>
            )}
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
                  <div className={b('field-row')}>
                    <UiText type="caps" variants={['detail']}>
                      Requirements
                    </UiText>
                    <span>
                      <DatasetIcon className={b('field-icon', ['dataset'])} />
                      <UiText className={b('field-text')} type="caps">
                        {metadata.additionalInformation.customData.notebook_requirements}
                      </UiText>
                    </span>
                  </div>
                  <UiDivider type="s" className={b('divider-line', ['s'])} />
                </>
              )}
            <>
              <UiText type="caps" variants={['detail']}>
                Command Line Interface
              </UiText>
              <UiDivider type="s" />
              <UiText type="p">
                To download this dataset directly from the CLI run the following command
              </UiText>
              <Markdown code={`$ ncli assets get ${asset.id}`} />
              <UiDivider type="s" className={b('divider-line', ['s'])} />
            </>
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
                    <SubscriptionBadge tier={subscription.tier} />
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
                    onClick={(e: any) => {
                      if (!isConnected) {
                        loginMetamask()
                        return
                      }
                      openPopup(e)
                      // TODO, add Download button
                      //addtoCart()
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
