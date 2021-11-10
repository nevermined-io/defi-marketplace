import React, { useEffect, useContext, useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { DDO } from '@nevermined-io/nevermined-sdk-js'
import styles from './details.module.scss'

import { BEM, UiText, UiIcon, UiLayout, UiDivider, XuiTokenName, XuiTokenPrice, XuiBuyAsset, UiButton } from 'ui'
import { User } from '../context'
import { toDate } from '../shared'

const b = BEM('details', styles)

export const AssetDetails: NextPage = () => {
  const {query: {did}} = useRouter()
  const [asset, setAsset] = useState<DDO | false>()
  const {sdk, account} = useContext(User)

  useEffect(() => {
    if (!sdk.assets) {
      return
    }
    sdk.assets.resolve(String(did))
      .then(ddo => setAsset(ddo))
      .catch(() => setAsset(false))
  }, [sdk])

  if (!asset) {
    return (
      <UiLayout type="container">
        <UiText alert>{asset === false ? 'Error loading the asset' : 'Loading...'}</UiText>
      </UiLayout>
    )
  }

  const metadata = asset.findServiceByType('metadata').attributes
  
  const secondWord = "Type" 
  const formatCategories = (firstWord: string, word:string) => {
    switch(firstWord){
      case "Event":
        return "Event Type";
      case "Protocol":
        return "Protocol Type";
      default:
        return word
    }
  }
  return (
    <>
      <UiLayout type="container">
        <UiText wrapper="h1" type="h1" variants={['heading']}>Details</UiText>
        <UiText type="h2" wrapper="h2" variants={['heading']}>{metadata.main.name}</UiText>

        <UiLayout align="start" type="sides">
          <div className={b('content')}>
            <UiText type="h3" wrapper="h3" variants={['underline']}>Description</UiText>

            <UiDivider/>
            <p>{metadata.additionalInformation!.description}</p>
            <UiDivider type="l"/>
            {
              metadata.additionalInformation!.categories?.filter(item=> item.substring(0, item.indexOf(":")+1).localeCompare("UserCase:",  undefined, { sensitivity: 'accent' })  && item.substring(0, item.indexOf(":")+1).localeCompare("Version:",  undefined, { sensitivity: 'accent' }) )
              .map(item=> {
                return  <div>
                  <UiText className={b('content')} block={false} type="caps" variants={['secondary']} > {formatCategories(item.substring(0, item.indexOf(secondWord)), item.substring(0, item.indexOf(":")))}: </UiText> {item.substring(item.indexOf(":")+1)}
                  <UiDivider  type="s"/>
                  </div>
              })
            }
            <UiDivider type="s"/>
            {/*<UiText type="h3" wrapper="h3" variants={['underline']}>Provenance</UiText>*/}
          </div>
          <UiDivider vertical/>
          <div>
            <UiText block className={b('side-box')}>
              <UiText className={b('attr')} type="caps" >Author:</UiText> {metadata.main.author}
              <br/>
              <UiText className={b('attr')} type="caps">Date:</UiText> {toDate(metadata.main.dateCreated)}
            </UiText>

            <UiDivider/>

            <UiLayout>
              <UiIcon color="secondary" icon="file" size="xl"/>
              <UiDivider vertical type="s"/>
              <UiText block>
                <UiText className={b('attr')} type="caps" variants={['bold']}>Price:</UiText> <XuiTokenPrice>{metadata.main.price}</XuiTokenPrice> <XuiTokenName/>
                <br/>
                <UiText className={b('attr')} type="caps" variants={['bold']}>Files:</UiText> {metadata.main.files?.length}
                <br/>
                <UiText className={b('attr')} type="caps" variants={['bold']}>Size:</UiText> {metadata.main.files?.map(item=> Number(item.contentLength)).reduce((acc,el)=> acc+el) + " bytes"} 
                <br/>
                <UiText className={b('attr')} type="caps" variants={['bold']}>Type:</UiText> {metadata.main.files?.map(item=> item.contentType).reduce((acc,el)=> {return acc.includes(el) ? acc:acc.concat(` ${el}`)})} 
              </UiText>
              <UiDivider flex/>
            </UiLayout>

            <UiDivider/>

            <XuiBuyAsset search asset={asset}>
              <UiButton cover>Download</UiButton>
            </XuiBuyAsset>
          </div>
        </UiLayout>

      </UiLayout>
    </>
  )
}
