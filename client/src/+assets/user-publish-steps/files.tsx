import React, { useState, useRef } from 'react'
import {
  UiFormGroup,
  UiFormInput,
  Orientation,
  UiButton,
  UiLayout,
  UiText,
  UiDivider,
  BEM,
  UiFormItem,
  UiPopupHandlers
} from '@nevermined-io/styles'
import styles from './user-publish.module.scss'
import { FileType, checkFilecoinIdExists } from './files-handler'
import { ProgressPopup } from './progress-popup'
import Catalog from '@nevermined-io/catalog-core'
import { AssetFile } from '@nevermined-io/catalog-core/dist/node/types'

const b = BEM('user-publish', styles)

interface FilesProps {
  prevStep: () => void
  nextStep: () => void
  updateFilesAdded: (assetFiles: AssetFile) => void
  removeFile: (label: string) => void
}

export const FilesStep = (props: FilesProps) => {
  const { assetPublish } = Catalog.useAssetPublish()
  const { updateFilesAdded, removeFile, prevStep, nextStep } = props
  const [inputError, setInputError] = useState('')
  const [newFilecoinID, setNewFilecoinID] = useState('')
  const [popupMesssage, setPopupMessage] = useState('')
  const popupRef = useRef<UiPopupHandlers>()
  const filecoinImage = '/assets/logos/filecoin_grey.svg'

  const checkValues = (): boolean => {
    if (!assetPublish.assetFiles || assetPublish.assetFiles.length == 0) {
      setInputError('Local File  or Filecoin URL is required')
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

  const handleNewFile = function (e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target?.files?.length) {
      return
    }

    const file = e.target.files[0]
    const assetFile: AssetFile = {
      type: FileType.Local,
      name: file.name,
      label: file.name,
      size: String(file.size),
      content_type: file.type,
      file: file
    }
    updateFilesAdded(assetFile)
    setInputError('')
  }

  const addFilecoinID = async () => {
    if (!newFilecoinID) return

    setPopupMessage('Getting info from Filecoin...')
    popupRef.current?.open()
    await new Promise((f) => setTimeout(f, 500))

    const result = await checkFilecoinIdExists(newFilecoinID)
    if (!result[0]) {
      setInputError('The filecoin ID was not found')
      popupRef.current?.close()
      return
    }

    const assetFile: AssetFile = result[1]
    setNewFilecoinID('')
    updateFilesAdded(assetFile)
    setInputError('')

    popupRef.current?.close()
  }

  return (
    <UiLayout type="container">
      <ProgressPopup message={popupMesssage} image={filecoinImage} popupRef={popupRef} />

      <UiText type="h2" wrapper="h2">
        FILES - Step 3 of 4
      </UiText>
      <div className={b('publish-horizontal-line')} />

      <div>
        <UiText type="h3">Asset Files</UiText>
      </div>
      <div>
        <UiText variants={['detail']}>
          Introduce a Filecoin ID or Upload a file from your computer to Filecoin{' '}
        </UiText>
      </div>

      <div className={b('form-input')}>
        <div className={b('publish-current-files-container')}>
          {assetPublish.assetFiles.map((assetfile) => (
            <div className={b('publish-current-files')} key={assetfile.label}>
              <UiFormItem
                value={assetfile.label}
                onClick={(e) => removeFile(assetfile.label)}
                disabled={true}
                readOnly={true}
                onChange={() => {}}
              />
            </div>
          ))}
        </div>

        <UiDivider></UiDivider>
        <UiDivider></UiDivider>

        <UiFormGroup orientation={Orientation.Vertical}>
          <UiFormItem
            className={b('publish-form-input')}
            label="Add New File from Filecoin"
            value={newFilecoinID}
            onClick={addFilecoinID}
            onChange={(e) => setNewFilecoinID(e.target.value)}
            placeholder="Type the Filecoin or IPFS ID of the file"
            disabled={false}
          />
        </UiFormGroup>

        <UiFormGroup orientation={Orientation.Vertical}>
          <UiFormInput
            className={b('publish-form-input')}
            type="file"
            label="Upload from your computer"
            onChange={handleNewFile}
            placeholder="Select the file"
            inputError={inputError}
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
