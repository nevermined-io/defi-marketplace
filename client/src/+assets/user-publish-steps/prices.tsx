import React, { useEffect, useState, useRef, useContext } from 'react'
import {
  UiFormGroup,
  UiFormInput,
  Orientation,
  UiButton,
  UiLayout,
  UiText,
  UiDivider,
  UiFormSelect,
  UiPopupHandlers,
  BEM
} from '@nevermined-io/styles'
import styles from './user-publish.module.scss'
import { ProgressPopup } from './progress-popup'
import { ConfirmPopup } from './confirm-popup'
import { ResultPopup } from './result-popup'
import { AssetService } from '@nevermined-io/catalog-core'
import { User } from '../../context'
import { toast } from '../../components'
import FilecoinLogoIcon from '../../../public/assets/logos/filecoin_grey.svg'
import NeverminedAbstractIcon from '../../../public/assets/nevermined-abstract.svg'

const b = BEM('user-publish', styles)

interface PricesProps {
  prevStep: () => void
  submit: () => void
  reset: () => void
  filesUploadedMessage: string[]
  fileUploadPopupRef: React.MutableRefObject<UiPopupHandlers | undefined>
  txPopupRef: React.MutableRefObject<UiPopupHandlers | undefined>
  resultOk: boolean
  resultPopupRef: React.MutableRefObject<UiPopupHandlers | undefined>
}

export const PricesStep = (props: PricesProps) => {
  const { assetPublish, handleChange, isProcessing, assetMessage, errorAssetMessage } =
    AssetService.useAssetPublish()
  const {
    prevStep,
    submit,
    reset,
    filesUploadedMessage,
    fileUploadPopupRef,
    txPopupRef,
    resultOk,
    resultPopupRef
  } = props
  const [inputError, setInputError] = useState('')
  const UploadPopupMesssage = 'Uploading local files to Filecoin...'
  const txPopupMesssage = 'Sending transaction to register the Asset in the network...'
  const txAdditionalMessage =
    'The transaction has been sent correctly. It could take some time to complete. You can close this window and visit your profile later to check the status of the new Asset.'
  const confirmPopupMessage = 'Press Confirm to Publish the new Asset'
  const confirmPopupRef = useRef<UiPopupHandlers>()
  const [showForm, setShowForm] = useState(true)
  const { userSubscriptions, getCurrentUserSubscription } = useContext(User)
  const [tiers, setTiers] = useState<string[]>([])
  const subscriptionErrorText =
    "You don't have any current subscription. Only users with a subscription are allowed to publish"

  useEffect(() => {
    if (!getCurrentUserSubscription()) {
      setInputError(subscriptionErrorText)
      setTiers([])
      return
    }

    setTiers(userSubscriptions.filter((s) => s.access == true).map((s) => s.tier.toString()))
  }, [userSubscriptions])

  useEffect(() => {
    if (isProcessing == true) {
      setShowForm(false)
    }
  }, [isProcessing])

  const Previous = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    prevStep()
  }

  const confirm = () => {
    confirmPopupRef.current?.close()
    submit()
  }

  const cancel = () => {
    confirmPopupRef.current?.close()
  }

  const showConfirm = () => {
    if (!getCurrentUserSubscription()) {
      toast.error(subscriptionErrorText)
      return
    }
    confirmPopupRef.current?.open()
  }

  return (
    <UiLayout type="container">
      <ProgressPopup
        message={UploadPopupMesssage}
        popupRef={fileUploadPopupRef}
        image={<FilecoinLogoIcon />}
      />
      <ProgressPopup
        message={txPopupMesssage}
        popUpHeight="780px"
        additionalMessage={txAdditionalMessage}
        showCloseButton={true}
        popupRef={txPopupRef}
        image={<NeverminedAbstractIcon />}
      />
      <ConfirmPopup
        message={confirmPopupMessage}
        popupRef={confirmPopupRef}
        confirm={confirm}
        cancel={cancel}
      />
      {!showForm ? (
        <UiText type="h2" wrapper="h2">
          Asset Published
        </UiText>
      ) : (
        <UiText type="h2" wrapper="h2">
          Subscription & Price - Step 4 of 4
        </UiText>
      )}
      <div className={b('publish-horizontal-line')} />
      <div className={b('form-input')}>
        {showForm ? (
          <div>
            <UiFormGroup orientation={Orientation.Vertical}>
              <UiFormSelect
                value={assetPublish.tier}
                onChange={(e) => handleChange(e as string, 'tier')}
                options={tiers}
                className={b('publish-form-select')}
                label="Tier"
                inputError={inputError}
              />
            </UiFormGroup>
            <UiFormGroup orientation={Orientation.Vertical}>
              <UiFormInput
                className={b('publish-form-input')}
                label="Set Your Price (USDC)"
                value={assetPublish.price}
                onChange={(e) => handleChange(e.target.value, 'price')}
              />
            </UiFormGroup>
          </div>
        ) : null}
        <UiDivider />
        <UiFormGroup orientation={Orientation.Vertical}>
          {!showForm ? (
            <div className={b('user-publish-submit-container', ['updated-message'])}>
              <ResultPopup
                message={resultOk ? assetMessage : errorAssetMessage}
                additionalMessage={filesUploadedMessage}
                popupRef={resultPopupRef}
                resultOk={resultOk}
              />
              <UiButton onClick={reset}>Publish New Asset</UiButton>
            </div>
          ) : (
            <div className={b('user-publish-submit-container', ['submit'])}>
              <UiButton onClick={Previous}>&lt;</UiButton>
              <UiButton onClick={showConfirm}>Publish Asset</UiButton>
            </div>
          )}
        </UiFormGroup>
      </div>
    </UiLayout>
  )
}
