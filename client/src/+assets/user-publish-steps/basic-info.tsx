import React, { useState } from 'react'
import { UiFormGroup, UiFormInput, UiFormTextarea, Orientation, UiButton, UiLayout, UiText, UiDivider, BEM } from '@nevermined-io/styles'
import styles from './user-publish.module.scss'
import Catalog from 'components-catalog-nvm-test'
import { AssetType } from '../../shared';


const b = BEM('user-publish', styles)

interface BasicInfoProps {
   nextStep: () => void
}


export const BasicInfoStep = (props: BasicInfoProps) => {

    const { nextStep } = props;
    const { assetPublish, handleChange } = Catalog.useAssetPublish()
    const [authorInputError, setAuthorInputError] = useState('')
    const [nameInputError, setNameInputError] = useState('')
    const [descriptionInputError, setDescriptionInputError] = useState('')

    const checkValues = (): Boolean => {

        if (!assetPublish.author) {
            setAuthorInputError('Author is required')
            return false
        }

        if (!assetPublish.name) {
            setNameInputError('Name is required')
            return false
        }

        if (!assetPublish.description) {
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

                <div  className={b('form-input')}>
                    <UiFormGroup orientation={Orientation.Vertical}>
                        <UiFormInput
                            className={b('publish-form-input')}
                            label='Author *'
                            inputError={authorInputError}
                            value={assetPublish.author} onChange={e => handleChange(e.target.value, 'author')}
                            placeholder='Type the author'
                        />
                    </UiFormGroup>
                    <UiFormGroup orientation={Orientation.Vertical}>
                        <UiFormInput
                            className={b('publish-form-input')}
                            label='Name *'
                            inputError={nameInputError}
                            value={assetPublish.name} onChange={e => handleChange(e.target.value, 'name')}
                            placeholder='Type a name for the Asset'
                        />
                    </UiFormGroup>
                    <UiFormGroup orientation={Orientation.Vertical}>
                        <UiFormTextarea
                            className={b('publish-form-input')}
                            label='Description *'
                            inputError={descriptionInputError}
                            value={assetPublish.description}
                            onChange={e => handleChange(e.target.value, 'description')}
                            placeholder='Type a description'
                        />
                    </UiFormGroup>

                    <UiDivider/>

                    <UiFormGroup orientation={Orientation.Vertical}>
                        <UiButton onClick={Continue}>&gt;</UiButton>
                    </UiFormGroup>
                    </div>
            </UiLayout>

    )
}
