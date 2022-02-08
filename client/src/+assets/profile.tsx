import React, { useEffect, useContext, useState } from 'react'
import type { NextPage } from 'next'
import Image from "next/image"

import { User } from '../context'
import styles from './profile.module.scss'
import { BEM, UiText, UiLayout, UiIcon, UiDivider, XuiBuyAsset } from 'ui'
import { getAllUserBundlers, Bundle } from 'src/shared'
const mockAssetArray = [
  {
    "bundleId": "86c1a668-6be9-481d-aa13-dd03f8e72e66",
    "did": "did:nv:cbc927fc5fb19993c3ad018f3f1001ebc4a0d955a9bac07ede8da22b632eab6e",
    "status": "COMPLETED",
    "user": "0x0277B0aD0Ba9B830797B671f77a1Fcd1bA008003",
    "updatedAt": "2022-02-01T15:43:25.000Z",
    "createdAt": "2022-02-01T15:43:14.000Z",
    "datasets": [
      {
        "datasetId": "a46a35b1-01b8-4583-8621-0f53b8fd61a0",
        "fileName": "SushiSwap-v1-DEXLIQUI-Celo_20220131_00:00.csv",
        "source": "filecoin"
      },
      {
        "datasetId": "fc42746c-20f6-4cc4-96cd-c1ada56c43ae",
        "fileName": "SushiSwap-v1-DEXLIQUI-Fantom_20220131_00:00.csv",
        "source": "filecoin"
      },
      {
        "datasetId": "fc42746c-20f6-4cc4-96cd-c1ada56c43ae",
        "fileName": "SushiSwap-v1-DEXLIQUI-Fantom_20220131_00:00.csv",
        "source": "filecoin"
      }
    ]
  },
  {
    "bundleId": "86c1a668-6be9-481d-aa13-dd03f8e72e66",
    "did": "did:nv:cbc927fc5fb19993c3ad018f3f1001ebc4a0d955a9bac07ede8da22b632eab6e",
    "status": "PROCESSING",
    "user": "0x0277B0aD0Ba9B830797B671f77a1Fcd1bA008003",
    "updatedAt": "2022-02-01T15:43:25.000Z",
    "createdAt": "2022-02-01T15:43:14.000Z",
    "datasets": [
      {
        "datasetId": "a46a35b1-01b8-4583-8621-0f53b8fd61a0",
        "fileName": "SushiSwap-v1-DEXLIQUI-Celo_20220131_00:00.csv",
        "source": "filecoin"
      },
      {
        "datasetId": "fc42746c-20f6-4cc4-96cd-c1ada56c43ae",
        "fileName": "SushiSwap-v1-DEXLIQUI-Fantom_20220131_00:00.csv",
        "source": "filecoin"
      },
      {
        "datasetId": "fc42746c-20f6-4cc4-96cd-c1ada56c43ae",
        "fileName": "SushiSwap-v1-DEXLIQUI-Fantom_20220131_00:00.csv",
        "source": "filecoin"
      },
      {
        "datasetId": "fc42746c-20f6-4cc4-96cd-c1ada56c43ae",
        "fileName": "SushiSwap-v1-DEXLIQUI-Fantom_20220131_00:00.csv",
        "source": "filecoin"
      }
    ]
  },
  {
    "bundleId": "86c1a668-6be9-481d-aa13-dd03f8e72e66",
    "did": "did:nv:cbc927fc5fb19993c3ad018f3f1001ebc4a0d955a9bac07ede8da22b632eab6e",
    "status": "COMPLETED",
    "user": "0x0277B0aD0Ba9B830797B671f77a1Fcd1bA008003",
    "updatedAt": "2022-02-01T15:43:25.000Z",
    "createdAt": "2022-02-01T15:43:14.000Z",
    "datasets": [
      {
        "datasetId": "a46a35b1-01b8-4583-8621-0f53b8fd61a0",
        "fileName": "SushiSwap-v1-DEXLIQUI-Celo_20220131_00:00.csv",
        "source": "filecoin"
      }
    ]
  },
  {
    "bundleId": "86c1a668-6be9-481d-aa13-dd03f8e72e66",
    "did": "did:nv:cbc927fc5fb19993c3ad018f3f1001ebc4a0d955a9bac07ede8da22b632eab6e",
    "status": "PROCESSING",
    "user": "0x0277B0aD0Ba9B830797B671f77a1Fcd1bA008003",
    "updatedAt": "2022-02-01T15:43:25.000Z",
    "createdAt": "2022-02-01T15:43:14.000Z",
    "datasets": [
      {
        "datasetId": "a46a35b1-01b8-4583-8621-0f53b8fd61a0",
        "fileName": "SushiSwap-v1-DEXLIQUI-Celo_20220131_00:00.csv",
        "source": "filecoin"
      },
      {
        "datasetId": "a46a35b1-01b8-4583-8621-0f53b8fd61a0",
        "fileName": "SushiSwap-v1-DEXLIQUI-Celo_20220131_00:00.csv",
        "source": "filecoin"
      },
      {
        "datasetId": "fc42746c-20f6-4cc4-96cd-c1ada56c43ae",
        "fileName": "SushiSwap-v1-DEXLIQUI-Fantom_20220131_00:00.csv",
        "source": "filecoin"
      },
      {
        "datasetId": "fc42746c-20f6-4cc4-96cd-c1ada56c43ae",
        "fileName": "SushiSwap-v1-DEXLIQUI-Fantom_20220131_00:00.csv",
        "source": "filecoin"
      },
      {
        "datasetId": "fc42746c-20f6-4cc4-96cd-c1ada56c43ae",
        "fileName": "SushiSwap-v1-DEXLIQUI-Fantom_20220131_00:00.csv",
        "source": "filecoin"
      }
    ]
  }
]
enum assetStatus {
  COMPLETED = "COMPLETED",
  PROCESSING = "PROCESSING"
}
const b = BEM('profile', styles)
export const Profile: NextPage = () => {
  const { sdk, account } = useContext(User)

  const [assets, setAssets] = useState<Bundle[]>([])

  // const [all, setAll] = useState<boolean>(false) TBI
  const [completed, setCompleted] = useState<boolean>(false)
  const [processing, setProcessing] = useState<boolean>(false)
  // const [sold, setSold] = useState<boolean>(false) TBI


  useEffect(() => {
    if (!sdk.accounts) {
      return
    }
    loadBundles()
  }, [sdk.accounts])

  const loadBundles = async () => {
    const account = (await sdk.accounts.list())[0]
    const userBundles = await getAllUserBundlers(account.getId())
    console.log("userBundles", userBundles)
    // setAssets(userBundles)
    setAssets(mockAssetArray)
  }


  return (
    <>
      <UiLayout type="container">

        <UiLayout type="container">
          <UiText wrapper="h1" type="h1" variants={['heading']}>Profile</UiText>
          <UiText type="h2" wrapper="h2"> {`${account.substr(0, 6)}...${account.substr(-4)}`}</UiText>
        </UiLayout>
        <UiDivider type="l" />

        <UiLayout type="container" className={b("button-container")}>
          <div className={b("all-button-container")}>
            {/* <div className={all ? b("all-button", ['selected']) :  b("all-button") }
            onClick={() => all ? setAll(false) : setAll(true)}
            >
              all
            </div> */}
            <div className={b("button-container-second")}>
              <div className={completed ? b("other-button", ['selected']) : b("other-button")}
                onClick={() => completed ? setCompleted(false) : setCompleted(true)}
              >
                Completed
              </div>
              <div className={processing ? b("other-button", ['selected']) : b("other-button")}
                onClick={() => processing ? setProcessing(false) : setProcessing(true)}
              >
                Processing
              </div>
              {
                (completed || processing) &&
                <div onClick={() => { setCompleted(false); setProcessing(false) }} className={b('clear-div')} >
                  <span className={b('clear-div', ['clear-button'])} >
                    Clear
                  </span>
                  <span className={b('clear-div')} >
                    <Image width="10" height="10" src="/assets/blue-cross.svg" />
                  </span>
                </div>

              }
            </div>
          </div>
          {
            assets.find((item: any) => item.status === assetStatus.PROCESSING) &&
            <span className={b("loadspinner")} >
              <UiText type="small" wrapper="small" variants={['highlight']} className={b("loadspinner", ["text"])}>Checkout packaging in progress...</UiText>
              <Image width="50" height="50" src="/assets/profile-loadspinner.svg" className={b("loadspinner", ["spinner"])} />
            </span>
          }
        </UiLayout>

        <UiDivider />

        <UiLayout type="container">
          <UiLayout className={b('asset', ['header-asset-row'])}>
            <UiText type="caps" className={b('asset-header', ['bundle-header'])} variants={['detail']}>
              Bundle
            </UiText>
            <UiText type="caps" className={b('asset-header')} variants={['detail']}>
              Creation Date
            </UiText>
            <UiText type="caps" className={b('asset-header')} variants={['detail']}>
              Number of datasets
            </UiText>
            <UiText type="caps" className={b('asset-header')} variants={['detail']}>
              Status
            </UiText>
          </UiLayout>
          <UiDivider />

          {
            assets
              .filter((asset: any) => completed ? asset.status === assetStatus.COMPLETED : true)
              .filter((asset: any) => processing ? asset.status === assetStatus.PROCESSING : true)
              .map((asset: Bundle, index: number) => (
                <UiLayout key={asset.did} className={b('asset')}>
                  <UiText className={b('asset-date')} type="p" variants={['highlight']}>
                    {`Order #${index}`}
                  </UiText>
                  <UiDivider flex />
                  <UiText className={b('asset-date')} type="small" variants={['secondary']}>
                    {new Date(asset.createdAt).toDateString()}
                  </UiText>
                  <UiDivider flex />
                  <UiText className={b('asset-date')} type="small" variants={['secondary']}>
                    {asset.datasets.length}
                  </UiText>
                  <UiDivider flex />
                  <UiText className={b('asset-date')} type="small" variants={['secondary']}>
                    {asset.status}
                  </UiText>
                  <UiDivider flex />
                  {/* <UiDivider flex /> */}
                  <hr size="40" style={{ border: '1px solid #2B465C', marginRight: '16px' }} />
                  <XuiBuyAsset asset={asset.did}>
                    <img width="24px" src="assets/basket_icon.svg" style={{ cursor: 'pointer' }} />
                  </XuiBuyAsset>
                </UiLayout>
              ))}
        </UiLayout>
      </UiLayout>
    </>
  )
}
