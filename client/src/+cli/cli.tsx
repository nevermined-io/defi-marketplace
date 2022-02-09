import type { NextPage } from 'next'
import React, { useState } from 'react'
import Link from "next/link"
import { UiText, UiDivider, UiLayout, BEM } from 'ui'
import { Markdown } from 'ui/markdown/markdown'
import styles from './cli.module.scss'

const whatIs = `
The Nevermined CLI tool enables to connect directly to the Nevermined Data Ecosystem and interact with it using the command-line interface.  With this, you can directly search, purchase and download datasets without having to deal with the Marketplace web interface.
`.trim()

const installation = `
The Nevermined CLI is an npm package so you can install it using your prefer package manager by running the following commands
`.trim()

const setupAccounts = `
To interact with the network first, you need to set up the account to use. There are two different options to set up the accounts:

Use a mnemonic
`.trim()


const howWorks = `
DeFi Data Marketplace uses three different protocols to retrieve, store and publish data.

All the data came directly from The Graph protocol, which indexes data from several blockchains. This data is retrieved using our library and normalized in a CSV file. To maintain a decentralized way to store this data, this dataset is uploaded to Filecoin where the file will be stored in a decentralized network. Once the dataset is published in Filecoin, we use the link to this file to publish it in the Nevermined protocol. Nevermined allows us to create a marketplace for data, with all this data published in the Filecoin network, we can use Nevermined to put these datasets available to download for the users using a web interface or a command-line interface.

This diagram describes the process to create and publish datasets. `.trim()

const b = BEM('cli', styles)
export const Cli: NextPage = () => {
  const [view, setView] = useState<number>(1)

  const renderContent = () => {

    if (view == 1) {
      return (
        <>
          <UiLayout>
            <UiText type="h4" wrapper="h4" variants={['underline']}>What is the Nevermined CLI?​</UiText>
          </UiLayout>
          <UiDivider />
          {whatIs.split('\n').map((_, i) => (<UiText key={i} type="p" block>{_}</UiText>))}
          <UiDivider type="xl" />
          <UiLayout>
            <UiText type="h4" wrapper="h4" variants={['underline']}>Installation</UiText>
          </UiLayout>
          <UiDivider />
          {installation.split('\n').map((_, i) => (<UiText key={i} type="p" block>{_}</UiText>))}
          <Markdown code={<>
            <p>$ npm install -g @nevermined-io/cli</p>
            <p>or</p>
            <p>$ yarn global add @nevermined-io/cli</p>
          </>} height="200px"></Markdown>
          <UiText>After doing that you should have available in your system the ncli tool.</UiText>
          <Markdown code="$ ncli --help" height="111px"></Markdown>
          <UiDivider type="xl" />
        </>
      )

    } else if (view == 2) {
      return (
        <>
          <UiLayout>
            <UiDivider type="xl" />
            <UiText type="h4" wrapper="h4" variants={['underline']}>Setup Accounts</UiText>
          </UiLayout>
          <UiDivider />
          {setupAccounts.split('\n').map((_, i) => (<UiText key={i} type="p" block>{_}</UiText>))}
          <Markdown code='$ export MNEMONIC="<your 12 words seed phrase>"' height="111px"></Markdown>
          <UiText>Use keyfiles</UiText>
          <Markdown code={<>
            <p>{'$ export KEYFILE_PATH="<path to keyfile>"'}</p>
            <p>{'$ export KEYFILE_PASSWORD="<keyfile password>"'}</p>
          </>} height="150px"></Markdown>
          <UiText>Also the RPC provider should be set</UiText>
          <Markdown code={<>
            <p>{'export NODE_URL="https://rinkeby.infura.io/v3/INFURA_TOKEN"'}</p>
            <p>or</p>
            <p>{'export NODE_URL="https://eth-rinkeby.alchemyapi.io/v2/-ALCHEMY_TOKEN"'}</p>
          </>} height="200px"></Markdown>
        </>
      )
    } else if (view == 3) {
      return (
        <>
          <UiLayout>
            <UiText type="h4" wrapper="h4" variants={['underline']}>Networks</UiText>
          </UiLayout>
          <UiText>Nevermined protocol is deployed in several networks, in order to select the correct one, they can be listed with</UiText>
          <Markdown code='$ ncli network list' height="111px"></Markdown>
          <UiText>That will return the list of the networks</UiText>
          <Markdown code={
            <>
              <p> defiMumbai:<br />
                Gateway: https://gateway.mumbai.nevermined.rocks<br />
                Metadata API: https://metadata.mumbai.nevermined.rocks<br />
                Faucet: https://faucet.mumbai.nevermined.rocks</p>
              <br />
              <p> defiMatic:<br />
                Gateway: https://gateway.matic.nevermined.rocks<br />
                Metadata API: https://metadata.matic.nevermined.rocks</p>
            </>
          } height="310px"></Markdown>

        </>
      )
    } else if (view == 4) {
      return (
        <>
          <UiLayout>
            <UiText type="h4" wrapper="h4" variants={['underline']}>Download assets</UiText>
          </UiLayout>
          <UiText>To download an asset first we need to know the asset identifier, to do so, we can searh for assets with</UiText>
          <Markdown code='$ncli assets search Aave -n defiMatic' height="111px"></Markdown>
          <UiText>That will return the list of assets that includes the term "Aave" in the asset name</UiText>
          <Markdown code={
            <>
              <p>dataset Name: Aave-v2-Ethereum_20210807_00:00.csv - Url: did:nv:c29c3d18d056579203be988e51603288229dfa84b547a29055b98163cbf622d1<br />
                dataset Name: Aave-v2-Ethereum_20210808_00:00.csv - Url: did:nv:11d5c64740797b6ceaaea311c8e33fdeefb502301bec56831c2f5808a6a5cfe0<br />
                dataset Name: Aave-v2-Ethereum_20210804_00:00.csv - Url: did:nv:b28c53b3268853f25ea53f145c2c45b7fed2eb04ebf6fd301274cca1914907fb<br />
                dataset Name: Aave-v2-Ethereum_20210802_00:00.csv - Url: did:nv:e958a092bb50c65047a28f6f26c7e46d7470c78e96d24b7ee66cf7efaf4d589d</p>
            </>
          } height="310px"></Markdown>
          <UiText>Now we can download the dataset, for that we need first to create and order with the identifier we're interested in</UiText>
          <Markdown code={"$ ncli assets order did:nv:e958a092bb50c65047a28f6f26c7e46d7470c78e96d24b7ee66cf7efaf4d589d"} height="110px"></Markdown>
          <UiText>Once the order is created, we can download the asset with</UiText>
          <Markdown code={"$ ncli assets get did:nv:e958a092bb50c65047a28f6f26c7e46d7470c78e96d24b7ee66cf7efaf4d589d"} height="110px"></Markdown>
        </>
      )
    }
  }

  return (
    <>
      <UiLayout type="container">
        <UiText wrapper="h1" type="h1" variants={['heading']}>Command Line Interface</UiText>
        <div className={b('row')}>
          <div className={b('columnleft')}>
            <UiText className="pointer" type="link-caps" variants={['detail']} onClick={() => setView(1)}>Installation</UiText>
            <UiDivider />
            <UiText className="pointer" type="link-caps" variants={['detail']} onClick={() => setView(2)}>Setup Accounts</UiText>
            <UiDivider />
            <UiText className="pointer" type="link-caps" variants={['detail']} onClick={() => setView(3)}>Networks</UiText>
            <UiDivider />
            <UiText className="pointer" type="link-caps" variants={['detail']} onClick={() => setView(4)}>Download assets</UiText>
          </div>
          <div className={b('columnright')}>
            {renderContent()}
          </div>
        </div>
      </UiLayout>
    </>
  )
}
