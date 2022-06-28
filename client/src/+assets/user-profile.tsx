import React, { useEffect, useContext, useState, useRef } from 'react'
import { User } from '../context'
import { UiForm, UiFormGroup, UiFormInput, UiFormAddItem, Orientation, UiButton, UiLayout, UiText, UiDivider, UiPopupHandlers, NotificationPopup, BEM } from '@nevermined-io/styles'
import { NextPage } from 'next'
import { newLogin, StoreItemTypes } from '../shared'
import styles from './user-profile.module.scss'

const b = BEM('user-profile', styles)

interface AdditionalInformation {
    linkedinProfile: string
}

interface UserProfileParams {
    nickname: string
    name?: string
    email?: string
    additionalInformation?: unknown
}

export const UserProfile: NextPage = () => {
    const {sdk, account, loginMarketplaceAPI, web3 } = useContext(User)
    const [inputError, setInputError] = useState('') 
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [isUpdated, setIsUpated] = useState(false)
    const [isAddressAdded, setIsAddressAdded] = useState(false)
    const popupRef = useRef<UiPopupHandlers>()

    const [userId, setUserId] = useState('')
    const [userProfile, setUserProfile] = useState<UserProfileParams>({
        nickname: '',
        name: '',
        email: '',
        additionalInformation: {
            linkedinProfile: '',
        },
    })
    const [newAddress, setNewAddress] = useState('')

    const [addresses, setAddresses] = useState<string[]>([])
    
    const closePopup = (event: any) => {
        popupRef.current?.close()
        event.preventDefault()
    }

    const onAddAddress = async () => {
        try {
            const accounts = await sdk.accounts.list()
            const accountToAdd = accounts.find(a => a.getId().toLowerCase() === newAddress)
            const credential = await sdk.utils.jwt.generateClientAssertion(accountToAdd)
            const token = await sdk.marketplace.addNewAddress(credential)
            localStorage.setItem(StoreItemTypes.MarketplaceApiToken, token)
            setAddresses([...addresses, newAddress])
            setNewAddress('')
            setIsAddressAdded(true)
            setSuccessMessage('Address is added successfully')
        } catch (error: any) {
            if(error.message.includes('"statusCode":401')) {
                setErrorMessage('Your login is expired. Please change to the previous address, reload and sign again')
                localStorage.removeItem(StoreItemTypes.MarketplaceApiToken)
            }

            setErrorMessage(error.message)
            popupRef.current?.open()
        }
        
    }

    const onSubmitUserProfile = async() => {
        try {
            if (!userProfile.nickname) {
                setInputError('Nickname is required')
                return
            }
            await sdk.profiles.update(userId, userProfile)
            setIsUpated(true)
            setSuccessMessage('Your profile is updated successfully')
            setInputError('')
        } catch (error: any ) {
            if(error.message.includes('"statusCode":401')) {
                newLogin(sdk, loginMarketplaceAPI)
                setErrorMessage('Your login is expired. Please first sign with your wallet and after try again')
            } else {
                setErrorMessage(error.message)
            }
            
            popupRef.current?.open()
        }
    }

    useEffect(() => {
        if(isUpdated || isAddressAdded) {
            setTimeout(() => {
                setIsUpated(false)
                setIsAddressAdded(false)
                setSuccessMessage('')
            }, 3000)
        }
    }, [isUpdated, isAddressAdded])

    useEffect(() => {
        (async () => {
            try {
                if(!account) {
                    return
                }
                
                const userProfileData = await sdk.profiles.findOneByAddress(account);
                setUserId(userProfileData.userId)

                if(userProfileData.addresses.some(a => a.toLowerCase() === newAddress)) {
                    setNewAddress('')
                }

                setAddresses([...userProfileData.addresses])

                setUserProfile({
                    nickname: userProfileData.nickname,
                    name: userProfileData.name,
                    email: userProfileData.email,
                    additionalInformation: userProfileData.additionalInformation,
                });

                (window as any)?.ethereum?.on('accountsChanged', (accounts: string[]) => {
                    if(!addresses.some(a => a.toLowerCase() === accounts[0])) {
                        setNewAddress(accounts[0])
                    } else {
                        setNewAddress('')
                    }
                })

            } catch (error) {
                if(!newAddress) {
                    setErrorMessage('Error getting user profile')
                    popupRef.current?.open()
                }
            }
        })()
    }, [sdk.profiles, account])

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