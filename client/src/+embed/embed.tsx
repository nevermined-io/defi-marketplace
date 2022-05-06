import type { NextPage } from 'next'
import React, { useState, useEffect } from 'react'
import { getDashboardUrl } from 'src/shared'
import { embedDashboard } from 'amazon-quicksight-embedding-sdk';
import { UiText, UiDivider, UiLayout, BEM } from 'ui'

export const Embed: NextPage = () => {

  useEffect(() => {
    setDashboardUrl()
  }, [])

  const setDashboardUrl = async () => {

    try {
      const response = await getDashboardUrl()
      console.log(response.data.EmbedUrl)
      let options = {
        url: response.data.EmbedUrl,
        container: document.getElementById("embeddingContainer"),
        scrolling: "no",
        height: "800px",
        iframeResizeOnSheetChange: false,
        width: "1200px",
        locale: "en-US",
        footerPaddingEnabled: true,
        sheetTabsDisabled: false,
        printEnabled: false,
        undoRedoDisabled: false,
        resetDisabled: false,
      };

      const dashboard = embedDashboard(options);

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <UiLayout type="container">
        <UiText wrapper="h1" type="h1" variants={['heading']}>Dasboard</UiText>
        <div id='embeddingContainer' className='dashboard'></div>
      </UiLayout>
    </>
  )
}
