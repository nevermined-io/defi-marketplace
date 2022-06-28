import React, { useEffect, useContext, useState, useRef } from 'react'
import { Form, FormSelect, FormGroup, FormInput, FormTextarea, Orientation, UiButton, UiLayout, UiText, UiDivider, UiPopupHandlers, BEM } from 'ui'
import styles from './user-publish.module.scss'
import { networks, categories, protocols, assetTypes } from 'src/config'
import {UserPublishParams} from './main-page'

const b = BEM('user-publish', styles)

interface DetailsProps {
   values: UserPublishParams
   handleChange: (value: string, field: string) => void
   prevStep: () => void
   nextStep: () => void   
 }

export const DetailsStep = (props: DetailsProps) => {

    const {values, handleChange, prevStep, nextStep } = props;    
    const [typeInputError, setTypeInputError] = useState('')
    const [categoryInputError, setCategoryInputError] = useState('') 
    const [protocolInputError, setProtocolInputError] = useState('') 
    const [networkInputError, setNetworkInputError] = useState('')  

    const checkValues = (): Boolean => {

        if (!values.type) {
            setTypeInputError('Type is required')
            return false
        }
        
        if (!values.category) {
            setCategoryInputError('Category is required')
            return false
        }
        if (!values.protocol) {
            setProtocolInputError('Protocol is required')
            return false
        }
        if (!values.network) {
            setNetworkInputError('Network is required')
            return false
        }

        return true
    }


    const Continue = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!checkValues()) 
            return  
        nextStep();
      }
    
    const Previous = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        prevStep();
      }

    
    return (
     
            <UiLayout type='container'>
               
                    <UiText type="h2" wrapper="h2">Details - Step 2 of 4</UiText>
                    <div  className={b('publish-horizontal-line')}/>

                    <FormGroup orientation={Orientation.Vertical}>               
                        <FormSelect
                            value={values.type}
                            onChange={e => handleChange(e, 'type')}
                            options={assetTypes}
                            className={b('publish-form-select')}
                            label='Type'
                            inputError={typeInputError}
                        /> 
                    </FormGroup>

                    <FormGroup orientation={Orientation.Vertical}>               
                        <FormSelect
                            value={values.category}
                            onChange={e => handleChange(e, 'category')}
                            options={categories}
                            className={b('publish-form-select')}
                            label='Category'
                            inputError={categoryInputError}
                        /> 
                    </FormGroup>
                
                    <FormGroup orientation={Orientation.Vertical}>
                        <FormSelect
                            value={values.protocol}
                            onChange={e => handleChange(e, 'protocol')}
                            options={protocols}
                            className={b('publish-form-select')}
                            label='Protocol'
                            inputError={protocolInputError}
                        /> 
                    </FormGroup>

                    <FormGroup orientation={Orientation.Vertical}>
                    <FormSelect
                        value={values.network}
                        onChange={e => handleChange(e, 'network')}
                        options={networks}
                        className={b('publish-form-select')}
                        label='Network'
                        inputError={networkInputError}
                    /> 
                    </FormGroup>
    
                    <UiDivider/>

                    <FormGroup orientation={Orientation.Vertical}>
                        <UiButton onClick={Previous}>&lt;</UiButton>
                        <UiButton onClick={Continue}>&gt;</UiButton>
                    </FormGroup>
            </UiLayout>
       
    )
}