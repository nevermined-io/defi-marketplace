import React, { useContext } from "react"
import Router from 'next/router'
import { BEM, UiButton, UiDivider, UiText } from "ui"
import Image from "next/image"
import styles from './banner.module.scss'
import { XuiSearchBar } from "ui/+assets-query/search-bar"
import { User } from "src/context"
import { UiLayout } from "ui/layout/layout"

const b = BEM('banner', styles)

interface BannerProps {
  showButton: boolean
}

export function UiBanner(props: BannerProps) {
  const { searchInputText, fromDate, toDate, selectedCategories } = useContext(User)

  const redirectToList = () => {
    Router.push('/list')
  }

  const onSearch = () => {
    Router.push({
      pathname: '/list',
      query: {
        searchInputText,
        fromDate,
        toDate,
        selectedCategories
      },
    })
  }

  return (
    <div className={b('bannerContainer')}>
      <Image src="/assets/nevermined-color.svg" width="115" height="70" />
      <UiText className={b('bannerText', ["padding"])} wrapper="h1" type="h1">
        Discover, Distribute &<br />
        {' '}
        Download
        <UiText clear={['text-transform']} > DeFi  </UiText>
        Data
      </UiText>
      <UiDivider type="s" />
      {
        props.showButton ?
          <div>
            <UiText className={b('bannerText')} variants={["heading", "secondary"]} wrapper="h3" type="h3">
              Say Goodbye to Unstructured Data
            </UiText>
            <UiLayout type="container"  >
              <XuiSearchBar onSearch={onSearch}/>
            </UiLayout>
            <UiDivider type="l" />
            <UiButton onClick={onSearch}>
              GO TO MARKETPLACE
            </UiButton>
            <UiDivider type="xxl" />
          </div> :

          <UiDivider type="l" />
      }
    </div>
  )
}
