import { BEM } from '@nevermined-io/styles'
import styles from './pricing.module.scss'
const b = BEM('pricing', styles)
import Catalog from '@nevermined-io/catalog-core'
import { DID_NFT_TIERS, NFT_TIERS_AMOUNT, NFT_TIERS_HOLDER, NFT_TIERS_TYPE } from 'src/config'


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

  const purchase = async (name: string) => {
    const accounts = await sdk.accounts.list()
    const purchase = await subscription.buySubscription(
      DID_NFT_TIERS.find(tier => tier.name === name)?.did || '',
      accounts[0],
      NFT_TIERS_HOLDER,
      NFT_TIERS_AMOUNT,
      NFT_TIERS_TYPE
    )
  }


  return (
    <div className={b("pricing")}>
      {tiers.map(tier =>
        <div key={tier.name} className={b("price_card")}>
          <div className={b("header")}>
            <span className={b("price")}>{tier.price}</span>
            <span className={b("name")}>{tier.name}</span>
          </div>
          <ul className={b("features")}>
            {tier.features.map((feat, i) =>
              <li key={i}>{feat}</li>
            )}
          </ul>
          <button className={b("add-to-cart")} onClick={() => purchase(tier.name)}>Add to cart</button>
        </div>
      )}
    </div>
  )
}
