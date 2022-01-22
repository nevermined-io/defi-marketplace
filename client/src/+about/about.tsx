import type { NextPage } from 'next'
import React from 'react'

import { UiText, UiDivider, UiLayout, BEM } from 'ui'
import styles from './about.module.scss'
import { Diagram } from './diagram'

const lorem = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Risus sit diam integer aliquet netus. Tortor elementum nisi, scelerisque ornare nunc. Lacus risus a interdum quis et, nam vitae. Tempor nulla vivamus semper massa senectus mi. Non dolor purus sed pellentesque placerat sagittis ornare amet. Gravida facilisis sed ac quis sapien. Enim, sapien adipiscing sapien neque. Massa, nibh lobortis in amet, tortor a viverra quam vulputate.
Nullam cursus etiam eget imperdiet tincidunt sodales. Eget platea pharetra dolor auctor sit eget. Diam mus ut non arcu quis at hac tristique aliquam. Nunc ultrices morbi mauris ac nisi, amet. Eu nibh sed blandit morbi sit. Nec nunc, et sem a turpis convallis. Id ut amet id quisque. Pellentesque condimentum nunc leo commodo, donec tristique. Elementum, tellus pulvinar placerat fermentum neque, pellentesque. Nunc in porta cursus vitae id et. Risus elementum sit semper proin.
Mi at purus elementum facilisis. Aliquet eu facilisis ut nisi tincidunt. Aliquam eget mauris sit pulvinar vel ut. In id turpis morbi elementum, posuere arcu pharetra. Integer nunc nulla nec molestie nunc. Libero mauris eget eget quis fringilla vulputate sagittis pellentesque. Gravida morbi enim nulla eu, ornare tincidunt volutpat enim. Ut urna quis pulvinar sagittis feugiat rhoncus rhoncus faucibus.
Quis magna purus pretium aliquam sit et pellentesque sit nunc. Blandit aliquam mattis aliquam ut auctor aliquam donec blandit. Tincidunt facilisis diam volutpat non, aliquam volutpat vulputate euismod. Facilisis facilisis imperdiet neque, mauris cras. Arcu netus viverra morbi eget arcu maecenas eu sit. At et, nisl, sit nulla. Bibendum dui, sit non cras nunc viverra adipiscing. Auctor consectetur enim eu ornare ridiculus nullam nunc, pharetra. Molestie varius dignissim nibh diam, donec lectus tempor. Maecenas gravida netus blandit pellentesque purus proin pharetra suscipit. Nec arcu eget duis adipiscing quam ullamcorper eu. Id viverra nec in vestibulum dolor dictumst facilisis magna iaculis.
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Risus sit diam integer aliquet netus. Tortor elementum nisi, scelerisque ornare nunc. Lacus risus a interdum quis et, nam vitae. Tempor nulla vivamus semper massa senectus mi. Non dolor purus sed pellentesque placerat sagittis ornare amet. Gravida facilisis sed ac quis sapien. Enim, sapien adipiscing sapien neque. Massa, nibh lobortis in amet, tortor a viverra quam vulputate.
Nullam cursus etiam eget imperdiet tincidunt sodales. Eget platea pharetra dolor auctor sit eget. Diam mus ut non arcu quis at hac tristique aliquam. Nunc ultrices morbi mauris ac nisi, amet. Eu nibh sed blandit morbi sit. Nec nunc, et sem a turpis convallis. Id ut amet id quisque. Pellentesque condimentum nunc leo commodo, donec tristique. Elementum, tellus pulvinar placerat fermentum neque, pellentesque. Nunc in porta cursus vitae id et. Risus elementum sit semper proin.
Mi at purus elementum facilisis. Aliquet eu facilisis ut nisi tincidunt. Aliquam eget mauris sit pulvinar vel ut. In id turpis morbi elementum, posuere arcu pharetra. Integer nunc nulla nec molestie nunc. Libero mauris eget eget quis fringilla vulputate sagittis pellentesque. Gravida morbi enim nulla eu, ornare tincidunt volutpat enim. Ut urna quis pulvinar sagittis feugiat rhoncus rhoncus faucibus.
`.trim()

const b = BEM('about', styles)
export const About: NextPage = () => {
  return (
    <>
      <UiLayout type="container">
        <UiText wrapper="h1" type="h1" variants={['heading']}>About us</UiText>
        <UiLayout>
          <UiText type="h3" wrapper="h3" variants={['underline']}>Information on the nevermined defi marketplace</UiText>
        </UiLayout>
        <UiDivider/>
        {lorem.split('\n').map((_, i) => (<UiText key={i} type="p" block>{_}</UiText>))}
        <UiDivider type="xl"/>
        <UiLayout>
          <UiText type="h3" wrapper="h3" variants={['underline']}>How it works</UiText>
        </UiLayout>
        <UiDivider type="l"/>
        <Diagram />
        <UiDivider type="xl"/>
        <UiLayout>
          <UiText type="h3" wrapper="h3" variants={['underline']}>Information on the nevermined defi marketplace</UiText>
        </UiLayout>
        <UiDivider/>
        {lorem.split('\n').map((_, i) => (<UiText key={i} type="p" block>{_}</UiText>))}
      </UiLayout>
    </>
  )
}
