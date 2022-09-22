import React, { useState } from 'react'
import {
  UiFormGroup,
  Orientation,
  UiButton,
  UiLayout,
  UiText,
  UiDivider,
  UiFormSelect,
  UiFormTextarea,
  BEM
} from '@nevermined-io/styles'
import styles from './user-publish.module.scss'
import {
  networks,
  categories,
  protocols,
  assetTypes,
  notebookLanguages,
  notebookFormats,
  reportTypes,
  reportFormats
} from 'src/config'
import { AssetService } from '@nevermined-io/catalog-core'

const b = BEM('user-publish', styles)

interface DetailsProps {
  prevStep: () => void
  nextStep: () => void
}

export const DetailsStep = (props: DetailsProps) => {
  const { assetPublish, handleChange } = AssetService.useAssetPublish()
  const { prevStep, nextStep } = props
  const [typeInputError, setTypeInputError] = useState('')
  const [categoryInputError, setCategoryInputError] = useState('')
  const [protocolInputError, setProtocolInputError] = useState('')
  const [networkInputError, setNetworkInputError] = useState('')

  const checkValues = (): boolean => {
    if (!assetPublish.type) {
      setTypeInputError('Type is required')
      return false
    }

    if (!assetPublish.category) {
      setCategoryInputError('Category is required')
      return false
    }
    if (!assetPublish.protocol) {
      setProtocolInputError('Protocol is required')
      return false
    }
    if (!assetPublish.network) {
      setNetworkInputError('Network is required')
      return false
    }

    return true
  }

  const Continue = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!checkValues()) return
    nextStep()
  }

  const Previous = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    prevStep()
  }

  return (
    <UiLayout type="container">
      <UiText type="h2" wrapper="h2">
        Details - Step 2 of 3
      </UiText>
      <div className={b('publish-horizontal-line')} />

      <div className={b('form-input')}>
        <UiFormGroup orientation={Orientation.Vertical}>
          <UiFormSelect
            value={assetPublish.type}
            onChange={(e) => handleChange(e as string, 'type')}
            options={assetTypes}
            className={b('publish-form-select')}
            label="Asset Type"
            inputError={typeInputError}
          />
        </UiFormGroup>

        {assetPublish.type === 'notebook' ? (
          <div className={b('form-input')}>
            <UiFormGroup orientation={Orientation.Vertical}>
              <UiFormSelect
                value={assetPublish.notebook_language}
                onChange={(e) => handleChange(e as string, 'notebook_language')}
                options={notebookLanguages}
                className={b('publish-form-select')}
                label="Language"
                inputError={typeInputError}
              />
            </UiFormGroup>

            <UiFormGroup orientation={Orientation.Vertical}>
              <UiFormSelect
                value={assetPublish.notebook_format}
                onChange={(e) => handleChange(e as string, 'notebook_format')}
                options={notebookFormats}
                className={b('publish-form-select')}
                label="Format"
                inputError={typeInputError}
              />
            </UiFormGroup>
            <UiFormGroup orientation={Orientation.Vertical}>
              <UiFormTextarea
                className={b('publish-form-input')}
                label="Requirements"
                inputError={typeInputError}
                value={assetPublish.notebook_requirements}
                onChange={(e) => handleChange(e.target.value, 'notebook_requirements')}
                placeholder="Put here the requirements, dependencies or conditions needed in order to run the notebook"
              />
            </UiFormGroup>
          </div>
        ) : null}

        {assetPublish.type === 'report' ? (
          <div>
            <UiFormGroup orientation={Orientation.Vertical}>
              <UiFormSelect
                value={assetPublish.report_type}
                onChange={(e) => handleChange(e as string, 'report_type')}
                options={reportTypes}
                className={b('publish-form-select')}
                label="Report Type"
                inputError={typeInputError}
              />
              <UiFormSelect
                value={assetPublish.report_format}
                onChange={(e) => handleChange(e as string, 'report_format')}
                options={reportFormats}
                className={b('publish-form-select')}
                label="Format"
                inputError={typeInputError}
              />
            </UiFormGroup>
          </div>
        ) : null}

        <div className={b('publish-horizontal-line')} />

        <UiFormGroup orientation={Orientation.Vertical}>
          <UiFormSelect
            value={assetPublish.category}
            onChange={(e) => handleChange(e as string, 'category')}
            options={categories}
            className={b('publish-form-select')}
            label="Category"
            inputError={categoryInputError}
          />
        </UiFormGroup>

        <UiFormGroup orientation={Orientation.Vertical}>
          <UiFormSelect
            value={assetPublish.protocol}
            onChange={(e) => handleChange(e as string, 'protocol')}
            options={protocols}
            className={b('publish-form-select')}
            label="Protocol"
            inputError={protocolInputError}
          />
        </UiFormGroup>

        <UiFormGroup orientation={Orientation.Vertical}>
          <UiFormSelect
            value={assetPublish.network}
            onChange={(e) => handleChange(e as string, 'network')}
            options={networks}
            className={b('publish-form-select')}
            label="Network"
            inputError={networkInputError}
          />
        </UiFormGroup>

        <UiDivider />

        <UiFormGroup orientation={Orientation.Vertical}>
          <UiButton onClick={Previous}>&lt;</UiButton>
          <UiButton onClick={Continue}>&gt;</UiButton>
        </UiFormGroup>
      </div>
    </UiLayout>
  )
}
