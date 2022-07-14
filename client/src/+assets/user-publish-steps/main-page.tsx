import React, { useState, useRef } from 'react'
import { UiForm, UiLayout, UiText, UiPopupHandlers, NotificationPopup, BEM } from '@nevermined-io/styles'
import Catalog from 'components-catalog-nvm-test'
import { NextPage } from 'next'
import styles from './user-publish.module.scss'
import { BasicInfoStep } from './basic-info'
import { DetailsStep } from './details'
import { PricesStep } from './prices'
import { FilesStep } from './files'
import { Tier } from '../../shared';

export const UserPublishMultiStep: NextPage = () => {
    const { updateFilesAdded, removeFile, onSubmitUserPublish, assetMesssage, errorAssetMessage, filesUploadedMessage, userPublish, isPublished, reset, handleChange} = Catalog.useAssetPublish()
    const [step, setStep] = useState<number>(1)
    const [tier, setTier] = useState<Tier>(Tier.One)
    const popupRef = useRef<UiPopupHandlers>()
    const fileUploadPopupRef = useRef<UiPopupHandlers>()
    const txPopupRef = useRef<UiPopupHandlers>()

    const resetStepAndTier = () => {
        setStep(1)
        setTier(Tier.One)
    }

    const prevStep = () => {
        setStep(step - 1)
    }

    const nextStep = () => {
        setStep(step + 1)
    }
    
    const closePopup = (event: any) => {
        popupRef.current?.close()
        event.preventDefault()
    }
   
    switch(step) {
        case 1: 
          return (
            <UiLayout type='container'>
            <NotificationPopup closePopup={closePopup} message={errorAssetMessage} popupRef={popupRef}/>
            <UiLayout type='container'>
                <UiText wrapper="h1" type="h1" variants={['heading']}>Publish new asset</UiText>        
            </UiLayout>
           
            <UiLayout type='container'>
                <UiForm className=''>
                    <BasicInfoStep
                        nextStep={ nextStep }
                        handleChange={ handleChange }
                        values={ userPublish }
                    />
                </UiForm>
            </UiLayout>
        </UiLayout>
          )
        case 2: 
          return (
            <UiLayout type='container'>
            <NotificationPopup closePopup={closePopup} message={errorAssetMessage} popupRef={popupRef}/>
            <UiLayout type='container'>
                <UiText wrapper="h1" type="h1" variants={['heading']}>Publish new asset</UiText>
            </UiLayout>
            <UiLayout type='container'>
                <UiForm className=''>
                    <DetailsStep
                         prevStep={ prevStep}
                         nextStep={ nextStep }
                    />
                </UiForm>
            </UiLayout>
        </UiLayout>
          )
        case 3: 
          return (
            <UiLayout type='container'>
            <NotificationPopup closePopup={closePopup} message={errorAssetMessage} popupRef={popupRef}/>
            <UiLayout type='container'>
                <UiText wrapper="h1" type="h1" variants={['heading']}>Publish new asset</UiText>
            </UiLayout>
           
            <UiLayout type='container'>
                <UiForm className=''>
                    <FilesStep
                         prevStep={ prevStep}
                         nextStep={ nextStep }
                         values={ userPublish }
                         updateFilesAdded = {updateFilesAdded}
                         removeFile = {removeFile}
                    />
                </UiForm>
            </UiLayout>
        </UiLayout>
          )
        case 4: 
          return (
            <UiLayout type='container'>
            <NotificationPopup closePopup={closePopup} message={errorAssetMessage} popupRef={popupRef}/>
            <UiLayout type='container'>
                <UiText wrapper="h1" type="h1" variants={['heading']}>Publish new asset</UiText>
            </UiLayout>
           
            <UiLayout type='container'>
                <UiForm className=''>
                    <PricesStep
                         prevStep={ prevStep }
                         resetStepAndTier= { resetStepAndTier }
                         handleChange={ handleChange }
                         tier={tier}
                         successMessage={assetMesssage}
                         txErrorMessage={errorAssetMessage}
                         filesUploadedMessage = {filesUploadedMessage}
                         fileUploadPopupRef = {fileUploadPopupRef}
                         txPopupRef = {txPopupRef}
                    />
                </UiForm>
            </UiLayout>
        </UiLayout>
          )
          default: 
          // do nothing
    }
    
}