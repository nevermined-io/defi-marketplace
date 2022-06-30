import React, { useEffect, useContext, useState, useRef } from 'react'
import { UiFormGroup, UiFormInput, Orientation, UiButton, UiLayout, UiText, UiDivider, BEM, UiFormAddItem } from '@nevermined-io/styles'
import styles from './user-publish.module.scss'
import {UserPublishParams, FileType, AssetFile} from './main-page'
import { assetTypes } from 'src/config'

const b = BEM('user-publish', styles)

interface FilesProps {
    values: UserPublishParams
    prevStep: () => void
    nextStep: () => void 
    updateFilesAdded: (assetFiles: AssetFile) => void
 }


export const FilesStep = (props: FilesProps) => {
    
    const {values,  updateFilesAdded, prevStep, nextStep } = props;    
    const [inputError, setInputError] = useState('') 
    const [successMessage, setSuccessMessage] = useState('')
    const [newFilecoinID, setNewFilecoinID] = useState('')
    const [isFileAdded, setIsFileAdded] = useState(false)


    const handleNewFile = function (e: React.ChangeEvent<HTMLInputElement>) {
        console.log("handle file")
        const fileList = e.target.files;
         if (!fileList || !fileList[0]){
             alert("no files")
             return;
         } 
        
        const file = fileList[0]
        const assetFile:AssetFile = {
            type: FileType.Local,
            name: file.name,
            label: file.name,
            size: String(file.size),
            content_type: file.type
        }

        setIsFileAdded(true) 
        updateFilesAdded(assetFile)
        
      };

    const addFilecoinID = function() {

        if (!newFilecoinID)
            return
        // TODO: Check file exists

        const assetFile:AssetFile = {
            type: FileType.FilecoinID,
            label: newFilecoinID,
            filecoin_id: newFilecoinID
        }

        setIsFileAdded(true)    
        setNewFilecoinID('')

        updateFilesAdded(assetFile)

    }

    const checkValues = (): Boolean => {

        if (!values.file_id && !values.file_name) {
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


    return (
     
            <UiLayout type='container'>

                    <UiText type="h2" wrapper="h2">Storage - Step 3 of 4</UiText>
                    <div  className={b('publish-horizontal-line')}/>
            
                    <UiFormGroup orientation={Orientation.Vertical}>
                       
                        <UiFormAddItem
                                label='Add new file from Filecoin'
                                value={newFilecoinID}
                                onClick={addFilecoinID}
                                onChange={(e) => setNewFilecoinID(e.target.value)}
                                placeholder='Type the filecoin id for the file'
                                disabled={false}
                        />
                    </UiFormGroup>

                    {/*
                    <UiFormGroup orientation={Orientation.Vertical}>
                        <UiFormInput
                            className={b('publish-form-input')}
                            label='Sample File ID'
                            value={values.sample_file_id} onChange={e=> handleChange(e.target.value, 'sample_file_id')}
                            placeholder='Type the filecoin id for the sample file'
                        />
                    </UiFormGroup>
                    */}
                    <UiFormGroup orientation={Orientation.Vertical}>
                        <UiFormInput
                            className={b('publish-form-input')}
                            type = "file"
                            label='File'
                            onChange={handleNewFile}
                            placeholder='Select the file'
                        />
                    </UiFormGroup>

                    <div  className={b('profile-horizontal-line')}/>
                             
                    <div>
                        <UiText type='h3'>Asset Files</UiText>
                    </div>
                    <div>
                        <UiText variants={['detail']}>Introduce a Filecoin ID or Upload a file from your computer to Filecoin </UiText>
                    </div>

                    <div className={b('publish-current-files-container')}>
                        {values.asset_files.map(assetfile => 
                            <div key={assetfile.label} className={b('publish-current-files')}>
                                {assetfile.label}
                            </div>    
                        )}
                    </div>
                    
                    <UiDivider/>
                    <UiFormGroup orientation={Orientation.Vertical}>
                        <UiButton onClick={Previous}>&lt;</UiButton>
                        <UiButton onClick={Continue}>&gt;</UiButton>
                    </UiFormGroup>

            </UiLayout>
       
    )
}