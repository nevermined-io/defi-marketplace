import { BEM, UiText, UiLayout } from '@nevermined-io/styles'
import { UserSubscription } from '../../shared/constants'
import { SUBSCRIPTION_DURATION_IN_SEGS } from '../../config'
import React, { useEffect, useState, useCallback } from 'react'
import styles from './subscriptions.module.scss'
import PriceIcon from '../../../public/assets/purchase-icon.svg'
import { SubscriptionBadge } from '../subscription-badge/subscription-badge'
import { User } from '../../context'

interface SubscriptionsProps {
  purchaseDate: Date | undefined
  currentSubscription: UserSubscription | undefined
}

type SubscriptionTierItem = {
  name: string
  price: string
  symbol: string
  description: string
  featureColumns: string[][]
  purchaseDate: Date
  endOfSubscription: Date
  isActive: boolean
}

const b = BEM('subscriptions', styles)

export function Subscriptions({ purchaseDate, currentSubscription }: SubscriptionsProps) {
  const { tiers } = React.useContext(User)
  const [subscriptionTiers, setSubscriptionTiers] = useState<SubscriptionTierItem[]>()

  useEffect(() => {
    if (currentSubscription && purchaseDate) {
      const endSubscription = new Date(purchaseDate)
      endSubscription.setSeconds(endSubscription.getSeconds() + SUBSCRIPTION_DURATION_IN_SEGS)

      if (!subscriptionTiers?.length) {
        const tier = tiers.find((item) => item.name === currentSubscription.tier)

        if (tier) {
          const delta = tier.features.length / 2
          const itemsPerChunk = Math.ceil(delta)

          setSubscriptionTiers([
            {
              name: tier.name,
              price: tier.price,
              symbol: tier.symbol,
              description: tier.features[0],
              featureColumns: [
                tier.features.slice(0, itemsPerChunk),
                tier.features.slice(itemsPerChunk, tier.features.length)
              ],
              endOfSubscription: endSubscription,
              purchaseDate,
              isActive: false
            },
            {
              name: 'Analyst',
              price: tier.price,
              symbol: tier.symbol,
              description: tier.features[0],
              featureColumns: [
                tier.features.slice(0, itemsPerChunk),
                tier.features.slice(itemsPerChunk, tier.features.length)
              ],
              endOfSubscription: endSubscription,
              purchaseDate,
              isActive: false
            }
          ])
        }
      }
    }
  }, [currentSubscription, subscriptionTiers, purchaseDate])

  const handleViewDetailsClick = useCallback(
    (tierIndex: number) => () => {
      setSubscriptionTiers((prev) => {
        return prev?.map((item, index) => ({
          ...item,
          isActive: tierIndex === index ? !item.isActive : item.isActive
        }))
      })
    },
    []
  )

  return (
    <div className={b()}>
      <UiLayout type="container">
        <UiLayout type="container">
          <UiText wrapper="h1" type="h3" variants={['heading']}>
            Your Subscription
          </UiText>
        </UiLayout>
        <UiLayout type="container">
          {currentSubscription && purchaseDate ? (
            <table className={b('table')}>
              <thead>
                <tr>
                  {/* Subscription Type */}
                  <th className={b('table-column', ['type'])}>
                    <UiText type="caps" className={b('asset', ['indexer'])} variants={['detail']}>
                      subscription type
                    </UiText>
                  </th>
                  {/* Date Start */}
                  <th className={b('table-column')}>
                    <UiText
                      type="caps"
                      className={b('info', ['info-header'])}
                      variants={['detail']}
                    >
                      date start
                    </UiText>
                  </th>
                  {/* Date Valid */}
                  <th className={b('table-column')}>
                    <UiText
                      type="caps"
                      className={b('info', ['info-header'])}
                      variants={['detail']}
                    >
                      date valid
                    </UiText>
                  </th>
                  {/* Price */}
                  <th className={b('table-column')}>
                    <UiText type="caps" className={b('info', ['price'])} variants={['detail']}>
                      price
                    </UiText>
                  </th>
                  {/* Details */}
                  <th className={b('table-column', ['details'])} />
                </tr>
              </thead>
              <tbody>
                {subscriptionTiers
                  ? subscriptionTiers.map((tier, tierIndex) => (
                      <React.Fragment key={tier.name}>
                        <tr className={b('table-row', ['data'])}>
                          <td className={b('table-column', ['type'])}>
                            <SubscriptionBadge
                              className={b('subscription-badge')}
                              tier={tier.name.toLowerCase()}
                            />
                          </td>
                          <td className={b('table-column')}>
                            <UiText>{tier.purchaseDate.toLocaleDateString()}</UiText>
                          </td>
                          <td className={b('table-column')}>
                            <UiText>{tier.endOfSubscription.toLocaleDateString()}</UiText>
                          </td>
                          <td className={b('table-column')}>
                            <PriceIcon className={b('price', ['icon'])} />
                            <UiText>{tier.price}</UiText>
                          </td>
                          <td className={b('table-column', ['details'])}>
                            <UiText
                              className={b('view-details', ['container'])}
                              onClick={handleViewDetailsClick(tierIndex)}
                            >
                              <span className={b('view-details', ['text'])}>View Details</span>
                              <span className={b('view-details', ['sign'])}>
                                {tier?.isActive ? '-' : '+'}
                              </span>
                            </UiText>
                          </td>
                        </tr>
                        <tr className={b('table-row', ['details', tier?.isActive ? 'active' : ''])}>
                          <td>
                            <UiText>{tier.description}</UiText>
                          </td>
                          <td colSpan={5}>
                            <div className={b('features-row')}>
                              {tier.featureColumns.map((featureColumn, featureColumnIndex) => (
                                <div
                                  key={`feature-column-${featureColumnIndex}`}
                                  className={b('features-column')}
                                >
                                  <ul className={b('features-list')}>
                                    {featureColumn.map((feature, featureIndex) => (
                                      <li key={`feature-${featureIndex}`}>
                                        <img
                                          className={b('tick')}
                                          src="/assets/subscription-tick.svg"
                                          alt=""
                                        />
                                        <span className={b('feat-detail')}>{feature}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))
                  : null}
              </tbody>
            </table>
          ) : (
            <UiText>No Subscription</UiText>
          )}
        </UiLayout>
      </UiLayout>
    </div>
  )
}
