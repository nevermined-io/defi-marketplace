import React, { useEffect, useContext, useState, useRef } from 'react'
import { User } from '../../context'
import { UiForm, UiButton, UiLayout, UiText, UiPopupHandlers, NotificationPopup, BEM } from '@nevermined-io/styles'
import { NextPage } from 'next'
import { newLogin, StoreItemTypes } from '../../shared'
import styles from './user-publish.module.scss'
import { MetaData, Nevermined } from "@nevermined-io/nevermined-sdk-js"
import AssetRewards from "@nevermined-io/nevermined-sdk-js/dist/node/models/AssetRewards";
import BigNumber from "bignumber.js";
import {  Nft721ContractAddress, tier1NftContractAddress, tier2NftContractAddress, tier3NftContractAddress, gatewayURL, filecoinUploadUri } from 'src/config'
import axios from "axios";
import { BasicInfoStep } from './basic-info'
import { DetailsStep } from './details'
import { PricesStep } from './prices'
import { FilesStep } from './files'


const b = BEM('user-publish', styles)
const tiers: string[] = ["Tier 1", "Tier 2", "Tier 3"]


export interface UserPublishParams {
    step: number
    name: string
    author: string
    description: string
    type: string
    category: string
    protocol: string
    file_id: string
    sample_file_id?: string
    network: string
    price: number
    tier: string
    file_name: string
    file_size: string
    file_type: string
    asset_files: AssetFile[]
}

export enum FileType {
    FilecoinID = "Filecoin",
    Local =  "Local"
}

export interface AssetFile {
    type: FileType
    label: string
    name?: string
    size?:string
    content_type?: string
    file?: File
    filecoin_id?: string
}

export const UserPublishMultiStep: NextPage = () => {

    const {sdk, account, userProfile, loginMarketplaceAPI, web3 } = useContext(User)
    const [inputError, setInputError] = useState('') 
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [isPublished, setIsPublished] = useState(false)
    const popupRef = useRef<UiPopupHandlers>()

    const [userId, setUserId] = useState('')
    const [userPublish, setUserPublish] = useState<UserPublishParams>({
        step: 1,
        name: '',
        author: '',
        description: '',
        type: 'dataset',
        category: 'None',
        protocol: 'None',
        file_id: '',
        sample_file_id: '',
        network: 'None',
        price: 0,
        tier: 'Tier 1',
        file_name: '',
        file_size: '',
        file_type: '',
        asset_files: []
    })

    const [fileSelected, setFileSelected] = useState<File>()
    const [assetfiles, setAssetFiles] = useState<AssetFile[]>([])

    // go back to previous step
    const prevStep = () => {
        const { step } = userPublish;
        setUserPublish({ ...userPublish, step: step - 1 });
    }

    // proceed to the next step
    const nextStep = () => {
        const { step } = userPublish;
        setUserPublish({ ...userPublish, step: step  + 1 });
    }

    // Handle fields change
    const handleChange =   function (value: string, input:string) {
        setUserPublish({ ...userPublish, [input]: value });
    }
    
    const closePopup = (event: any) => {
        popupRef.current?.close()
        event.preventDefault()
    }


    const generateMetadata = () => {

        const metadata = {
            main: {
                name: userPublish.name,
                dateCreated: new Date().toISOString().replace(/\.[0-9]{3}/, ''),
                author: userPublish.author,
                license: 'CC0: Public Domain', // ??
                price: String(userPublish.price),
                datePublished: new Date().toISOString().replace(/\.[0-9]{3}/, ''),
                type: userPublish.type,
                network: userPublish.network,
                files: [
                    {
                        index: 1,
                        contentType: userPublish.file_type,
                        url: userPublish.file_id,
                        contentLength: userPublish.file_size,
                    }
                ]
            },
            additionalInformation: {
                description: userPublish.description,
                categories: [`ProtocolType:${userPublish.category}`,
                `EventType:${userPublish.protocol}`,
                `Blockchain:${userPublish.network}`,
                `UseCase:defi-datasets`,
                `Version:v1`
                ],
                blockchain: userPublish.network,
                version: "v1",
                source: "filecoin",
                file_name: userPublish.file_name
            }
        } as MetaData
    
        return metadata
    }

    const getNftTierAddress = (): string => {

        switch(userPublish.tier) {
            case "Tier 1": return tier1NftContractAddress 
            case "Tier 2": return tier2NftContractAddress
            case "Tier 3": return tier3NftContractAddress
            default: return Nft721ContractAddress
        }
    }

    const onSubmitUserPublish = async() => {
        try {

            let filecoin_url
                
            if (userPublish.file_id && !fileSelected){
                /* TODO - Get info from Filecoin??
                validate is valid filecoin id
                get file_name, file_size and file_type from filecoin?
                */
                userPublish.file_name= "Filecoin File.csv"
                userPublish.file_size = "0"
                userPublish.file_type = "text/csv"
            }else {
                filecoin_url = await uploadFileToFilecoin()
                userPublish.file_id = filecoin_url

            }          

            const metadata = generateMetadata()
            console.log(JSON.stringify(metadata))

             // variable account in UserProvider stores only the address!
            const accounts = await sdk.accounts.list()
            const user_account = await accounts[0]
            const user_address = user_account.getId() 
            
            const assetRewards = new AssetRewards(user_address, new BigNumber(userPublish.price))
            const ddo = await sdk.nfts.create721(
                metadata,
                user_account,
                assetRewards,
                getNftTierAddress()
            )

            let did
            if (ddo) {
                did = ddo.id
            }
        
            setIsPublished(true)
            var message = 'Your Asset has been published successfully. DID: ' + did 
            if (fileSelected) 
                message = message.concat(" - Filecoin ID: " + filecoin_url)
            setSuccessMessage(message)
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
   
    const handleFileChange = function (e: React.ChangeEvent<HTMLInputElement>) {
        const fileList = e.target.files;
         if (!fileList || !fileList[0]){
             setFileSelected(undefined)
             return;
         } 
        
        const file = fileList[0]
        setFileSelected(file);

        userPublish.file_name = file.name
        userPublish.file_size = String(file.size)
        userPublish.file_type = file.type  
        
      };

     
    const handlePostRequest = async (url:string, formData: FormData) => {
            
        const response = await axios.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data
      };
    
    const uploadFileToFilecoin = async () => {
        if (fileSelected) {
            
            const form = new FormData()
            form.append('file', fileSelected)
        
            const gatewayUploadUrl = gatewayURL + filecoinUploadUri
            const response = await handlePostRequest(gatewayUploadUrl, form)    
            return response.url;
        }

        return userPublish.file_id
    };

    const updateFilesAdded = (assetFile: AssetFile) => {
        const arrayFiles: AssetFile[] = userPublish.asset_files
        setUserPublish({...userPublish, asset_files: [...arrayFiles, assetFile] })
    }

    const removeFile = (label: string) => {
        const arrayFiles: AssetFile[] = userPublish.asset_files

        const indexOfObject = arrayFiles.findIndex((assetFile) => {
            return assetFile.label === label;
          });

        if (indexOfObject !== -1) {
            arrayFiles.splice(indexOfObject, 1);
            setUserPublish({...userPublish, asset_files: [...arrayFiles] })
          }

       
    }
   
    switch(userPublish.step) {
        case 1: 
          return (
            <UiLayout type='container'>
            <NotificationPopup closePopup={closePopup} message={errorMessage} popupRef={popupRef}/>
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
            <NotificationPopup closePopup={closePopup} message={errorMessage} popupRef={popupRef}/>
            <UiLayout type='container'>
                <UiText wrapper="h1" type="h1" variants={['heading']}>Publish new asset</UiText>
               
            </UiLayout>
           
            <UiLayout type='container'>
                <UiForm className=''>

                    <DetailsStep
                         prevStep={ prevStep}
                         nextStep={ nextStep }
                         handleChange={ handleChange }
                         values={ userPublish }
                    />

                </UiForm>
            </UiLayout>
        </UiLayout>
          )
        case 3: 
          return (
            <UiLayout type='container'>
            <NotificationPopup closePopup={closePopup} message={errorMessage} popupRef={popupRef}/>
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
            <NotificationPopup closePopup={closePopup} message={errorMessage} popupRef={popupRef}/>
            <UiLayout type='container'>
                <UiText wrapper="h1" type="h1" variants={['heading']}>Publish new asset</UiText>
               
            </UiLayout>
           
            <UiLayout type='container'>
                <UiForm className=''>
                    <PricesStep
                         prevStep={ prevStep}
                         handleChange={ handleChange }
                         values={ userPublish }
                         submit = { onSubmitUserPublish }
                         isPublished = {isPublished}
                         successMessage={successMessage}
                    />
                </UiForm>
            </UiLayout>
        </UiLayout>
          )
          default: 
          // do nothing
    }
    
}