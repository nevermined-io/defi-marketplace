import React, { useEffect, useContext, useState, useRef } from 'react'
import { User } from '../context'
import { Form, FormGroup, FormInput, FormAddItem, Orientation, UiButton, UiLayout, UiText, UiDivider, UiPopupHandlers, BEM } from 'ui'
import { NextPage } from 'next'
import { newLogin } from '../shared/utils'
import { NotificationPopup } from '../components'
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
    const [errorMessage, setErrorMessage] = useState('')
    const [isUpdated, setIsUpated] = useState(false)
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

    const [addresses, setAddresses] = useState<string[]>([])
    
    const closePopup = (event: any) => {
        popupRef.current?.close()
        event.preventDefault()
    }

    const onSubmitUserProfile = async() => {
        try {
            await sdk.profiles.update(userId, userProfile)
            setIsUpated(true)
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
        if(isUpdated) {
            setTimeout(() => {
                setIsUpated(false)
            }, 3000)
        }
    }, [isUpdated])

    useEffect(() => {
        (async () => {
            try {
                if(!account) {
                    return
                }
                
                const userProfileData = await sdk.profiles.findOneByAddress(account);
                setUserId(userProfileData.userId)
                setAddresses([...userProfileData.addresses])
                setUserProfile({
                    nickname: userProfileData.nickname,
                    name: userProfileData.name,
                    email: userProfileData.email,
                    additionalInformation: userProfileData.additionalInformation,
                })
            } catch (error) {
                setErrorMessage('Error of getting user profile')
                popupRef.current?.open()
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
                <Form className=''>
                    <FormGroup orientation={Orientation.Vertical}>
                        <FormInput
                            label='Nickname *'
                            value={userProfile.nickname} onChange={(e) => setUserProfile({...userProfile, nickname: e.target.value})}
                            placeholder='Type your nickname'
                        />
                    </FormGroup>
                    <FormGroup orientation={Orientation.Vertical}>
                        <FormInput
                            label='Name'
                            value={userProfile.name} onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                            placeholder='Type your name'
                        />
                    </FormGroup>
                    <FormGroup orientation={Orientation.Vertical}>
                        <FormInput
                            label='Email'
                            value={userProfile.email}
                            onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                            placeholder='Type your email'
                        />
                    </FormGroup>
                    <FormGroup orientation={Orientation.Vertical}>
                        <FormInput
                            label='Link Profile'
                            placeholder='Type your link profile'
                            value={(userProfile.additionalInformation as AdditionalInformation)?.linkedinProfile} onChange={(e) => setUserProfile({...userProfile, additionalInformation: {
                            linkedinProfile: e.target.value
                        }})}/>
                    </FormGroup>
                    <FormGroup orientation={Orientation.Vertical}>
                        <FormInput
                            label='Current Addresses'
                            value={addresses.join(', ')}
                            disabled
                        />
                        <UiText variants={['detail']}>Change your wallet account to add more address to your profile</UiText>
                    </FormGroup>
                    <FormGroup orientation={Orientation.Vertical} className={b('profile-add-address')}>
                        <FormAddItem
                            label='Add current address'
                            disabled={true}
                        />
                    </FormGroup>
                    
                    <div className={b('profile-submit-container')}>
                        <div className={b('profile-submit-container', ['updated-message'])}>
                            {isUpdated && <UiText type="h3" wrapper="h3" variants={['success']}>Your profile is updated successfully</UiText>}
                        </div>
                        <div className={b('profile-submit-container', ['submit'])}>
                            <UiButton onClick={onSubmitUserProfile}>Update Profile</UiButton>
                        </div>
                    </div>
                </Form>
            </UiLayout>
        </UiLayout>
    )
}