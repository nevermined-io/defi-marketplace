import { BEM } from '@nevermined-io/styles'
import styles from './pricing.module.scss'
const b = BEM('pricing', styles)
import Catalog from '@nevermined-io/components-catalog'
import { purchaseSubscription, registerSubscription } from 'src/shared/subscription'

interface Tier {
  name: string
  price: string
  features: string[]
}
interface PricingProps {
  tiers: Tier[]
}

export function Pricing({ tiers }: PricingProps) {

  const { sdk } = Catalog.useNevermined()

  const purchase = async () => {
    const accounts = await sdk.accounts.list()

    await registerSubscription(sdk, accounts[0])

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
          <button className={b("add-to-cart")} onClick={() => purchase()}>Add to cart</button>
        </div>
      )}
    </div>
  )
}
