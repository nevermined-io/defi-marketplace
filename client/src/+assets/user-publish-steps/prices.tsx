import React, { useEffect, useContext, useState, useRef } from 'react'
import { UiForm, UiFormGroup, UiFormInput, Orientation, UiButton, UiLayout, UiText, UiDivider, UiFormSelect, UiPopupHandlers, BEM } from '@nevermined-io/styles'
import styles from './user-publish.module.scss'
import { UiHeaderLink} from 'ui'
import {UserPublishParams} from './main-page'
import {ProgressPopup} from './progress-popup' 

const b = BEM('user-publish', styles)
const tiers: string[] = ["Tier 1", "Tier 2", "Tier 3"]

interface PricesProps {
    values: UserPublishParams
    handleChange: (value: string, field: string) => void
    prevStep: () => void
    submit: () => void
    reset: () => void
    isPublished: boolean
    successMessage: string
    filesUploadedMessage: string[],
    fileUploadPopupRef: React.RefObject<UiPopupHandlers>
 }

export const PricesStep = (props: PricesProps) => {
    const {values, handleChange, prevStep, submit, reset, isPublished, successMessage, filesUploadedMessage, fileUploadPopupRef } = props;    
    const [inputError, setInputError] = useState('') 
    const popupMesssage = "Uploading local files to Filecoin..."


    const Previous = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        prevStep();
      }
   
    return (
     
            <UiLayout type='container'>
                    <ProgressPopup  message={popupMesssage} popupRef={fileUploadPopupRef} icon="file"/>
                    {(isPublished) ? 
                    <UiText type="h2" wrapper="h2">Asset Published</UiText>
                    :
                    <UiText type="h2" wrapper="h2">Subscription & Price - Step 4 of 4</UiText>
                    }
                    <div  className={b('publish-horizontal-line')}/>
                    
                    <UiFormGroup orientation={Orientation.Vertical}>
                    {(isPublished) ? <div/> :
                    <UiFormSelect
                        value={values.tier}
                        onChange={e => handleChange(e, 'tier')}
                        options={tiers}
                        className={b('publish-form-select')}
                        label='Tier'
                        inputError={inputError}
                    /> 
                    }
                    </UiFormGroup>
                    {(isPublished) ? <div/> :
                    <UiFormGroup orientation={Orientation.Vertical}>
                        <UiFormInput
                            className={b('publish-form-input')}
                            label='Set Your Price'
                            value={values.price} onChange={e=>handleChange(e.target.value, 'price')}
                        />
                    </UiFormGroup>
                    }

                    <UiDivider/>
                    <UiFormGroup orientation={Orientation.Vertical}>
                            
                            {
                                (isPublished) ?  <div className={b('user-publish-submit-container', ['updated-message'])}>
                                                <UiText type="h3" wrapper="h3" variants={['success']}>{successMessage}</UiText> 
                                                {filesUploadedMessage.map( (message, index) => 
                                                    <div key={index}>
                                                        <UiText type="h3" wrapper="h3" variants={['success']}>{message}</UiText>
                                                    </div>
                                                )}
                                                <UiDivider/>
                                                <UiDivider/>
                                                 <UiButton onClick={reset}>Publish New Asset</UiButton>
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