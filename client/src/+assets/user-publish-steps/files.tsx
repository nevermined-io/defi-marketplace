import React, { useEffect, useContext, useState, useRef } from 'react'
import { UiFormGroup, UiFormInput, Orientation, UiButton, UiLayout, UiText, UiDivider, BEM } from '@nevermined-io/styles'
import styles from './user-publish.module.scss'
import {UserPublishParams} from './main-page'

const b = BEM('user-publish', styles)

interface FilesProps {
    values: UserPublishParams
    handleChange: (value: string, field: string) => void
    prevStep: () => void
    nextStep: () => void 
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
 }


export const FilesStep = (props: FilesProps) => {
    
    const {values, handleChange, handleFileChange, prevStep, nextStep } = props;    
    const [inputError, setInputError] = useState('') 

    const checkValues = (): Boolean => {

        if (!values.file_id && !values.file_name) {
            setInputError('Local File  or Filecoin URL is required')
            return false
        }

        return true      
    }

    
    const Continue = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!checkValues())
            return;
        nextStep();
      }
    
    const Previous = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        prevStep();
      }


    return (
     
            <UiLayout type='container'>

                    <UiText type="h2" wrapper="h2">Storage - Step 3 of 4</UiText>
                    <div  className={b('publish-horizontal-line')}/>
            
                    <UiFormGroup orientation={Orientation.Vertical}>
                        <UiFormInput
                            className={b('publish-form-input')}
                            label='File ID *'
                            value={values.file_id} onChange={e=>handleChange(e.target.value, 'file_id')}
                            placeholder='Type the filecoin id for the file'
                            inputError={inputError}
                        />
                    </UiFormGroup>
                    <UiFormGroup orientation={Orientation.Vertical}>
                        <UiFormInput
                            className={b('publish-form-input')}
                            label='Sample File ID'
                            value={values.sample_file_id} onChange={e=> handleChange(e.target.value, 'sample_file_id')}
                            placeholder='Type the filecoin id for the sample file'
                        />
                    </UiFormGroup>
                    <UiFormGroup orientation={Orientation.Vertical}>
                        <UiFormInput
                            className={b('publish-form-input')}
                            type = "file"
                            label='File'
                            onChange={handleFileChange}
                            placeholder='Select the file'
                        />
                    </UiFormGroup>
                    
                    <UiDivider/>
                    <UiFormGroup orientation={Orientation.Vertical}>
                        <UiButton onClick={Previous}>&lt;</UiButton>
                        <UiButton onClick={Continue}>&gt;</UiButton>
                    </UiFormGroup>

            </UiLayout>
       
    )
}