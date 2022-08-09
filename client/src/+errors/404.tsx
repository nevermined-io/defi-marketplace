import { UiLayout, UiText, BEM } from '@nevermined-io/styles'
import styles from './404.module.scss'
import Link from 'next/link'

const b = BEM('not-found', styles)

export const Custom404 = () => {
  return (
    <UiLayout type="container" align="center" justify="center" className={b('container-page')}>
      <UiText type="h1">404</UiText>
      <UiText type="p" className={b('description')}>
        Oops, the page doesn&apos;t exist. If you think that it should exist please contact with us
        in our&nbsp;
        <span className={b('description-link')}>
          <Link href="https://discord.com/invite/uyCT8ZmJNj">discord</Link>
        </span>
        .
      </UiText>
    </UiLayout>
  )
}
