import React, { useEffect, useContext, useState, createRef, useCallback } from 'react'
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
import { XuiTokenName, XuiTokenPrice } from 'ui'
import { Loader } from '@nevermined-io/styles'
import { User } from '../context'
import {
  toDate,
  getDdoTokenAddress,
  calculateStartEndPage,
  calculatePages,
  Provenance,
  getSampleURL
} from '../shared'
import { Markdown } from 'ui/markdown/markdown'
import Image from 'next/image'
import { XuiPagination } from 'ui/+assets-query/pagination'
import { didZeroX } from '@nevermined-io/nevermined-sdk-js/dist/node/utils'
import { correctNetworkId, correctNetworkName, EVENT_PREFIX, PROTOCOL_PREFIX } from 'src/config'
import { loadAssetProvenance } from 'src/shared/graphql'
import {  EventOptions} from '@nevermined-io/nevermined-sdk-js/dist/node/events/NeverminedEvent';

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
    const events = await loadAssetProvenance(sdk, getProvider(), String(did))
    const nftProvenance: NftProvenance[] = events.map( (event: EventOptions) => {
      return {
        id: event.id,
        action: event._attributes,
        address: event._agentId,
        date: event.date.toISOString().replace(/\.[0-9]{3}/, ''),
        blockNumber: event._blockNumberUpdated.toString()
      }
    })
    setProvenance(nftProvenance)

    console.log("walletAddress: " + walletAddress)
    nftProvenance.forEach(function (event) {
      console.log("events address " + event.address);
  })
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
        const ddo = await assets.getSingle(String(did))
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

    window.ethereum.on('chainChanged', checkNetworkAndSetState)

    //remove the event
    return () => {
      window.ethereum.removeListener('chainChanged', checkNetworkAndSetState)
    }
  }, [])

  // check network on page load
  useEffect(() => {
    if (!window.ethereum) {
      return
    }

    (async () => {
      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' })
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
        <UiText wrapper="h1" type="h1" variants={['heading']}>
          Details
        </UiText>
        <UiText type="h2" wrapper="h2" variants={['heading']}>
          {metadata.main.name}
        </UiText>

        <UiLayout align="start" type="sides">
          <div className={b('content')}>
            <UiText type="h3" wrapper="h3" variants={['underline']}>
              Description
            </UiText>
            <UiDivider />
            <p>
              {metadata
                .additionalInformation!.description?.replaceAll('-', '\n-')
                .split('\n')
                .map((_, i) => (
                  <UiText key={i} block>
                    {_}
                  </UiText>
                ))}
            </p>
            <UiDivider type="l" />
            <UiButton
              cover
              style={{ padding: '0', width: '235px', background: '#2E405A', textTransform: 'none' }}
              onClick={openSample}
            >
              <img src="/assets/logos/filecoin_grey.svg" />
              &nbsp;&nbsp;Download Sample Data
            </UiButton>
            <UiDivider type="s" />
            <UiText
              type="h3"
              wrapper="h3"
              variants={['underline']}
              className={b('provenance-title')}
            >
              Provenance
            </UiText>
            {provenance.slice(startEndPage().start, startEndPage().end).map((p) => (
              <div key={p.id}>
                <UiLayout direction="row" className={p.address.toLowerCase() === walletAddress.toLowerCase()?b('provenance-entry-userAddress'):b('provenance-entry')}>
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
                      <UiText type="small">
                        {p.date}
                      </UiText>
                    </UiLayout>
                  </UiLayout>
                  <UiLayout direction="row" className={b('provenance-entry-data', ['right'])}>
                    <UiLayout direction="column">
                      <UiText type="p">Block Number</UiText>
                      <UiText type="small">
                        {p.blockNumber}
                      </UiText>
                    </UiLayout>
                  </UiLayout>
                </UiLayout>
              </div>
            ))}

            {totalPages > 1 && (
              <XuiPagination totalPages={totalPages} page={page} setPage={setPage} />
            )}

            <UiDivider type="s" />
            <UiDivider />
            <UiText type="h3" wrapper="h3" variants={['underline']}>
              Command Line Interface
            </UiText>
            <UiDivider />
            <UiText type="p">
              To download this dataset directly from the CLI run the following command
            </UiText>
            <Markdown code={`$ ncli assets get ${asset.id}`} />
          </div>
          <UiDivider vertical />
          <div>
            <UiText block className={b('side-box')}>
              <UiText className={b('attr')} type="caps">
                Author:
              </UiText>{' '}
              {metadata.main.author}
              <br />
              <UiText className={b('attr')} type="caps">
                Date:
              </UiText>{' '}
              {toDate(metadata.main.dateCreated)}
            </UiText>

            <UiDivider />

            <UiLayout>
              <UiIcon color="secondary" icon="file" size="xl" />
              <UiDivider vertical type="s" />
              <UiText block>
                <UiText className={b('attr')} type="caps" variants={['bold']}>
                  Price:
                </UiText>{' '}
                <XuiTokenPrice>{metadata.main.price}</XuiTokenPrice>{' '}
                <XuiTokenName address={getDdoTokenAddress(asset)?.toString()} />
                <br />
                <UiText className={b('attr')} type="caps" variants={['bold']}>
                  Files:
                </UiText>{' '}
                {metadata.main.files?.length}
                <br />
                <UiText className={b('attr')} type="caps" variants={['bold']}>
                  Size:
                </UiText>{' '}
                {metadata.main.files
                  ?.map((item) => Number(item.contentLength))
                  .reduce((acc, el) => acc + el) + ' bytes'}
                <br />
                <UiText className={b('attr')} type="caps" variants={['bold']}>
                  Type:
                </UiText>{' '}
                {metadata.main.files
                  ?.map((item) => item.contentType)
                  .reduce((acc, el) => {
                    return acc.includes(el) ? acc : acc.concat(` ${el}`)
                  })}
              </UiText>
              <UiDivider flex />
            </UiLayout>

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
                {isConnected ? 'Purchase' : 'Connect Wallet'}
              </UiButton>
            )}
          </div>
        </UiLayout>
      </UiLayout>
    </>
  )
}
