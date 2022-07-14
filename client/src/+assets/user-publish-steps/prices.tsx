import React, { useEffect, useContext, useState, useRef } from 'react'
import { UiForm, UiFormGroup, UiFormInput, Orientation, UiButton, UiLayout, UiText, UiDivider, UiFormSelect, UiPopupHandlers, BEM } from '@nevermined-io/styles'
import {  Nft721ContractAddress, tier1NftContractAddress, tier2NftContractAddress, tier3NftContractAddress } from 'src/config'
import styles from './user-publish.module.scss'
import Catalog from 'components-catalog-nvm-test'
import {ProgressPopup} from './progress-popup' 
import {ConfirmPopup} from './confirm-popup'
import { Tier } from '../../shared'

const b = BEM('user-publish', styles)
const tiers: string[] = ["Tier 1", "Tier 2", "Tier 3"]

interface PricesProps {
    handleChange: (value: string, field: string) => void
    prevStep: () => void
    resetStepAndTier: () => void
    tier: Tier,
    successMessage: string
    txErrorMessage: string
    filesUploadedMessage: string[],
    fileUploadPopupRef: React.MutableRefObject<UiPopupHandlers | undefined>,
    txPopupRef:  React.MutableRefObject<UiPopupHandlers | undefined>
 }

export const PricesStep = (props: PricesProps) => {
    const {handleChange, prevStep, successMessage, txErrorMessage, filesUploadedMessage, fileUploadPopupRef, txPopupRef, tier } = props;
    const { isPublished, onSubmitUserPublish, reset, userPublish } = Catalog.useAssetPublish();
    const [inputError, setInputError] = useState('') 
    const UploadPopupMesssage = "Uploading local files to Filecoin..."
    const txPopupMesssage = "Sending transaction to register the Asset in the network..."
    const txAdditionalMessage = 'The transaction has been sent correctly. It could take some time to complete. You can close this window and visit your profile later to check the status of the new Asset.'            
    const confirmPopupMessage = "Press Confirm to Publish the new Asset"
    const uploadImage = '/assets/logos/filecoin_grey.svg'
    const txImage = '/assets/nevermined-color.svg'
    const confirmPopupRef = useRef<UiPopupHandlers>()

    const getNftTierAddress = (): string => {

        switch(tier) {
            case Tier.One: return tier1NftContractAddress 
            case Tier.Two: return tier2NftContractAddress
            case Tier.Three: return tier3NftContractAddress
            default: return Nft721ContractAddress
        }
    }

    const Previous = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        prevStep();
      }

    const confirm = () => {
        confirmPopupRef.current?.close()
        onSubmitUserPublish({ nftAddress: getNftTierAddress()})
    }

    const cancel = () => { 
        confirmPopupRef.current?.close()
    }

    const showConfirm = () => {
        confirmPopupRef.current?.open()
    }

    return (
     
            <UiLayout type='container'>
                    <ProgressPopup  message={UploadPopupMesssage} popupRef={fileUploadPopupRef} image= {uploadImage}/>
                    <ProgressPopup  message={txPopupMesssage} popUpHeight='780px' additionalMessage={txAdditionalMessage}  showCloseButton={true} popupRef={txPopupRef} image= {txImage}/>
                    <ConfirmPopup  message={confirmPopupMessage} popupRef={confirmPopupRef} confirm = {confirm} cancel = {cancel}/>
                    {(isPublished) ? 
                    <UiText type="h2" wrapper="h2">Asset Published</UiText>
                    :
                    <UiText type="h2" wrapper="h2">Subscription & Price - Step 4 of 4</UiText>
                    }
                    <div  className={b('publish-horizontal-line')}/>
                    <div className={b('form-input')}>
                    
                    <UiFormGroup orientation={Orientation.Vertical}>
                    {(isPublished) ? <div/> :
                    <UiFormSelect
                        value={tier}
                        onChange={e => handleChange(e, 'tier')}
                        options={tiers}
                        className={b('publish-form-select')}
                        label='Tier'
                        inputError={inputError}
                    /> 
                    }
                    </UiFormGroup>
                    {(isPublished) ? <div/> :
                    <UiFormGroup orientation={Orientation.Vertical}>
                        <UiFormInput
                            className={b('publish-form-input')}
                            label='Set Your Price (USDC)'
                            value={userPublish.price} onChange={e=>handleChange(e.target.value, 'price')}
                        />
                    </UiFormGroup>
                    }

                    <UiDivider/>
                    <UiFormGroup orientation={Orientation.Vertical}>
                            
                            {
                                (isPublished) ?  <div className={b('user-publish-submit-container', ['updated-message'])}>
                                                <UiText type="h3" wrapper="h3" variants={['success']}>{successMessage}</UiText> 
                                                <UiText type="h3" wrapper="h3" variants={['error']}>{txErrorMessage}</UiText>                                                 
                                                {filesUploadedMessage.map( (message, index) => 
                                                    <div key={index}>
                                                        <UiText type="h3" wrapper="h3" variants={['success']}>{message}</UiText>
                                                    </div>
                                                )}
                                                <UiDivider/>
                                                <UiDivider/>
                                                 <UiButton onClick={reset}>Publish New Asset</UiButton>
                                                </div>
                                                : 
                                                <div className={b('user-publish-submit-container',['submit'])}>
                                                <UiButton onClick={Previous}>&lt;</UiButton>
                                                <UiButton onClick={showConfirm}>Publish Asset</UiButton>
                                                </div>
                            }
                    
                    </UiFormGroup>
              </div>
            </UiLayout>
       
    )
}