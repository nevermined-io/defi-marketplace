import React, { useEffect, useContext, useState, useRef } from 'react'
import { UiFormGroup, UiFormInput, Orientation, UiButton, UiLayout, UiText, UiDivider, UiFormSelect, UiPopupHandlers, BEM } from '@nevermined-io/styles'
import {  Nft721ContractAddress, tier1NftContractAddress, tier2NftContractAddress, tier3NftContractAddress } from 'src/config'
import styles from './user-publish.module.scss'
import Catalog from 'components-catalog-nvm-test'
import {ProgressPopup} from './progress-popup' 
import {ConfirmPopup} from './confirm-popup'
import { Tier, AssetType } from '../../shared'
import { States } from '../../shared/constants'

const b = BEM('user-publish', styles)
const tiers: string[] = ["Tier 1", "Tier 2", "Tier 3"]

interface PricesProps {
    prevStep: () => void
    filesUploadedMessage: string[],
    fileUploadPopupRef: React.MutableRefObject<UiPopupHandlers | undefined>,
 }

export const PricesStep = (props: PricesProps) => {
    const { prevStep, filesUploadedMessage, fileUploadPopupRef } = props;
    const { isPublished, onSubmitAssetPublish, reset, errorAssetMessage, assetMesssage, setAssetErrorMessage, setAssetMessage, assetPublish, handleChange } = Catalog.useAssetPublish();
    const [inputError, setInputError] = useState('') 
    const UploadPopupMesssage = "Uploading local files to Filecoin..."
    const txAdditionalMessage = 'The transaction has been sent correctly. It could take some time to complete. You can close this window and visit your profile later to check the status of the new Asset.'            
    const confirmPopupMessage = "Press Confirm to Publish the new Asset"
    const uploadImage = '/assets/logos/filecoin_grey.svg'
    const txImage = '/assets/nevermined-color.svg'
    const confirmPopupRef = useRef<UiPopupHandlers>()
    const txPopupRef = useRef<UiPopupHandlers>()

    const handleCleanMessages = (messageStates: States) => {
        setTimeout(() => {
          messageStates.forEach((ms) => {
            if(ms[0]) {
              ms[1]('')
            }        
          })
        }, 5000);
    }
    
    const messageStates: States = [
        [assetMesssage, setAssetMessage],
        [errorAssetMessage, setAssetErrorMessage],
    ]

    useEffect(() => {
        handleCleanMessages(messageStates)
    }, [assetMesssage, errorAssetMessage, filesUploadedMessage])

    const getNftTierAddress = (): string => {

        switch(assetPublish.tier) {
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
        onSubmitAssetPublish({ nftAddress: getNftTierAddress()})
    }

    const cancel = () => { 
        confirmPopupRef.current?.close()
    }

    const showConfirm = () => {
        confirmPopupRef.current?.open()
    }

    useEffect(() => {
        if(!filesUploadedMessage?.length && isPublished){
            fileUploadPopupRef.current?.open()
        } else {
            fileUploadPopupRef.current?.close()
        }

        if(assetMesssage) {
            txPopupRef.current?.open()
        } else {
            txPopupRef.current?.close()
        }
    }, [filesUploadedMessage, assetMesssage])

    

    return (
     
            <UiLayout type='container'>
                    <ProgressPopup  message={UploadPopupMesssage} popupRef={fileUploadPopupRef} image= {uploadImage}/>
                    <ProgressPopup  message={assetMesssage} popUpHeight='780px' additionalMessage={txAdditionalMessage}  showCloseButton={true} popupRef={txPopupRef} image= {txImage}/>
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
                        value={assetPublish.tier}
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
                            value={assetPublish.price} onChange={e=>handleChange(e.target.value, 'price')}
                        />
                    </UiFormGroup>
                    }

                    <UiDivider/>
                    <UiFormGroup orientation={Orientation.Vertical}>
                            
                            {
                                (isPublished) ?  <div className={b('user-publish-submit-container', ['updated-message'])}>
                                                <UiText type="h3" wrapper="h3" variants={['success']}>{assetMesssage}</UiText> 
                                                <UiText type="h3" wrapper="h3" variants={['error']}>{errorAssetMessage}</UiText>                                                 
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