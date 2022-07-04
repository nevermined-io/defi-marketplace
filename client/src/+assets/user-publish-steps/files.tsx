import React, { useEffect, useContext, useState, useRef } from 'react'
import { UiFormGroup, UiFormInput, Orientation, UiButton, UiLayout, UiText, UiDivider, BEM, UiFormAddItem } from '@nevermined-io/styles'
import styles from './user-publish.module.scss'
import {UserPublishParams} from './main-page'
import { assetTypes } from 'src/config'
import {FileType, AssetFile, checkFilecoinIdExists} from './files-handler'

const b = BEM('user-publish', styles)

interface FilesProps {
    values: UserPublishParams
    prevStep: () => void
    nextStep: () => void 
    updateFilesAdded: (assetFiles: AssetFile) => void
    removeFile: (label:string) => void
 }


export const FilesStep = (props: FilesProps) => {
    
    const {values,  updateFilesAdded, removeFile, prevStep, nextStep } = props;    
    const [inputError, setInputError] = useState('') 
    const [newFilecoinID, setNewFilecoinID] = useState('')
    const [isFileAdded, setIsFileAdded] = useState(false)


    const checkValues = (): Boolean => {

        if (!values.asset_files || values.asset_files.length == 0) {
            setInputError('Local File  or Filecoin URL is required')
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


    const handleNewFile = function (e: React.ChangeEvent<HTMLInputElement>) {
       
        const file = e.target.files[0]
        const assetFile:AssetFile = {
            type: FileType.Local,
            name: file.name,
            label: file.name,
            size: String(file.size),
            content_type: file.type,
            file: file
        }

        setIsFileAdded(true) 
        updateFilesAdded(assetFile)
        setInputError('')
        
      };

    const addFilecoinID = async() => {

        if (!newFilecoinID)
            return
           
        const result = await checkFilecoinIdExists(newFilecoinID)
        if (!result[0]){
            setInputError('The filecoin ID was not found')
            return
        }

        const assetFile:AssetFile = result[1]

        setIsFileAdded(true)    
        setNewFilecoinID('')

        updateFilesAdded(assetFile)
        setInputError('')

    }

    return (
     
            <UiLayout type='container'>

                    <UiText type="h2" wrapper="h2">FILES - Step 3 of 4</UiText>
                    <div  className={b('publish-horizontal-line')}/>

                    <div  className={b('profile-horizontal-line')}/>
                               
                     <div>
                        <UiText type='h3'>Asset Files</UiText>
                    </div>
                    <div>
                        <UiText variants={['detail']}>Introduce a Filecoin ID or Upload a file from your computer to Filecoin </UiText>
                    </div>
         
                    <div className={b('publish-current-files-container')}>
                        {values.asset_files.map(assetfile => 
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
                            inputError = {inputError}
                        />
                    </UiFormGroup>

                  
                    
                    <UiDivider/>
                    <UiFormGroup orientation={Orientation.Vertical}>
                        <UiButton onClick={Previous}>&lt;</UiButton>
                        <UiButton onClick={Continue}>&gt;</UiButton>
                    </UiFormGroup>

            </UiLayout>
       
    )
}