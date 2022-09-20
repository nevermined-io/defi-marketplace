import { BEM, UiText, UiLayout } from '@nevermined-io/styles'
import { UserSubscription } from '../../shared/constants'
import { SUBSCRIPTION_DURATION_IN_SEGS } from '../../config'
import React, { useEffect, useState, useCallback } from 'react'
import styles from './subscriptions.module.scss'
import PriceIcon from '../../../public/assets/purchase-icon.svg'
import { SubscriptionBadge } from '../subscription-badge/subscription-badge'

interface SubscriptionsProps {
  purchaseDate: Date | undefined
  currentSubscription: UserSubscription | undefined
}

const b = BEM('subscriptions', styles)

export function Subscriptions({ purchaseDate, currentSubscription }: SubscriptionsProps) {
  const [detailsRows, setDetailsRows] = useState<Record<number, { isActive: boolean }>>({})
  const [endOfSubscription, seteEndOfSubscription] = useState<Date>()

  const calculateEndSubscription = () => {
    if (currentSubscription && purchaseDate) {
      const endSubscription = new Date(purchaseDate)
      endSubscription.setSeconds(endSubscription.getSeconds() + SUBSCRIPTION_DURATION_IN_SEGS)
      seteEndOfSubscription(endSubscription)
    }
  }

  useEffect(() => {
    calculateEndSubscription()
  }, [])

  const handleViewDetailsClick = useCallback(
    (tierIndex: number) => () => {
      setDetailsRows((prev) => ({
        ...prev,
        [tierIndex]: {
          isActive: !prev[tierIndex]?.isActive
        }
      }))
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
                <tr className={b('table-row', ['data'])}>
                  <td className={b('table-column', ['type'])}>
                    <SubscriptionBadge
                      className={b('subscription-badge')}
                      tier={currentSubscription.tier?.toLowerCase()}
                    />
                  </td>
                  <td className={b('table-column')}>
                    <UiText>{purchaseDate?.toLocaleDateString()}</UiText>
                  </td>
                  <td className={b('table-column')}>
                    <UiText>{endOfSubscription?.toLocaleDateString()}</UiText>
                  </td>
                  <td className={b('table-column')}>
                    <PriceIcon className={b('price', ['icon'])} />
                    <UiText>0</UiText>
                  </td>
                  <td className={b('table-column', ['details'])}>
                    <UiText
                      className={b('view-details', ['container'])}
                      onClick={handleViewDetailsClick(0)}
                    >
                      <span className={b('view-details', ['text'])}>View Details</span>
                      <span className={b('view-details', ['sign'])}>
                        {detailsRows[0]?.isActive ? '-' : '+'}
                      </span>
                    </UiText>
                  </td>
                </tr>
                <tr
                  className={b('table-row', ['details', detailsRows[0]?.isActive ? 'active' : ''])}
                >
                  <td>
                    <UiText>On-chain normalised data from different protocols and networks</UiText>
                  </td>
                  <td colSpan={5}>
                    <div className={b('features-row')}>
                      <div className={b('features-column')}>
                        <ul className={b('features-list')}>
                          <li>
                            <img className={b('tick')} src="/assets/subscription-tick.svg" alt="" />
                            <span className={b('feat-detail')}>
                              On-chain normalized data from different protocols and networks
                            </span>
                          </li>
                          <li>
                            <img className={b('tick')} src="/assets/subscription-tick.svg" alt="" />
                            <span className={b('feat-detail')}>Insights dashboards</span>
                          </li>
                          <li>
                            <img className={b('tick')} src="/assets/subscription-tick.svg" alt="" />
                            <span className={b('feat-detail')}>
                              Integration of basic data with Google Data Studio
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div className={b('features-column')}>
                        <ul className={b('features-list')}>
                          <li>
                            <img className={b('tick')} src="/assets/subscription-tick.svg" alt="" />
                            <span className={b('feat-detail')}>
                              Publish reports and notebooks/algorithms without monetization free for
                              the community
                            </span>
                          </li>
                          <li>
                            <img className={b('tick')} src="/assets/subscription-tick.svg" alt="" />
                            <span className={b('feat-detail')}>Access to community reports</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </td>
                </tr>
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
