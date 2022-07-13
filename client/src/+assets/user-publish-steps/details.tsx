import React, { useState } from 'react'
import { UiFormGroup, Orientation, UiButton, UiLayout, UiText, UiDivider, UiFormSelect, UiFormTextarea, BEM } from '@nevermined-io/styles'
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
    const notebookLanguages = ['Python', 'Java', 'Scala', 'R', 'SQL', 'Other' ]
    const notebookFormats = ['Source code', 'Jupyter (.ipynb)', 'Zeppelin (.json)', 'Zip', 'PDF', 'Other' ]
    const reportTypes = ['Aggregation', 'Merge', 'Transformation', 'Enrichment', 'Other']
    const reportFormats = ['CSV', 'Excel', 'PDF', 'Other']

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

                    <div className={b('form-input')}>
                    <UiFormGroup orientation={Orientation.Vertical}>
                        <UiFormSelect
                            value={values.type}
                            onChange={e => handleChange(e, 'type')}
                            options={assetTypes}
                            className={b('publish-form-select')}
                            label='Type'
                            inputError={typeInputError}
                        />
                    </UiFormGroup>

                    {
                        values.type === "notebook" ?
                        <div>
                        <UiFormGroup orientation={Orientation.Vertical}>
                            <UiFormSelect
                                value={values.notebook_language}
                                onChange={e => handleChange(e, 'notebook_language')}
                                options={notebookLanguages}
                                className={b('publish-form-select')}
                                label='Language *'
                                inputError={typeInputError}
                            />
                        </UiFormGroup>

                        <UiFormGroup orientation={Orientation.Vertical}>
                        <UiFormSelect
                            value={values.notebook_format}
                            onChange={e => handleChange(e, 'notebook_format')}
                            options={notebookFormats}
                            className={b('publish-form-select')}
                            label='Format *'
                            inputError={typeInputError}
                        />
                    </UiFormGroup>
                    <UiFormGroup orientation={Orientation.Vertical}>
                        <UiFormTextarea
                            className={b('publish-form-input')}
                            label='Dependencies'
                            inputError={typeInputError}
                            value={values.notebook_dependencies}
                            onChange={e => handleChange(e.target.value, 'notebook_dependencies')}
                            placeholder='Put here the dependendencies or requirements in order to run the notebook'
                        />
                    </UiFormGroup>
                    </div>
                        :null
                    }

                    {
                        values.type === "report" ?
                        <div>
                        <UiFormGroup orientation={Orientation.Vertical}>
                            <UiFormSelect
                                value={values.report_type}
                                onChange={e => handleChange(e, 'report_type')}
                                options={reportTypes}
                                className={b('publish-form-select')}
                                label='Type *'
                                inputError={typeInputError}
                            />
                            <UiFormSelect
                                value={values.report_format}
                                onChange={e => handleChange(e, 'report_format')}
                                options={reportFormats}
                                className={b('publish-form-select')}
                                label='Format *'
                                inputError={typeInputError}
                            />
                        </UiFormGroup>
                    </div>
                        :null
                    }

                    <div  className={b('publish-horizontal-line')}/>

                    <UiFormGroup orientation={Orientation.Vertical}>
                        <UiFormSelect
                            value={values.category}
                            onChange={e => handleChange(e, 'category')}
                            options={categories}
                            className={b('publish-form-select')}
                            label='Category'
                            inputError={categoryInputError}
                        />
                    </UiFormGroup>

                    <UiFormGroup orientation={Orientation.Vertical}>
                        <UiFormSelect
                            value={values.protocol}
                            onChange={e => handleChange(e, 'protocol')}
                            options={protocols}
                            className={b('publish-form-select')}
                            label='Protocol'
                            inputError={protocolInputError}
                        />
                    </UiFormGroup>

                    <UiFormGroup orientation={Orientation.Vertical}>
                    <UiFormSelect
                        value={values.network}
                        onChange={e => handleChange(e, 'network')}
                        options={networks}
                        className={b('publish-form-select')}
                        label='Network'
                        inputError={networkInputError}
                    />
                    </UiFormGroup>

                    <UiDivider/>

                    <UiFormGroup orientation={Orientation.Vertical}>
                        <UiButton onClick={Previous}>&lt;</UiButton>
                        <UiButton onClick={Continue}>&gt;</UiButton>
                    </UiFormGroup>
                    </div>
            </UiLayout>

    )
}
