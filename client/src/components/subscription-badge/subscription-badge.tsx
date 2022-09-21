import React from 'react'
import { BEM, extendClassName } from '@nevermined-io/styles'
import LogoIcon from '../../../public/assets/nevermined.svg'
import styles from './subscription-badge.module.scss'

type IProps = {
  className?: string
  tier: 'community' | 'analyst' | 'enterprise' | string
  inactive?: boolean
}

const b = BEM('subscription-badge', styles)

export const SubscriptionBadge: React.FC<IProps> = ({ className, tier, inactive }) => (
  <div className={extendClassName({ className }, b([inactive ? 'inactive' : tier]))}>
    <LogoIcon className={b('logo')} />
    {tier?.toString()}
  </div>
)
