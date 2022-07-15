import React, { useState, useRef, useEffect } from 'react'
import { UiFormGroup, UiFormInput, Orientation, UiButton, UiLayout, UiText, UiDivider, BEM, UiFormAddItem, UiPopupHandlers } from '@nevermined-io/styles'
import styles from './user-publish.module.scss'
import {ProgressPopup} from './progress-popup'
import Catalog from 'components-catalog-nvm-test'
import { AssetPublishParams } from 'components-catalog-nvm-test/dist/node/types'
import { AssetType } from '../../shared';

const b = BEM('user-publish', styles)

interface FilesProps {
    prevStep: () => void
    nextStep: () => void
 }

export const FilesStep = (props: FilesProps) => {
    const { prevStep, nextStep } = props;
    const { newFilecoinID, addFilecoinID, handleNewFile, removeFile, setNewFilecoinID, assetMesssage, errorAssetMessage, setAssetErrorMessage, assetPublish } = Catalog.useAssetPublish()
    const popupRef = useRef<UiPopupHandlers>()
    const filecoinImage = '/assets/logos/filecoin_grey.svg'

    const checkValues = (): Boolean => {
        if (!assetPublish.asset_files || assetPublish.asset_files.length == 0) {
            setAssetErrorMessage('Local File  or Filecoin URL is required')
            return false
        }

        return true      
    }
    
    const Continue = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!checkValues())
            return;
        nextStep();
      }
    
    const Previous = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        prevStep();
    }

    useEffect(() => {
        if(assetMesssage) {
            popupRef.current?.open()
        } else {
            popupRef.current?.close()
        }
    }, [assetMesssage])

    return (
     
            <UiLayout type='container'>
                    <ProgressPopup message={assetMesssage} image={filecoinImage} popupRef={popupRef}/>

                    <UiText type="h2" wrapper="h2">FILES - Step 3 of 4</UiText>
                    <div  className={b('publish-horizontal-line')}/>
                               
                     <div>
                        <UiText type='h3'>Asset Files</UiText>
                    </div>
                    <div>
                        <UiText variants={['detail']}>Introduce a Filecoin ID or Upload a file from your computer to Filecoin </UiText>
                    </div>

                    <div className={b('form-input')}>
         
                    <div className={b('publish-current-files-container')}>
                        {assetPublish.asset_files.map(assetfile => 
                            <div className={b('publish-current-files')} key={assetfile.label}>
                                      
                                <UiFormAddItem
                                    value={assetfile.label}
                                    onClick={(e) => removeFile(assetfile.label)}
                                    disable={true}
                                    readOnly={true}
                                    onChange={()=>{}}
                                />  
                            </div>
                        )}
                    </div>

                    <UiDivider></UiDivider>
                    <UiDivider></UiDivider>
            
                    <UiFormGroup orientation={Orientation.Vertical}>
                       
                        <UiFormAddItem
                                className={b('publish-form-input')}
                                label='Add New File from Filecoin'
                                value={newFilecoinID}
                                onClick={addFilecoinID}
                                onChange={(e) => setNewFilecoinID(e.target.value)}
                                placeholder='Type the Filecoin or IPFS ID of the file'
                                disabled={false}
                        />
                    </UiFormGroup>
                   
                    <UiFormGroup orientation={Orientation.Vertical}>
                        <UiFormInput
                            className={b('publish-form-input')}
                            type = "file"
                            label='Upload from your computer'
                            onChange={handleNewFile}
                            placeholder='Select the file'
                            inputError = {errorAssetMessage}
                        />
                    </UiFormGroup>

                  
                    
                    <UiDivider/>
                    <UiFormGroup orientation={Orientation.Vertical}>
                        <UiButton onClick={Previous}>&lt;</UiButton>
                        <UiButton onClick={Continue}>&gt;</UiButton>
                    </UiFormGroup>
                </div>

            </UiLayout>
       
    )
}