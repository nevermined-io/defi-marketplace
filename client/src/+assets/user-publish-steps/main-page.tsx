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
import { BasicInfoStep } from './basic-info'
import { DetailsStep } from './details'
import { PricesStep } from './prices'
import { FilesStep } from './files'
import {FileType, AssetFile, handleAssetFiles} from './files-handler'


const b = BEM('user-publish', styles)

export interface UserPublishParams {
    step: number
    name: string
    author: string
    description: string
    type: string
    category: string
    protocol: string
    network: string
    price: number
    tier: string
    asset_files: AssetFile[]
    notebook_language: string
    notebook_format: string
}

export const UserPublishMultiStep: NextPage = () => {

    const {sdk, account, userProfile, loginMarketplaceAPI, web3 } = useContext(User)
    const [inputError, setInputError] = useState('') 
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [filesUploadedMessage, setFilesUploadedMessage] = useState<string[]>([])
    const [isPublished, setIsPublished] = useState(false)
    const popupRef = useRef<UiPopupHandlers>()
    const fileUploadPopupRef = useRef<UiPopupHandlers>()

    const [userId, setUserId] = useState('')
    const [userPublish, setUserPublish] = useState<UserPublishParams>({
        step: 1,
        name: '',
        author: '',
        description: '',
        type: 'dataset',
        category: 'None',
        protocol: 'None',
        network: 'None',
        price: 0,
        tier: 'Tier 1',
        asset_files: [],
        notebook_language: '',
        notebook_format: ''
    })

    const [assetfiles, setAssetFiles] = useState<AssetFile[]>([])

    const reset = () => {
        setUserPublish({
            step: 1,
            name: '',
            author: '',
            description: '',
            type: 'dataset',
            category: 'None',
            protocol: 'None',
            network: 'None',
            price: 0,
            tier: 'Tier 1',
            asset_files: [],
            notebook_language: '',
            notebook_format: ''
        })

        setIsPublished(false)
        setFilesUploadedMessage([])
        setAssetFiles([])
        setSuccessMessage('')
        setErrorMessage('')

    }

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

    interface FileMetadata {
        index: number
        contentType: string
        url: string
        contentLength:string
    }

    const generateFilesMetadata = () => {

        const files: FileMetadata[] = []
        userPublish.asset_files.forEach((assetFile: AssetFile, i: number) => {
            const file:FileMetadata = {
                index: i+1,
                contentType: assetFile.content_type?assetFile.content_type:'',
                url: assetFile.filecoin_id?assetFile.filecoin_id:'',
                contentLength: assetFile.size?assetFile.size:'',
            }
            files.push(file)    
        });

        return files        
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
                files: generateFilesMetadata()
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
                source: "filecoin"   
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

    const generateFilesUploadedMessage = (assetFiles: AssetFile[]) => {

        const messages: string[] = []
        for (const assetFile of assetFiles){
            const isLocalFile: boolean = assetFile.type === FileType.Local
            if (isLocalFile)
                messages.push(`- File ${assetFile.name} uploaded to Filecoin with ID: ${assetFile.filecoin_id}`)
        }
        return messages        
    }

    const onSubmitUserPublish = async() => {
        try {

            const findLocal = userPublish.asset_files.find(file => file.type === FileType.Local)

            if (findLocal != undefined){
                fileUploadPopupRef.current?.open()
                await handleAssetFiles(userPublish.asset_files)
                setFilesUploadedMessage(generateFilesUploadedMessage(userPublish.asset_files))
                fileUploadPopupRef.current?.close()
            }

            const metadata = generateMetadata()
    
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
            var message = 'Your Asset has been published successfully with DID: ' + did 
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
                         reset = {reset}
                         handleChange={ handleChange }
                         values={ userPublish }
                         submit = { onSubmitUserPublish }
                         isPublished = {isPublished}
                         successMessage={successMessage}
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