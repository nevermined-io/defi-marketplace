import React, { useEffect, useContext, useState, createRef } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { DDO } from '@nevermined-io/nevermined-sdk-js'
import styles from './details.module.scss'
import { AdditionalInformation } from "@nevermined-io/nevermined-sdk-js"
import { Loader } from '../components/loaders/loader';
import { BEM, UiText, UiIcon, UiLayout, UiDivider, XuiTokenName, XuiTokenPrice, UiButton, UiPopupHandlers, UiPopup } from 'ui'
import { User } from '../context'
import { toDate, getDdoTokenAddress } from '../shared'
import { Markdown } from 'ui/markdown/markdown'
import { AddedToBasketPopup } from './added-to-basket-popup'

const b = BEM('details', styles)

interface AdditionalInformationExtended extends AdditionalInformation {
  sampleUrl: string;
}

export const AssetDetails: NextPage = () => {
  const { query: { did } } = useRouter()
  const [asset, setAsset] = useState<DDO | false>()
  const [isConnected, setIsConnected] = useState(false)
  const [ownAsset, setOwnAsset] = useState(false)
  const { sdk, addToBasket, loginMetamask, isLogged, userBundles } = useContext(User)
  const popupRef = createRef<UiPopupHandlers>()

  const openPopup = (event: any) => {
    popupRef.current?.open()
    event.preventDefault()
  }

  const closePopup = (event: any) => {
    popupRef.current?.close()
    event.preventDefault()
  }

  useEffect(() => {
    if (!sdk.assets) {
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

  if (!asset) {
    return (
      <UiLayout type="container">
        {asset === false ?
          <UiText alert>Error loading the asset</UiText>
          :
          <UiLayout type="container" className={b("spinner-container")} >
            <UiText className={b("loadspinner")} >
              <Loader/>
            </UiText>
          </UiLayout>
        }
      </UiLayout>
    )
  }

  const metadata = asset.findServiceByType('metadata').attributes

  const openSample = () => {
    const addtionalInfoExtended = metadata.additionalInformation as AdditionalInformationExtended
    const url = addtionalInfoExtended.sampleUrl || ""
    const win = window.open(url, "_blank");
    win?.focus();
  }

  const addtoCart = () => {
    addToBasket([asset.id])
  }

  return (
    <>
      <AddedToBasketPopup  closePopup={closePopup} popupRef={popupRef} />

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
                if(!isConnected) {
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
