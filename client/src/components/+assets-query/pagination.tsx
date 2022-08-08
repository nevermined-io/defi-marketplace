import React from 'react'

import { UiButton, UiIcon, UiLayout, UiDivider, UiText } from '@nevermined-io/styles'

interface PaginationProps {
  totalPages: number
  page: number
  setPage: (page: number) => void
}

export function XuiPagination({ totalPages, page, setPage }: PaginationProps) {
  return (
    <>
      <UiDivider type="l" />
      <UiLayout justify="center" align="center">
        <UiButton square type="alt" disabled={page === 1} onClick={() => setPage(page - 1)}>
          <UiIcon icon="arrowLeft" />
        </UiButton>
        <UiDivider vertical />
        <UiText variants={['detail', 'bold']}>
          {page} / {totalPages}
        </UiText>
        <UiDivider vertical />
        <UiButton
          square
          type="alt"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          <UiIcon icon="arrowRight" />
        </UiButton>
      </UiLayout>
    </>
  )
}
