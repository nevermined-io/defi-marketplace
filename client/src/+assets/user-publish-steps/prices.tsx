import React, { useEffect, useContext, useState, useRef } from 'react'
import { FormSelect} from 'ui'
import { UiForm, UiFormGroup, UiFormInput, Orientation, UiButton, UiLayout, UiText, UiDivider, BEM } from '@nevermined-io/styles'
import styles from './user-publish.module.scss'
import {UserPublishParams} from './main-page'

const b = BEM('user-publish', styles)
const tiers: string[] = ["Tier 1", "Tier 2", "Tier 3"]

interface PricesProps {
    values: UserPublishParams
    handleChange: (value: string, field: string) => void
    prevStep: () => void
    submit: () => void
    isPublished: boolean
    successMessage: string
 }

export const PricesStep = (props: PricesProps) => {
    const {values, handleChange, prevStep, submit, isPublished, successMessage } = props;    
    const [inputError, setInputError] = useState('') 
    

    const Previous = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        prevStep();
      }
   
    return (
     
            <UiLayout type='container'>

                    <UiText type="h2" wrapper="h2">Subscription & Price - Step 4 of 4</UiText>
                    <div  className={b('publish-horizontal-line')}/>
                    
                    <UiFormGroup orientation={Orientation.Vertical}>
                    <FormSelect
                        value={values.tier}
                        onChange={e => handleChange(e, 'tier')}
                        options={tiers}
                        className={b('publish-form-select')}
                        label='Tier'
                        inputError={inputError}
                    /> 
                    </UiFormGroup>

                    <UiFormGroup orientation={Orientation.Vertical}>
                        <UiFormInput
                            className={b('publish-form-input')}
                            label='Set Your Price'
                            value={values.price} onChange={e=>handleChange(e.target.value, 'price')}
                        />
                    </UiFormGroup>
                    

                    <UiDivider/>
                    <UiFormGroup orientation={Orientation.Vertical}>
                            
                            {
                                (isPublished) ?  <div className={b('user-publish-submit-container', ['updated-message'])}>
                                                <UiText type="h3" wrapper="h3" variants={['success']}>{successMessage}</UiText> 
                                                </div>
                                                : 
                                                <div className={b('user-publish-submit-container',['submit'])}>
                                                <UiButton onClick={Previous}>&lt;</UiButton>
                                                <UiButton onClick={submit}>Publish Asset</UiButton>
                                                </div>
                            }
                    
                    </UiFormGroup>
             
            </UiLayout>
       
    )
}