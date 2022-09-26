import React from 'react'
import { BEM, UiLayout, UiText, UiDivider } from '@nevermined-io/styles'
import styles from './progress-bar.module.scss'
import CheckMark from '../../../../public/assets/subscription-tick.svg'

type ProgressBarProps = {
  currentStep: number
  totalSteps: number
  isProcessComplete?: boolean
}

const b = BEM('progress-bar', styles)

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  isProcessComplete
}) => {
  return (
    <>
      <UiLayout className={b()}>
        {[...Array(totalSteps)].map((_, index) => {
          const stepIndex = ++index
          const isStepComplete = currentStep >= stepIndex
          const isActiveStep = currentStep === stepIndex
          const cssModifiers = []

          if (isActiveStep && !isProcessComplete) {
            cssModifiers.push('active')
          } else if (isStepComplete || isProcessComplete) {
            cssModifiers.push('complete')
          }

          return (
            <div key={index} className={b('step')}>
              <div className={b('step-content')}>
                <span className={b('icon', cssModifiers)}>
                  <CheckMark />
                </span>
                <UiText className={b('text', cssModifiers)}>Step {stepIndex}</UiText>
              </div>
              <UiDivider className={b('underline', cssModifiers)} />
            </div>
          )
        })}
      </UiLayout>
      <UiDivider type="l" />
    </>
  )
}
