import type { NextPage } from 'next'
import Image from 'next/image'

import { UiHeader, UiText, UiButton, UiHeaderLink } from 'ui'

const Styles: NextPage = () => {
  return (
    <>
      <UiHeader>
        <UiHeaderLink href="/">Link A</UiHeaderLink>
        <UiHeaderLink href="/styles">Link B</UiHeaderLink>
      </UiHeader>

      <div>
        <UiText wrapper="h1" type="h1">H1 Heading</UiText>
        <UiText wrapper="h2" type="h2">H2 Heading</UiText>
        <UiText wrapper="h3" type="h3">H3 Heading</UiText>
        <UiText wrapper="h4" type="h4">H4 Heading</UiText>
        <UiText wrapper="h4" type="h4-caps">H4 (caps) Heading</UiText>
        <br/>
        <br/>
        <br/>
        <UiText block>Text - Adipisicing anim in aliquip nisi in ullamco fugiat incididunt quis dolore pariatur laborum.</UiText>
        <UiText block type="caps">Text (caps) - Adipisicing anim in aliquip nisi in ullamco fugiat incididunt quis dolore pariatur laborum.</UiText>
        <UiText block type="small">Small - Adipisicing anim in aliquip nisi in ullamco fugiat incididunt quis dolore pariatur laborum.</UiText>
        <UiText block type="small-caps">Small (caps) - Adipisicing anim in aliquip nisi in ullamco fugiat incididunt quis dolore pariatur laborum.</UiText>
        <UiText block type="link">Link - Adipisicing anim in aliquip nisi in ullamco fugiat incididunt quis dolore pariatur laborum.</UiText>
        <UiText block type="link-bold">Link - Adipisicing anim in aliquip nisi in ullamco fugiat incididunt quis dolore pariatur laborum.</UiText>
        <UiText block type="link-caps">Link - Adipisicing anim in aliquip nisi in ullamco fugiat incididunt quis dolore pariatur laborum.</UiText>
        <br/>
        <br/>
        <br/>
        <UiText block type="link" variants={['highlight']}>Variants - Highlight</UiText>
        <UiText block type="link" variants={['detail']}>Variants - Detail</UiText>
        <UiText block type="link" variants={['secondary']}>Variants - Secondary</UiText>
      </div>
      <br/><br/>
      <div>
        <UiButton>
          Connect wallet
        </UiButton>
      </div>
    </>
  )
}

export default Styles
