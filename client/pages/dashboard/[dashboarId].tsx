import type { NextPage } from 'next'
import router, { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react'
import { getDashboardUrl } from 'src/shared'
import { embedDashboard } from 'amazon-quicksight-embedding-sdk';
import { UiText, UiDivider, UiLayout, BEM } from 'ui'

const Dashboard: NextPage = () => {

  const [dashboardId, setDashboardId] = useState<string>("")

  useEffect(() => {
    setDashboardUrl()
  }, [])

  useEffect(() => {
    setDashboardId("router.query.dashboarId?.toString" || "")
  }, [router])

  const setDashboardUrl = async () => {

    try {
      const response = await getDashboardUrl()
      const options = {
        url: response.data.EmbedUrl,
        container: document.getElementById("embeddingContainer"),
        scrolling: "no",
        height: "800px",
        iframeResizeOnSheetChange: false,
        width: "1200px",
        locale: "en-US",
        sheetId: 'Liquidations',
        footerPaddingEnabled: true,
        sheetTabsDisabled: false,
        printEnabled: false,
        undoRedoDisabled: false,
        resetDisabled: false,
      };

      embedDashboard(options);

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

export default Dashboard
