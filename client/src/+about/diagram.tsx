import React, { Fragment } from 'react'
import type { NextPage } from 'next'
import styles from './diagram.module.scss'

import { BEM } from 'ui'
import Image from 'next/image'

const b = BEM('diagram', styles)
export const Diagram: NextPage = () =>
  <Fragment>
    <div className={b('top-text')}>Blockchain stores all the historical data of users interactions</div>
    <div className={b('row')}>
      <div className={b('networks')}>
        <img width="200" height="200" className={b('circle')} src="/assets/diagram/radial-gradient-circle.svg"/>
        <div className={b('network-logos')}>
          <Image width="32" height="37" src="/assets/logos/bsc.svg"/>
          <Image width="36" height="36" src="/assets/logos/avalanche.svg"/>
          <Image width="35" height="35" src="/assets/logos/fantom.svg"/>
          <Image width="42" height="42" src="/assets/logos/ethereum.svg"/>
        </div>
      </div>
      <img src="assets/diagram/medium-arrow.svg" />
      <div className={b('protocols')}>
        <img src="assets/logos/aave.svg" style={{ marginBottom: '32px' }} />
        <img src="assets/logos/uniswap.svg" />
      </div>
      <div className={b('left-arrows')}>
        <div className={b('borrow')}>Borrow</div>
        <div className={b('repay')}>Repay</div>
        <div className={b('swap')}>Swap</div>
        <div className={b('liquidity')}>Provide Liquidity</div>
        <img src="assets/diagram/long-arrow.svg" style={{ marginBottom: '74px' }} />
        <img src="assets/diagram/long-arrow.svg" />
      </div>
      <div className={b('dapp-users')}>
        <div className={b('dapp-user-wrapper')} style={{ margin: '0px 0 70px', top: '5px' }} >
          <img className={b('dapp-user-box')} src="assets/diagram/small-box.svg"/>
          <div className={b('big-text', ['dapp-user'])}>DAPP USER</div>
        </div>
        <div className={b('dapp-user-wrapper')} style={{ top: '-5px' }}>
          <img className={b('dapp-user-box')} src="assets/diagram/small-box.svg"/>
          <div className={b('big-text', ['dapp-user'])}>DAPP USER</div>
        </div>

      </div>
    </div>
    <div className={b('up-arrow')} >
      <img src="assets/diagram/short-arrow.svg"/>
    </div>
    <div className={b('row')}>
      <div className={b('logo-and-text')}>
        <img src="assets/logos/graph.svg" />
        <div className={b('big-text')}>THE GRAPH</div>
        <div className={b('small-text')}>The Graph stores blockchain info and exposes it using APIs</div>
      </div>
      <div className={b('left-arrow-wrapper')}>
        <img className={b('left-arrow')} src="assets/diagram/medium-arrow.svg"/>
      </div>
      <div className={b('retrieval-wrapper')}>
        <img className={b('retrieval-box')} src="assets/diagram/medium-box.svg"/>
        <div className={b('retrieval-text')}>Our library retrieves data from The Graph and normalizes it</div>
      </div>
      <div className={b('horizontal-line-wrapper')}>
        <img src="assets/diagram/line.svg" />
      </div>
      <div className={b('logo-and-text', ['python'])}>
        <img src="assets/logos/python.svg" />
        <div className={b('big-text')}>PYTHON</div>
        <div className={b('small-text', ['python'])}>This data is sorted into a CSV file and sent to Filecoin</div>
      </div>
      <img src="assets/diagram/medium-arrow.svg" />
      <div className={b('logo-and-text', ['filecoin'])}>
        <img src="assets/logos/filecoin.svg" />
        <div className={b('big-text')}>FILECOIN</div>
      </div>
    </div>
    <img className={b('vertical-line')} src="assets/diagram/line.svg" />
    <div className={b('nevermined-wrapper')}>
      <img className={b('nevermined-box')} src="assets/diagram/large-box.svg"/>
      <div className={b('nevermined-text')}>Then the link to the file is pulished in NVM and the dataset is available to download in the marketplace, doing a payment through NVM</div>
    </div>
    <img className={b('down-arrow')} src="assets/diagram/short-arrow.svg"/>
    <div className={b('logo-and-text', ['nevermined'])}>
      <img width="38" height="23" src="assets/nevermined-color.svg" />
      <div className={b('big-text')}>NEVERMINED</div>
    </div>
  </Fragment>
