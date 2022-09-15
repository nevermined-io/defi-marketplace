import { BEM } from '@nevermined-io/styles'
import styles from './pricing.module.scss'
const b = BEM('pricing', styles)
import React, { useState, useRef, useContext } from 'react'
import { Catalog } from '@nevermined-io/catalog-core'
import { NFT_TIERS, NFT_TIERS_AMOUNT, NFT_TIERS_HOLDER, NFT_TIERS_TYPE } from 'src/config'
import { toast } from 'react-toastify'
import { UiPopupHandlers } from '@nevermined-io/styles'
import { ConfirmPopup } from '../../+assets/user-publish-steps/confirm-popup'
import { User } from '../../context'
import { SubscriptionTiers } from 'src/shared'

interface Tier {
  name: string
  price: string
  symbol: string
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
  const { getCurrentUserSubscription, getUserSubscriptions, setUserSubscriptions } =
    useContext(User)

  const confirm = (tier: string) => {
    if ((tier as SubscriptionTiers) === getCurrentUserSubscription()?.tier) {
      toast.warning(`You are already subscribed to  ${tier}`)
      return
    }
    setTierName(tier)
    confirmPopupRef.current?.open()
  }

  const cancel = () => {
    confirmPopupRef.current?.close()
  }

  const purchase = async () => {
    confirmPopupRef.current?.close()
    const accounts = await sdk.accounts.list()
    const toastId = toast.info('Subscription in progress...')
    try {
      const agreementID = await subscription.buySubscription(
        NFT_TIERS.find((tier) => tier.name === tierName)?.did || '',
        accounts[0],
        NFT_TIERS_HOLDER,
        NFT_TIERS_AMOUNT,
        NFT_TIERS_TYPE
      )
      toast.dismiss(toastId)
      toast.success('Subscription bought correctly with agreement ID: ' + agreementID)
      const userSubs = await getUserSubscriptions()
      setUserSubscriptions(userSubs!)
    } catch (error) {
      toast.dismiss(toastId)
      toast.error('There was an error buying the subscription')
      console.error('There was an error buying the subscription: ' + error)
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
      {tiers.map((tier, index) => (
        <div key={tier.name} className={b('price_card')}>
          <div className={b(`header-${index}`, ['header'])}>
            <div className={b('name')}>{tier.name}</div>
            <div className={b('price_col')}>
              <div className={b('price_row')}>
                <span className={b('price')}>{tier.price}</span>
                <span className={b('symbol')}>{tier.symbol}</span>
              </div>
            </div>
          </div>
          <div className={b('features')}>
            <div className={b('common-feat')}>
              On-chain normalised data from different protocols and networks
            </div>
            <ul className={b('features-list')}>
              {tier.features.map((feat, i) => (
                <li key={i}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className={b('tick')} src="/assets/subscription-tick.svg" alt="" />
                  <span className={b('feat-detail')}>{feat}</span>
                </li>
              ))}
            </ul>
            <div className={b('button')}>
              <button className={b('add-to-cart')} onClick={() => confirm(tier.name)}>
                Subscribe
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
