import { BEM } from '@nevermined-io/styles'
import styles from './pricing.module.scss'
const b = BEM('pricing', styles)
import React, { useState, useRef } from 'react'
import Catalog from '@nevermined-io/catalog-core'
import { DID_NFT_TIERS, NFT_TIERS_AMOUNT, NFT_TIERS_HOLDER, NFT_TIERS_TYPE } from 'src/config'
import { MetaMask } from '@nevermined-io/catalog-providers'
import { toast } from 'react-toastify';
import { UiPopupHandlers } from '@nevermined-io/styles'
import { ConfirmPopup } from '../../+assets/user-publish-steps/confirm-popup'

interface Tier {
  name: string
  price: string
  features: string[]
}
interface PricingProps {
  tiers: Tier[]
}

export function Pricing({ tiers }: PricingProps) {

  const { sdk, subscription } = Catalog.useNevermined()
  const confirmPopupMessage = 'Press Confirm to Subscribe'
  const confirmPopupRef = useRef<UiPopupHandlers>()
  const [tierName, setTierName] = useState('')

  const confirm = (tier: string) => {
    setTierName(tier)
    confirmPopupRef.current?.open()
  }

  const cancel = () => {
    confirmPopupRef.current?.close()
  }

  const purchase = async () => {
    confirmPopupRef.current?.close()
    const accounts = await sdk.accounts.list()
    const toastId = toast.info("Subscription in progress...")  
    try{ 
      const agreementID =  await subscription.buySubscription(
        DID_NFT_TIERS.find(tier => tier.name === tierName)?.did || '',
        accounts[0],
        NFT_TIERS_HOLDER,
        NFT_TIERS_AMOUNT,
        NFT_TIERS_TYPE
      )
      toast.dismiss(toastId)
      toast.success("Subscription bought correctly with agreement ID: " + agreementID)
    }catch(error)  {
      toast.dismiss(toastId)
      toast.error("There was an error buying the subscription")
      console.error("There was an error buying the subscription: " + error)
    }  

  }

  return (
    <div className={b('pricing')}>
       <ConfirmPopup
        message={confirmPopupMessage}
        popupRef={confirmPopupRef}
        confirm={purchase}
        cancel={cancel}
      />
      {tiers.map((tier) => (
        <div key={tier.name} className={b('price_card')}>
          <div className={b('header')}>
            <span className={b('price')}>{tier.price}</span>
            <span className={b('name')}>{tier.name}</span>
          </div>
          <ul className={b('features')}>
            {tier.features.map((feat, i) => (
              <li key={i}>{feat}</li>
            ))}
          </ul>
          <button className={b("add-to-cart")} onClick={() => confirm(tier.name)}>Purchase</button>
        </div>
      ))}
    </div>
  )
}
