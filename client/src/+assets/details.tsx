import React, { useEffect, useContext, useState, createRef, useCallback } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { DDO, AdditionalInformation } from '@nevermined-io/nevermined-sdk-js'
import styles from './details.module.scss'
import { Loader } from '../components/loaders/loader';
import { BEM, UiText, UiIcon, UiLayout, UiDivider, XuiTokenName, XuiTokenPrice, UiButton, UiPopupHandlers, UiPopup } from 'ui'
import { User } from '../context'
import { toDate, getDdoTokenAddress, calculateStartEndPage, calculatePages, getBundlesWithDataset, getSampleURL } from '../shared'
import { Markdown } from 'ui/markdown/markdown'
import { AddedToBasketPopup } from './added-to-basket-popup'
import Image from "next/image"
import { XuiPagination } from 'ui/+assets-query/pagination'
import { didZeroX } from '@nevermined-io/nevermined-sdk-js/dist/node/utils'
import { loadPublishedEvent, RegisteredAsset } from 'src/shared/graphql'
import { correctNetworkId, correctNetworkName, EVENT_PREFIX, PROTOCOL_PREFIX } from 'src/config'


const b = BEM('details', styles)
const PROVENANCE_PER_PAGE = 4;

interface AdditionalInformationExtended extends AdditionalInformation {
  sampleUrl: string;
}

export const AssetDetails: NextPage = () => {
  const { query: { did } } = useRouter()
  const [asset, setAsset] = useState<DDO | false>()
  const [isConnected, setIsConnected] = useState(false)
  const [ownAsset, setOwnAsset] = useState(false)
  const { sdk, addToBasket, loginMetamask,switchToCorrectNetwork,  isLogged, userBundles, web3 } = useContext(User)
  const popupRef = createRef<UiPopupHandlers>()
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [provenance, setProvenance] = useState([]);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true);

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
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
    const published = await loadPublishedEvent(didZeroX(did), web3)
    const bundlesPuchased = await getBundlesWithDataset(did)

    const provenance = bundlesPuchased.map(bundle => ({
      id: bundle.did,
      action: 'bought',
      date: new Date(bundle.createdAt),
      account: bundle.user,
      price: 0,
      currency: 'USDC'
    })
    )

    if (published) {
      provenance.unshift({
        id: published.did,
        action: 'published',
        date: published.registeredAt,
        account: published.owner,
        price: 0,
        currency: 'USDC'
      })
    }
    setProvenance(provenance)
  }


  useEffect(() => {
    getProvenanceInfo()
  }, [web3])


  useEffect(() => {
    if (!sdk.assets || !did) {
      return
    }

    (async () => {
      setIsConnected(isLogged)

      try {
        let ddo = await sdk.assets.resolve(String(did))
        setAsset(ddo)
      } catch (error) {
        console.log(error)
        setAsset(false)
      }

    })()
  }, [sdk])

  useEffect(() => {
    if (asset && userBundles?.length) {
      if (userBundles.some(bundle => bundle.datasets.some(dataset => dataset.datasetId === asset.id))) {
        setOwnAsset(true)
      }
    }
  }, [asset, userBundles])


  // if chain change, show button to swit
  useEffect(() => {
    const checkNetworkAndSetState = (chainId: any) => {
      if (chainId !== correctNetworkId) {
        setIsCorrectNetwork(false)
      } else {
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
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
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
      <UiLayout type="grid"
        align="center"
        justify="space-between"
        direction="column">
        {
          !isCorrectNetwork ?
            <>
              <UiText style={{ padding: '10px' }} alert>Please,  switch to {correctNetworkName} to see the details</UiText>
              <UiButton style={{ margin: '10px', padding: '10px', background: "#2E405A", textTransform: "none" }}
                onClick={async () => await switchToCorrectNetwork()}>
                switch to {correctNetworkName} network
              </UiButton>
            </>
            :
            asset ===false ?
              <UiText style={{ padding: '10px' }} alert>Error loading the asset</UiText>
              :
              <UiLayout type="container" className={b("spinner-container")} >
                <UiText className={b("loadspinner")} >
                  <Loader />
                </UiText>
              </UiLayout>
        }
      </UiLayout>
    )
  }

  const metadata = asset.findServiceByType('metadata').attributes

  const openSample = async () => {
    const addtionalInfoExtended = metadata.additionalInformation as AdditionalInformationExtended
    const categoryElement = addtionalInfoExtended.categories?.find(category => category.includes(PROTOCOL_PREFIX))
    const eventElement = addtionalInfoExtended.categories?.find(event => event.includes(EVENT_PREFIX))
    const category = categoryElement?.substring(categoryElement.indexOf(':') + 1) || ""
    const event = eventElement?.substring(eventElement.indexOf(':') + 1) || ""
    const url = await getSampleURL(category, event)
    const win = window.open(url, "_blank");
    win?.focus();
  }

  const addtoCart = () => {
    addToBasket([asset.id])
  }

  return (
    <>
      <AddedToBasketPopup closePopup={closePopup} popupRef={popupRef} />

      <UiLayout type="container">
        <UiText wrapper="h1" type="h1" variants={['heading']}>Details</UiText>
        <UiText type="h2" wrapper="h2" variants={['heading']}>{metadata.main.name}</UiText>

        <UiLayout align="start" type="sides">
          <div className={b('content')}>
            <UiText type="h3" wrapper="h3" variants={['underline']}>Description</UiText>
            <UiDivider />
            <p>{metadata.additionalInformation!.description?.replaceAll("-", "\n-")
              .split('\n').map((_, i) => (<UiText key={i} block>{_}</UiText>))}</p>
            <UiDivider type="l" />
            <UiButton cover style={{ padding: '0', width: '235px', background: "#2E405A", textTransform: "none" }}
              onClick={openSample}>
              <img src="/assets/logos/filecoin_grey.svg" />&nbsp;&nbsp;Download Sample Data
            </UiButton>
            <UiDivider type='s' />
            <UiText type="h3" wrapper="h3" variants={['underline']} className={b('provenance-title')}>Provenance</UiText>
            {provenance
              .slice(startEndPage().start, startEndPage().end)
              .map(p => (
                <div key={p.id}>
                  <UiText type="h4" wrapper="h4">{p.date.toLocaleDateString("en-US", dateOptions)}</UiText>
                  <UiLayout direction='row' className={b('provenance-entry')}>
                    <UiLayout direction='row' className={b('provenance-entry-data', ['left'])}>
                      <UiLayout className={b('provenance-entry-data-ellipse')}>
                        <Image width='26' height='26' alt='ellipse' src='/assets/ellipse.svg' />
                      </UiLayout>
                      <UiLayout direction='column'>
                        <UiText type='p'>{p.action}</UiText>
                        <UiText type='small'>{p.date.toLocaleTimeString("en-US", timeOptions)}</UiText>
                      </UiLayout>
                    </UiLayout>
                    <UiLayout direction='row' className={b('provenance-entry-data', ['left'])}>
                      <UiLayout className={b('provenance-entry-data-ellipse')}>
                        <Image width='26' height='26' alt='ellipse' src='/assets/ellipse.svg' />
                      </UiLayout>
                      <UiLayout direction='column'>
                        <UiText type='p'>By</UiText>
                        <UiText type='small'>{p.account.slice(0, 10)}...{p.account.slice(-4)}</UiText>
                      </UiLayout>
                    </UiLayout>
                    <UiLayout direction='row' className={b('provenance-entry-data', ['right'])}>
                      <UiLayout direction='column'>
                        <UiText type='p'>Price</UiText>
                        <UiText type='small'>{p.price} {p.currency}</UiText>
                      </UiLayout>
                    </UiLayout>
                  </UiLayout>
                </div>
              ))}

            {
              totalPages > 1 &&
              <XuiPagination totalPages={totalPages} page={page} setPage={setPage} />
            }

            <UiDivider type="s" />
            {/*<UiText type="h3" wrapper="h3" variants={['underline']}>Provenance</UiText>*/}
            <UiDivider />
            <UiText type="h3" wrapper="h3" variants={['underline']}>Command Line Interface</UiText>
            <UiDivider />
            <UiText type="p" >To download this dataset directly from the CLI run the following command</UiText>
            <Markdown code={`$ ncli assets get ${asset.id}`} />
          </div>
          <UiDivider vertical />
          <div>
            <UiText block className={b('side-box')}>
              <UiText className={b('attr')} type="caps" >Author:</UiText> {metadata.main.author}
              <br />
              <UiText className={b('attr')} type="caps">Date:</UiText> {toDate(metadata.main.dateCreated)}
            </UiText>

            <UiDivider />

            <UiLayout>
              <UiIcon color="secondary" icon="file" size="xl" />
              <UiDivider vertical type="s" />
              <UiText block>
                <UiText className={b('attr')} type="caps" variants={['bold']}>Price:</UiText> <XuiTokenPrice>{metadata.main.price}</XuiTokenPrice> <XuiTokenName address={getDdoTokenAddress(asset)} />
                <br />
                <UiText className={b('attr')} type="caps" variants={['bold']}>Files:</UiText> {metadata.main.files?.length}
                <br />
                <UiText className={b('attr')} type="caps" variants={['bold']}>Size:</UiText> {metadata.main.files?.map(item => Number(item.contentLength)).reduce((acc, el) => acc + el) + " bytes"}
                <br />
                <UiText className={b('attr')} type="caps" variants={['bold']}>Type:</UiText> {metadata.main.files?.map(item => item.contentType).reduce((acc, el) => { return acc.includes(el) ? acc : acc.concat(` ${el}`) })}
              </UiText>
              <UiDivider flex />
            </UiLayout>

            <UiDivider />

            {ownAsset ?
              <UiText className={b('already-purchased')}>
                You already purchased this dataset, <span className={b('already-purchased-link')}><Link href='/profile'>see in your bundle</Link></span>
              </UiText> :
              <UiButton cover onClick={(e: any) => {
                if (!isConnected) {
                  loginMetamask()
                  return
                }
                openPopup(e)
                addtoCart()
              }}>{isConnected ? 'Purchase' : 'Connect Wallet'}</UiButton>}
          </div>
        </UiLayout>
      </UiLayout>
    </>
  )
}
