import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Nevermined DeFi Marketplace</title>
        <meta name="description" content="Nevermined DeFi Marketplace" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Nevermined DeFi Marketplace
        </h1>
      </main>
    </div>
  )
}

export default Home
