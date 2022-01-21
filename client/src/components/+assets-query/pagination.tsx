import React, { ReactNode, useContext, useState, useEffect, useCallback } from 'react'

import { BEM, UiButton, UiIcon, UiLayout, UiDivider, UiText } from 'ui'
import styles from './assets-query.module.scss'

interface PaginationProps {
  totalPages: number;
  page: number;
  setPage: (page: number) => void
}

const b = BEM('assets-query', styles)

export function XuiPagination({ totalPages, page, setPage }: PaginationProps) {
  // const [page, setPage] = useState<number>(1)
  return (<>
    <UiDivider type="l" />
    <UiLayout justify="center" align="center">
      <UiButton square type="alt" disabled={page === 1} onClick={() => setPage(page - 1)}>
        <UiIcon icon="arrowLeft" />
      </UiButton>
      <UiDivider vertical />
      <UiText variants={['detail', 'bold']}>{page} / {totalPages}</UiText>
      <UiDivider vertical />
      <UiButton square type="alt" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
        <UiIcon icon="arrowRight" />
      </UiButton>
    </UiLayout>
  </>


  )
}

