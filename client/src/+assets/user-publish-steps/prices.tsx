import React, { useEffect, useContext, useState, useRef } from 'react'
import { Form, FormSelect, FormGroup, FormInput, FormTextarea, Orientation, UiButton, UiLayout, UiText, UiDivider, UiPopupHandlers, BEM } from 'ui'
import { NotificationPopup } from '../../components'
import styles from './user-publish.module.scss'

const b = BEM('user-publish', styles)
const tiers: string[] = ["Tier 1", "Tier 2", "Tier 3"]


interface PricesProps {
    values: any
    handleChange: any
    prevStep: any
    submit: any
 }

export const PricesStep = (props: PricesProps) => {
    const {values, handleChange, prevStep, submit } = props;    
    const [inputError, setInputError] = useState('') 
    

    const Previous = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        prevStep();
      }

    return (
     
            <UiLayout type='container'>

                    <UiText type="h2" wrapper="h2">Price & Subscription - Step 4 of 4</UiText>
                    <div  className={b('publish-horizontal-line')}/>
                    
                    <FormGroup orientation={Orientation.Vertical}>
                    <FormSelect
                        value={values.tier}
                        onChange={e => handleChange(e, 'tier')}
                        options={tiers}
                        className={b('publish-form-select')}
                        label='Tier'
                        inputError={inputError}
                    /> 
                    </FormGroup>

                    <FormGroup orientation={Orientation.Vertical}>
                        <FormInput
                            className={b('publish-form-input')}
                            label='Set Your Price'
                            value={values.price} onChange={e=>handleChange(e.target.value, 'price')}
                        />
                    </FormGroup>
                    

                    <UiDivider/>
                    <FormGroup orientation={Orientation.Vertical}>
                        <UiButton onClick={Previous}>&lt;</UiButton>
                        <UiButton onClick={submit}>Publish Asset</UiButton>
                    </FormGroup>
             
            </UiLayout>
       
    )
}