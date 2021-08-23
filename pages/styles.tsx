import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Nevermined DeFi Marketplace - Styles</title>
        <meta name="description" content="Nevermined DeFi Marketplace" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="text text--h1">H1 Heading</div>
        <div className="text text--h2">H2 Heading</div>
        <div className="text text--h3">H3 Heading</div>
        <div className="text text--h4">H4 Heading</div>
        <div className="text text--h4-caps">H4 (caps) Heading</div>

        <div className="text">Text - Adipisicing anim in aliquip nisi in ullamco fugiat incididunt quis dolore pariatur laborum.</div>
        <div className="text text--caps">Text (caps) - Adipisicing anim in aliquip nisi in ullamco fugiat incididunt quis dolore pariatur laborum.</div>
        <div className="text text--small">Small - Adipisicing anim in aliquip nisi in ullamco fugiat incididunt quis dolore pariatur laborum.</div>
        <div className="text text--small-caps">Small (caps) - Adipisicing anim in aliquip nisi in ullamco fugiat incididunt quis dolore pariatur laborum.</div>
        <div className="text text--link">Link - Adipisicing anim in aliquip nisi in ullamco fugiat incididunt quis dolore pariatur laborum.</div>
      </main>
    </div>
  )
}

export default Home
