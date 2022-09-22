import React, { useState, useContext, useEffect } from 'react'
import {
  UiFormGroup,
  UiFormInput,
  UiFormTextarea,
  Orientation,
  UiButton,
  UiLayout,
  UiText,
  UiDivider,
  UiFormSelect,
  BEM
} from '@nevermined-io/styles'
import styles from './user-publish.module.scss'
import { AssetService } from '@nevermined-io/catalog-core'
import { User } from '../../context'
import { toast } from 'react-toastify'

const b = BEM('user-publish', styles)

interface BasicInfoProps {
  nextStep: () => void
}

export const BasicInfoStep = (props: BasicInfoProps) => {
  const { assetPublish, handleChange } = AssetService.useAssetPublish()
  const { nextStep } = props
  const [authorInputError, setAuthorInputError] = useState('')
  const [nameInputError, setNameInputError] = useState('')
  const [descriptionInputError, setDescriptionInputError] = useState('')
  const [subscriptionInputError, setSubscriptionInputError] = useState('')

  const { userSubscriptions, getCurrentUserSubscription} = useContext(User)
  const [tiers, setTiers] = useState<string[]>([])
  const subscriptionErrorText = "You don't have any current subscription. Only users with a subscription are allowed to publish"

  useEffect(() => {

    if (!getCurrentUserSubscription()) {
      setSubscriptionInputError(subscriptionErrorText)
      setTiers([])
      return
    }

    setTiers(userSubscriptions.filter(s => s.access == true).map(s => s.tier.toString()))
   
  }, [userSubscriptions])

  const checkValues = (): boolean => {
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
    e.preventDefault()

    if (!getCurrentUserSubscription()) {
      toast.error(subscriptionErrorText)
      return
    }

    if (!checkValues()) return

    nextStep()
  }

  return (
    <UiLayout type="container">
      <UiText type="h2" wrapper="h2">
        Basic Info - Step 1 of 3
      </UiText>
      <div className={b('publish-horizontal-line')} />

      <div className={b('form-input')}>
        <UiFormGroup orientation={Orientation.Vertical}>
          <UiFormInput
            className={b('publish-form-input')}
            label="Author *"
            inputError={authorInputError}
            value={assetPublish.author}
            onChange={(e) => handleChange(e.target.value, 'author')}
            placeholder="Type the author"
          />
        </UiFormGroup>
        <UiFormGroup orientation={Orientation.Vertical}>
          <UiFormInput
            className={b('publish-form-input')}
            label="Name *"
            inputError={nameInputError}
            value={assetPublish.name}
            onChange={(e) => handleChange(e.target.value, 'name')}
            placeholder="Type a name for the Asset"
          />
        </UiFormGroup>
        <UiFormGroup orientation={Orientation.Vertical}>
          <UiFormTextarea
            className={b('publish-form-input')}
            label="Description *"
            inputError={descriptionInputError}
            value={assetPublish.description}
            onChange={(e) => handleChange(e.target.value, 'description')}
            placeholder="Type a description"
          />
        </UiFormGroup>

        <div className={b('publish-horizontal-line')} />

        <UiFormGroup orientation={Orientation.Vertical}>
              <UiFormSelect
                value={assetPublish.tier}
                onChange={(e) => handleChange(e as string, 'tier')}
                options={tiers}
                className={b('publish-form-select')}
                label="Subscription"
                inputError={subscriptionInputError}
              />
        </UiFormGroup>

        <UiDivider />

        <UiFormGroup orientation={Orientation.Vertical}>
          <UiButton onClick={Continue}>&gt;</UiButton>
        </UiFormGroup>
      </div>
    </UiLayout>
  )
}
