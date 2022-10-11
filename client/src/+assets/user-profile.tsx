import React, { useEffect, useRef } from 'react'
import { AccountService } from '@nevermined-io/catalog-core'
import { MetaMask } from '@nevermined-io/catalog-providers'
import {
  UiForm,
  UiFormGroup,
  UiFormInput,
  UiFormItem,
  Orientation,
  UiButton,
  UiLayout,
  UiText,
  UiDivider,
  UiPopupHandlers,
  NotificationPopup,
  BEM
} from '@nevermined-io/styles'
import styles from './user-profile.module.scss'

const b = BEM('user-profile', styles)

interface AdditionalInformation {
  linkedinProfile: string
}

export const UserProfile = () => {
  const { walletAddress } = MetaMask.useWallet()
  const {
    errorMessage,
    successMessage,
    inputError,
    isUpdated,
    isAddressAdded,
    setUserProfile,
    userProfile,
    addresses,
    newAddress,
    submitUserProfile,
    addAddress, 
    isTokenGenerated
  } = AccountService.useUserProfile(walletAddress)

  const popupRef = useRef<UiPopupHandlers>()

  const closePopup = (event: any) => {
    popupRef.current?.close()
    event.preventDefault()
  }

  useEffect(() => {
    if (errorMessage) {
      popupRef.current?.open()
    }
  }, [errorMessage])

  useEffect(() => {
    if (isTokenGenerated) {
      popupRef.current?.close()
    }
  }, [isTokenGenerated])

  return (
    <UiLayout type="container">
      <NotificationPopup closePopup={closePopup} message={errorMessage} popupRef={popupRef} />
      <UiLayout type="container">
        <UiText wrapper="h1" type="h3" variants={['heading']}>
          User Profile account
        </UiText>
        <UiText type="h3" wrapper="h3" className={b('subheader')}>
          Update your profile
        </UiText>
      </UiLayout>
      <UiDivider />
      <UiLayout type="container">
        <div className={b('profile-horizontal-line')} />
        <UiForm>
          <div className={b('row')}>
            <div className={b('columnleft')}>
              <UiFormGroup orientation={Orientation.Vertical}>
                <UiFormInput
                  className={b('profile-form-input')}
                  label="Nickname *"
                  inputError={inputError}
                  value={userProfile.nickname}
                  onChange={(e) => setUserProfile({ ...userProfile, nickname: e.target.value })}
                  placeholder="Type your nickname"
                />
              </UiFormGroup>
              <UiFormGroup orientation={Orientation.Vertical}>
                <UiFormInput
                  className={b('profile-form-input')}
                  label="Email"
                  value={userProfile.email}
                  onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                  placeholder="Type your email"
                />
              </UiFormGroup>
            </div>
            <div className={b('columnright')}>
              <UiFormGroup orientation={Orientation.Vertical}>
                <UiFormInput
                  className={b('profile-form-input')}
                  label="Name"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                  placeholder="Type your name"
                />
              </UiFormGroup>
              <UiFormGroup orientation={Orientation.Vertical}>
                <UiFormInput
                  className={b('profile-form-input')}
                  label="Link Profile"
                  placeholder="Type your link profile"
                  value={
                    (userProfile.additionalInformation as AdditionalInformation)?.linkedinProfile
                  }
                  onChange={(e) =>
                    setUserProfile({
                      ...userProfile,
                      additionalInformation: {
                        linkedinProfile: e.target.value
                      }
                    })
                  }
                />
              </UiFormGroup>
            </div>
          </div>
          <div className={b('profile-submit-container')}>
            <div className={b('profile-submit-container', ['updated-message'])}>
              {isUpdated ? (
                <UiText type="h3" wrapper="h3" variants={['success']}>
                  {successMessage}
                </UiText>
              ) : null}
            </div>
            <div className={b('profile-submit-container', ['submit'])}>
              <UiButton onClick={submitUserProfile}>Update Profile</UiButton>
            </div>
          </div>
        </UiForm>
      </UiLayout>
      <UiLayout type="container" className={b('profile-addresses')}>
        <UiForm>
          <div>
            <UiText type="h3" className={b('addresses-header')}>
              Current Addresses
            </UiText>
          </div>
          <div>
            <UiText variants={['detail']} className={b('addresses-detail')}>
              Change your wallet account to add more address to your profile
            </UiText>
          </div>
          <div className={b('profile-horizontal-line')} />
          <div className={b('profile-current-addresses-container')}>
            {addresses.map((a) => (
              <div key={a} className={b('profile-current-address')}>
                {a}
              </div>
            ))}
          </div>

          {newAddress && (
            <UiFormGroup orientation={Orientation.Vertical} className={b('profile-add-address')}>
              <UiFormItem
                label="Add new address"
                value={newAddress}
                onClick={addAddress}
                disabled={true}
              />
            </UiFormGroup>
          )}

          <div className={b('profile-submit-container')}>
            <div className={b('profile-submit-container', ['updated-message'])}>
              {isAddressAdded ? (
                <UiText type="h3" wrapper="h3" variants={['success']}>
                  {successMessage}
                </UiText>
              ) : null}
            </div>
          </div>
        </UiForm>
      </UiLayout>
    </UiLayout>
  )
}
