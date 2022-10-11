import type { NextPage } from 'next'
import React from 'react'

import { UiText, UiDivider, UiLayout } from '@nevermined-io/styles'
import { Diagram } from './diagram'

const whatIs = `
DeFi Data Marketplace is the first decentralized marketplace for structured DeFI data protocols in several networks.
This marketplace allows downloading structured and normalized datasets without having to deal with all the complex tasks to retrieve data from DeFi protocols, understanding all the different ways this data can be stored on chain.
`.trim()

const whatFind = `
In this marketplace you will find analysis-ready datasets. These datasets contain different events triggered by users in DeFi protocols, organized in different categories to create easy to analyze data.

After analyzing DeFi protocols, we have identified some events that are common in these protocols and we have created a common structure to organize them.
Right now this marketplace provides data from Lending and Decentralized exchanges protocols but more types of protocols will be added, to support all the common entities that can be analyzed.
`.trim()

const howAreCreated = `
Our main goal in this marketplace is to provide data simply and transparently. We have been working for several years in data and banking projects and we know that data can’t be as transparent as needed.

To create these datasets we use this library built for us, where we use The Graph project as the underlying project to retrieve and normalize data.
This approach allows us to leverage all the retrieval processes in open source and decentralized projects and the ability to retrieve data from different blockchains and protocols, just creating a new subgraph for each source.

All the events included in each dataset contain the transaction id that originated from, so all the data can be verified using a block explorer. Our library is just doing conversions to this data to provide the same units in all the different datasets avoiding the user wasting a lot of time cleaning the data.
`.trim()

const howWorks = `
DeFi Data Marketplace uses three different protocols to retrieve, store and publish data.

All the data came directly from The Graph protocol, which indexes data from several blockchains. This data is retrieved using our library and normalized in a CSV file. To maintain a decentralized way to store this data, this dataset is uploaded to Filecoin where the file will be stored in a decentralized network. Once the dataset is published in Filecoin, we use the link to this file to publish it in the Nevermined protocol. Nevermined allows us to create a marketplace for data, with all this data published in the Filecoin network, we can use Nevermined to put these datasets available to download for the users using a web interface or a command-line interface.

This diagram describes the process to create and publish datasets. `.trim()

export const About: NextPage = () => {
  return (
    <>
      <UiLayout type="container">
        <UiText wrapper="h1" type="h1" variants={['heading']}>
          About us
        </UiText>
        <UiLayout>
          <UiText type="h4" wrapper="h4" variants={['underline']}>
            What is DeFi Data Marketplace?
          </UiText>
        </UiLayout>
        <UiDivider />
        {whatIs.split('\n').map((_, i) => (
          <UiText key={i} type="p" block>
            {_}
          </UiText>
        ))}
        <UiDivider type="xl" />
        <UiLayout>
          <UiText type="h4" wrapper="h4" variants={['underline']}>
            What can I find in the DeFi Data Marketplace?
          </UiText>
        </UiLayout>
        <UiDivider />
        {whatFind.split('\n').map((_, i) => (
          <UiText key={i} type="p" block>
            {_}
          </UiText>
        ))}
        <UiDivider type="xl" />
        <UiLayout>
          <UiText type="h4" wrapper="h4" variants={['underline']}>
            How are these datasets created? Can I verify this data?
          </UiText>
        </UiLayout>
        <UiDivider />
        {howAreCreated.split('\n').map((_, i) => (
          <UiText key={i} type="p" block>
            {_}
          </UiText>
        ))}
        <UiDivider type="xl" />
        <UiLayout>
          <UiText type="h4" wrapper="h4" variants={['underline']}>
            How it works
          </UiText>
        </UiLayout>
        <UiDivider />
        {howWorks.split('\n').map((_, i) => (
          <UiText key={i} type="p" block>
            {_}
          </UiText>
        ))}
        <UiDivider type="xl" />
        <Diagram />
        <UiDivider type="xl" />
      </UiLayout>
    </>
  )
}
