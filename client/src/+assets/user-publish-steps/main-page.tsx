import React, { useState, useRef, useEffect } from 'react'
import { UiForm, UiLayout, UiText, UiPopupHandlers, NotificationPopup, BEM } from '@nevermined-io/styles'
import Catalog from 'components-catalog-nvm-test'
import { NextPage } from 'next'
import { BasicInfoStep } from './basic-info'
import { DetailsStep } from './details'
import { PricesStep } from './prices'
import { FilesStep } from './files'

export const UserPublishMultiStep: NextPage = () => {
    const { errorAssetMessage, filesUploadedMessage, setAssetPublish, assetPublish } = Catalog.useAssetPublish()
    const [step, setStep] = useState<number>(1)
    const popupRef = useRef<UiPopupHandlers>()
    const fileUploadPopupRef = useRef<UiPopupHandlers>()

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

    useEffect(() => {
        if(errorAssetMessage) {
            popupRef.current?.open()
        } else {
            popupRef.current?.close()
        }
    }, [errorAssetMessage])
   
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
                        filesUploadedMessage = {filesUploadedMessage}
                        fileUploadPopupRef = {fileUploadPopupRef}
                    />
                </UiForm>
            </UiLayout>
        </UiLayout>
          )
          default: 
          // do nothing
    }
    
}