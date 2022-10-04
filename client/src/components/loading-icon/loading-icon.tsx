import React from 'react'
import { BEM } from '@nevermined-io/styles'
import NeverminedAbstractIcon from '../../../public/assets/nevermined-abstract.svg'
import styles from './loading-icon.module.scss'

const b = BEM('loading-icon', styles)

const LoadingIcon: React.FC<unknown> = () => (
  <div className={b()}>
    <NeverminedAbstractIcon />
    <div className={b('circle')}>
      <div />
    </div>
  </div>
)

export default LoadingIcon
