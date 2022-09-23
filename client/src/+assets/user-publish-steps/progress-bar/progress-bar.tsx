import React from 'react'
import { BEM, UiLayout, UiText, UiDivider } from '@nevermined-io/styles'
import styles from './progress-bar.module.scss'
import CircleCheck from '../../../../public/assets/circle-check.svg'
import CheckMark from '../../../../public/assets/check_mark.svg'

type ProgressBarProps = {
  currentStep: number
  totalSteps: number
}

const b = BEM('progress-bar', styles)

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  return (
    <>
      <UiLayout className={b()}>
        {[...Array(totalSteps)].map((_, index) => {
          const stepIndex = ++index
          const isActiveStep = currentStep === stepIndex

          return (
            <div key={index} className={b('step')}>
              <div className={b('step-content')}>
                {isActiveStep ? (
                  <CircleCheck className={b('icon', ['active'])} />
                ) : (
                  <CheckMark className={b('icon')} />
                )}
                <UiText className={b('text', [isActiveStep ? 'active' : ''])}>Step {stepIndex}</UiText>
              </div>
              <UiDivider className={b('underline', [isActiveStep ? 'active' : ''])} />
            </div>
          )
        })}
      </UiLayout>
      <UiDivider type="l" />
    </>
  )
}
