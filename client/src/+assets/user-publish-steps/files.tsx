import React, { useState, useRef, useEffect, useContext } from 'react'
import {
  UiFormGroup,
  UiFormInput,
  Orientation,
  UiButton,
  UiText,
  UiDivider,
  BEM,
  UiFormItem,
  UiPopupHandlers,
  Action
} from '@nevermined-io/styles'
import styles from './user-publish.module.scss'
import stepStyles from './step-content.module.scss'
import { FileType, checkFilecoinIdExists } from './files-handler'
import { ProgressPopup } from './progress-popup'
import { AssetService } from '@nevermined-io/catalog-core'
import { AssetFile } from '@nevermined-io/catalog-core/dist/node/types'
import { ConfirmPopup } from './confirm-popup'
import { User } from '../../context'
import { toast } from 'react-toastify'
import DownloadIcon from '../../../public/assets/download_icon.svg'
import CrossIcon from '../../../public/assets/blue-cross.svg'
import FilecoinLogoIcon from '../../../public/assets/logos/filecoin_grey.svg'
import NeverminedAbstractIcon from '../../../public/assets/nevermined-abstract.svg'
import LoadingIcon from '../../components/loading-icon/loading-icon'
import SuccessIcon from '../../../public/assets/success.svg'

const b = BEM('user-publish', styles)
const step = BEM('step-container', stepStyles)

interface FilesProps {
  updateFilesAdded: (assetFiles: AssetFile) => void
  removeFile: (label: string) => void
  prevStep: () => void
  submit: () => void
  reset: () => void
  filesUploadedMessage: string[]
  fileUploadPopupRef: React.MutableRefObject<UiPopupHandlers | undefined>
  txPopupRef: React.MutableRefObject<UiPopupHandlers | undefined>
  resultOk: boolean
  resultPopupRef: React.MutableRefObject<UiPopupHandlers | undefined>
  setIsProcessComplete: (value: boolean) => void
}

export const FilesStep = (props: FilesProps) => {
  const { assetPublish, isProcessing, errorAssetMessage } =
    AssetService.useAssetPublish()

  const {
    updateFilesAdded,
    removeFile,
    prevStep,
    submit,
    reset,
    filesUploadedMessage,
    fileUploadPopupRef,
    txPopupRef,
    resultOk,
    resultPopupRef,
    setIsProcessComplete
  } = props
  const [inputError, setInputError] = useState('')
  const [newFilecoinID, setNewFilecoinID] = useState('')
  const [popupMesssage, setPopupMessage] = useState<string | React.ReactElement>()
  const popupRef = useRef<UiPopupHandlers>()
  const UploadPopupMesssage = 'Uploading local files to Filecoin...'
  const txPopupMesssage = 'Sending transactions to register the Asset in the network...'
  const txAdditionalMessage =
    'Please sign the transactions with Metamask. It could take some time to complete, but you will be notified when the Asset has been published.'
  const confirmPopupMessage = 'Publish the new Asset?'
  const confirmPopupRef = useRef<UiPopupHandlers>()
  const [showForm, setShowForm] = useState(true)
  const subscriptionErrorText =
    "You don't have any current subscription. Only users with a subscription are allowed to publish"
  const assetOkMessage = 'Your Asset has been sucessfully Published'
  const { getCurrentUserSubscription } = useContext(User)

  useEffect(() => {
    if (isProcessing) {
      setShowForm(false)
      setIsProcessComplete(true)
    }
  }, [isProcessing])

  const checkValues = (): boolean => {
    if (!assetPublish.assetFiles || assetPublish.assetFiles.length == 0) {
      setInputError('Local File or Filecoin URL is required')
      return false
    }
    return true
  }

  const handlePreviousClick = (e: React.FormEvent<HTMLFormElement>) => {
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

    setPopupMessage(
      <div className={b('filecoin-container')}>
        <FilecoinLogoIcon className={b('filecoin-icon')} />
        <span className={b('filecoin_text')}>Getting info from Filecoin</span>
      </div>
    )
    popupRef.current?.open()
    await new Promise((f) => setTimeout(f, 500))

    const result = await checkFilecoinIdExists(newFilecoinID)
    if (!result[0]) {
      setInputError(
        'We could not find information of this file in Filecoin or IPFS. Make sure the ID is correct'
      )
      popupRef.current?.close()
      return
    }

    const assetFile: AssetFile = result[1]
    setNewFilecoinID('')
    updateFilesAdded(assetFile)
    setInputError('')

    popupRef.current?.close()
  }

  const confirm = () => {
    confirmPopupRef.current?.close()
    submit()
  }

  const cancel = () => {
    confirmPopupRef.current?.close()
  }

  const showConfirm = () => {
    if (!checkValues()) return

    if (!getCurrentUserSubscription()) {
      toast.error(subscriptionErrorText)
      return
    }
    confirmPopupRef.current?.open()
  }

  return (
    <>
      <ProgressPopup message={popupMesssage} image={<LoadingIcon />} popupRef={popupRef} />

      <ProgressPopup
        message={UploadPopupMesssage}
        popupRef={fileUploadPopupRef}
        image={<LoadingIcon />}
      />
      <ProgressPopup
        message={txPopupMesssage}
        popUpHeight="500px"
        additionalMessage={txAdditionalMessage}
        showCloseButton
        popupRef={txPopupRef}
        image={<LoadingIcon />}
      />
      <ConfirmPopup
        message={confirmPopupMessage}
        popupRef={confirmPopupRef}
        confirm={confirm}
        cancel={cancel}
      />

      {!showForm ? (
        // Asset published. Show result
        <div>
          <div className={step('step-title')}>
            <UiText className={step('step-title-text')} type="caps" wrapper="span">
              Asset Published
            </UiText>
          </div>
          <UiDivider type="l" />
          <UiFormGroup orientation={Orientation.Vertical}>
            <div className={b('user-publish-submit-container', ['updated-message'])}>
              <ProgressPopup
                image={resultOk ? <SuccessIcon /> : <NeverminedAbstractIcon />}
                popUpHeight="auto"
                message={resultOk ? assetOkMessage : errorAssetMessage}
                additionalMessage={filesUploadedMessage}
                popupRef={resultPopupRef}
                resultOk={resultOk}
                showCloseButton
              />
              <UiButton onClick={reset}>Publish New Asset</UiButton>
            </div>
          </UiFormGroup>
        </div>
      ) : (
        // Show form to add Files
        <>
          <div className={step('step-title')}>
            <span className={step('step-title-icon')}>3</span>
            <UiText className={step('step-title-text')} type="caps" wrapper="span">
              Asset File
            </UiText>
          </div>
          <UiDivider type="l" />
          <div className={b('form-input')}>
            <UiFormGroup orientation={Orientation.Vertical}>
              <UiFormItem
                className={b('publish-form-input')}
                label="Add New File from Filecoin"
                value={newFilecoinID}
                onClick={addFilecoinID}
                onChange={(e) => setNewFilecoinID(e.target.value)}
                placeholder="Type the Filecoin or IPFS ID of the file"
                disabled={false}
                inputError={inputError}
              />
            </UiFormGroup>
            <UiDivider type="l" />
            <div className={b('separator')}>OR</div>
            <UiDivider type="l" />
            <UiFormGroup orientation={Orientation.Vertical}>
              <UiFormInput
                id="computer"
                className={b('publish-form-input', ['button-only'])}
                type="file"
                label={
                  <div className={b('upload-button')}>
                    <span className={b('upload-text')}>Upload file</span>
                    <DownloadIcon className={b('upload-icon')} />
                  </div>
                }
                onChange={handleNewFile}
                placeholder="Select the file"
              />
              <UiDivider type="l" />
              {assetPublish.assetFiles.length > 0 && (
                <>
                  <div className={b('publish-current-files-container')}>
                    {assetPublish.assetFiles.map((assetfile) => (
                      <div className={b('publish-current-files')} key={assetfile.label}>
                        <UiFormItem
                          value={assetfile.label}
                          onClick={() => removeFile(assetfile.label)}
                          action={Action.Remove}
                          actionIcon={(action) => (
                            <>{action === 'remove' && <CrossIcon className={b('remove-icon')} />}</>
                          )}
                          disabled
                          readOnly
                        />
                      </div>
                    ))}
                  </div>
                  <UiDivider type="l" />
                </>
              )}
            </UiFormGroup>
            <UiFormGroup orientation={Orientation.Vertical}>
              <div className={b('user-publish-submit-container', ['submit'])}>
                <UiButton
                  type="secondary"
                  onClick={handlePreviousClick}
                  className={b('button', ['secondary'])}
                >
                  Back
                </UiButton>
                <UiButton onClick={showConfirm} className={b('button')}>
                  Publish Asset
                </UiButton>
              </div>
            </UiFormGroup>
          </div>
        </>
      )}
    </>
  )
}
