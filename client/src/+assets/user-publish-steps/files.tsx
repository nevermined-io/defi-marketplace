import React, { useEffect, useContext, useState, useRef } from 'react'
import { Form, FormSelect, FormGroup, FormInput, FormTextarea, Orientation, UiButton, UiLayout, UiText, UiDivider, UiPopupHandlers, BEM } from 'ui'
import styles from './user-publish.module.scss'



const b = BEM('user-publish', styles)

interface FilesProps {
    values: any
    handleChange: any
    handleFileChange:any
    prevStep: any
    nextStep: any
 }


export const FilesStep = (props: FilesProps) => {
    
    const {values, handleChange, handleFileChange, prevStep, nextStep } = props;    
    const [inputError, setInputError] = useState('') 

    const checkValues = (): Boolean => {

        console.log("file_id: " + values.file_id)
        console.log("sample_id: " + values.sample_file_id)
        console.log("file name: " + values.file_name)

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

                    <UiText type="h2" wrapper="h2">Storage</UiText>
                    <div  className={b('publish-horizontal-line')}/>
            
                    <FormGroup orientation={Orientation.Vertical}>
                        <FormInput
                            className={b('publish-form-input')}
                            label='File ID *'
                            value={values.file_id} onChange={e=>handleChange(e.target.value, 'file_id')}
                            placeholder='Type the filecoin id for the file'
                            inputError={inputError}
                        />
                    </FormGroup>
                    <FormGroup orientation={Orientation.Vertical}>
                        <FormInput
                            className={b('publish-form-input')}
                            label='Sample File ID'
                            value={values.sample_file_id} onChange={e=> handleChange(e.target.value, 'sample_file_id')}
                            placeholder='Type the filecoin id for the sample file'
                        />
                    </FormGroup>
                    <FormGroup orientation={Orientation.Vertical}>
                        <FormInput
                            className={b('publish-form-input')}
                            type = "file"
                            label='File'
                            onChange={e=> handleFileChange(e)}
                            placeholder='Select the file'
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