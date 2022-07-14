import React, { useEffect, useRef } from 'react'
import Catalog from 'components-catalog-nvm-test'
import { UiForm, UiFormGroup, UiFormInput, UiFormAddItem, Orientation, UiButton, UiLayout, UiText, UiDivider, UiPopupHandlers, NotificationPopup, BEM } from '@nevermined-io/styles'
import { NextPage } from 'next'
import styles from './user-profile.module.scss'

const b = BEM('user-profile', styles)

interface AdditionalInformation {
    linkedinProfile: string
}

export const UserProfile: NextPage = () => {
    const { errorMessage, successMessage, inputError, isUpdated, isAddressAdded, setUserProfile, userProfile, addresses, newAddress, onSubmitUserProfile, onAddAddress  } = Catalog.useUserProfile();

    const popupRef = useRef<UiPopupHandlers>()
    
    const closePopup = (event: any) => {
        popupRef.current?.close()
        event.preventDefault()
    }

    useEffect(() => {
        if(errorMessage) {
            popupRef.current?.open()
        }

    }, [errorMessage])

    return (
        <UiLayout type='container'>
            <NotificationPopup closePopup={closePopup} message={errorMessage} popupRef={popupRef}/>
            <UiLayout type='container'>
                <UiText wrapper="h1" type="h1" variants={['heading']}>User Profile account</UiText>
                <UiText type="h2" wrapper="h2">Update your profile</UiText>
            </UiLayout>
            <UiDivider/>
            <UiLayout type='container'>
                <div  className={b('profile-horizontal-line')}/>
                <UiForm>
                    <UiFormGroup orientation={Orientation.Vertical}> 
                        <UiFormInput
                            className={b('profile-form-input')}
                            label='Nickname *'
                            inputError={inputError}
                            value={userProfile.nickname} onChange={(e) => setUserProfile({...userProfile, nickname: e.target.value})}
                            placeholder='Type your nickname'
                        />
                    </UiFormGroup>
                    <UiFormGroup orientation={Orientation.Vertical}>
                        <UiFormInput
                            className={b('profile-form-input')}
                            label='Name'
                            value={userProfile.name} onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                            placeholder='Type your name'
                        />
                    </UiFormGroup>
                    <UiFormGroup orientation={Orientation.Vertical}>
                        <UiFormInput
                            className={b('profile-form-input')}
                            label='Email'
                            value={userProfile.email}
                            onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                            placeholder='Type your email'
                        />
                    </UiFormGroup>
                    <UiFormGroup orientation={Orientation.Vertical}>
                        <UiFormInput
                            className={b('profile-form-input')}
                            label='Link Profile'
                            placeholder='Type your link profile'
                            value={(userProfile.additionalInformation as AdditionalInformation)?.linkedinProfile} onChange={(e) => setUserProfile({...userProfile, additionalInformation: {
                            linkedinProfile: e.target.value
                        }})}/>
                    </UiFormGroup>
                    <div className={b('profile-submit-container')}>
                        <div className={b('profile-submit-container', ['updated-message'])}>
                            {(isUpdated) ? <UiText type="h3" wrapper="h3" variants={['success']}>{successMessage}</UiText> : null}
                        </div>
                        <div className={b('profile-submit-container', ['submit'])}>
                            <UiButton onClick={onSubmitUserProfile}>Update Profile</UiButton>
                        </div>
                    </div>
                </UiForm>
            </UiLayout>
            <UiLayout type='container' className={b('profile-addresses')}>
                <UiText type="h2" wrapper="h2">Addresses</UiText>
                <div  className={b('profile-horizontal-line')}/>
                <UiForm>                  
                    <div>
                        <UiText type='h3'>Current Addresses</UiText>
                    </div>
                    <div>
                        <UiText variants={['detail']}>Change your wallet account to add more address to your profile</UiText>
                    </div>

                    <div className={b('profile-current-addresses-container')}>
                        {addresses.map(a => 
                            <div key={a} className={b('profile-current-address')}>
                                {a}
                            </div>    
                        )}
                    </div>
                    

                    {newAddress && 
                        <UiFormGroup orientation={Orientation.Vertical} className={b('profile-add-address')}>
                            <UiFormAddItem
                                label='Add new address'
                                value={newAddress}
                                onClick={onAddAddress}
                                disabled={true}
                            />
                        </UiFormGroup>
                    }

                    <div className={b('profile-submit-container')}>
                        <div className={b('profile-submit-container', ['updated-message'])}>
                            {(isAddressAdded) ? <UiText type="h3" wrapper="h3" variants={['success']}>{successMessage}</UiText> : null}
                        </div>
                    </div>
                </UiForm>
            </UiLayout>
        </UiLayout>
    )
}