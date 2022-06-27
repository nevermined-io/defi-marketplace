import React, { useEffect, useContext, useState, useRef, InputHTMLAttributes } from 'react'
import { Form, FormSelect, FormGroup, FormInput, FormTextarea, Orientation, UiButton, UiLayout, UiText, UiDivider, UiPopupHandlers, BEM } from 'ui'
import styles from './user-publish.module.scss'


const b = BEM('user-publish', styles)

interface BasicInfoProps {
   values: any
   handleChange: any
   nextStep: any
}


export const BasicInfoStep = (props: BasicInfoProps) => {

    const {values, handleChange, nextStep } = props;    
    const [authorInputError, setAuthorInputError] = useState('') 
    const [nameInputError, setNameInputError] = useState('') 
    const [descriptionInputError, setDescriptionInputError] = useState('') 


    const checkValues = (): Boolean => {

        console.log("author: " + values.author)
        console.log("name: " + values.name)
        console.log("description: " + values.description)

        if (!values.author) {
            setAuthorInputError('Author is required')
            return false
        }

        if (!values.name) {
            setNameInputError('Name is required')
            return false
        }
        
        if (!values.description) {
            setDescriptionInputError('Description is required')
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
    
    return (
     
            <UiLayout type='container'>

                <UiText type="h2" wrapper="h2">Basic Info - Step 1 of 4</UiText>
                <div  className={b('publish-horizontal-line')}/>

                    <FormGroup orientation={Orientation.Vertical}>
                        <FormInput
                            className={b('publish-form-input')}
                            label='Author'
                            inputError={authorInputError}
                            value={values.author} onChange={e => handleChange(e.target.value, 'author')}
                            placeholder='Type the author'
                        />
                    </FormGroup>
                    <FormGroup orientation={Orientation.Vertical}>
                        <FormInput
                            className={b('publish-form-input')}
                            label='Name *'
                            inputError={nameInputError}
                            value={values.name} onChange={e => handleChange(e.target.value, 'name')}
                            placeholder='Type a name for the Asset'
                        />
                    </FormGroup>       
                    <FormGroup orientation={Orientation.Vertical}>
                        <FormTextarea
                            className={b('publish-form-input')}
                            label='Description *'
                            inputError={descriptionInputError}
                            value={values.description}
                            onChange={e => handleChange(e.target.value, 'description')}
                            placeholder='Type a description'
                        />
                    </FormGroup>

                    <UiDivider/>

                    <FormGroup orientation={Orientation.Vertical}>
                        <UiButton onClick={Continue}>&gt;</UiButton>
                    </FormGroup>

            </UiLayout>
       
    )
}