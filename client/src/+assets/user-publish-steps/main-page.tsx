import React, { useState, useRef, useEffect } from 'react'
import { UiForm, UiLayout, UiText, UiPopupHandlers, NotificationPopup, BEM } from '@nevermined-io/styles'
import  Catalog from '@nevermined-io/components-catalog'
import  {AssetFile} from '@nevermined-io/components-catalog/dist/node/types'

import { NextPage } from 'next'
import styles from './user-publish.module.scss'
import { MetaData} from "@nevermined-io/nevermined-sdk-js"
import {  Nft721ContractAddress, tier1NftContractAddress, tier2NftContractAddress, tier3NftContractAddress } from 'src/config'
import { BasicInfoStep } from './basic-info'
import { DetailsStep } from './details'
import { PricesStep } from './prices'
import { FilesStep } from './files'
import { handleAssetFiles, FileType} from './files-handler'

const b = BEM('user-publish', styles)

export const UserPublishMultiStep: NextPage = () => {
    const {sdk} = Catalog.useNevermined()
    const { errorAssetMessage, setAssetErrorMessage, setAssetMessage, assetPublish, setAssetPublish, reset, onAssetPublish } = Catalog.useAssetPublish()
    const [filesUploadedMessage, setFilesUploadedMessage] = useState<string[]>([])
    const popupRef = useRef<UiPopupHandlers>()
    const fileUploadPopupRef = useRef<UiPopupHandlers>()
    const txPopupRef = useRef<UiPopupHandlers>()
    const [step, setStep] = useState<number>(1)    

    const [resultOk, setResultOk] = useState(false)
    const resultPopupRef = useRef<UiPopupHandlers>()

    useEffect(() => {
        setAssetPublish({
            ...assetPublish,
            category: 'None',
            protocol: 'None',
            network: 'None',
            price: 0,
            tier: 'Tier 1',
            notebook_language: 'Python',
            notebook_requirements: '',
            notebook_format: 'Source code',
            report_type: 'Aggregation',
            report_format: 'CSV'
        })
    }, [])

    const resetValues = () => {

        setStep(1)
        setAssetPublish({
            name: '',
            author: '',
            description: '',
            type: 'dataset',
            category: 'None',
            protocol: 'None',
            network: 'None',
            price: 0,
            tier: 'Tier 1',
            assetFiles: [],
            notebook_language: 'Python',
            notebook_requirements: '',
            notebook_format: 'Source code',
            report_type: 'Aggregation',
            report_format: 'CSV'   
        })
        setFilesUploadedMessage([])
        setAssetErrorMessage('')
        setAssetMessage('')
        setResultOk(false)

    }

    // go back to previous step
    const prevStep = () => {
        setStep(step - 1)
    }

    // proceed to the next step
    const nextStep = () => {
        setStep(step + 1)
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
        assetPublish.assetFiles.forEach((assetFile: AssetFile, i: number) => {
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

        const metadata: MetaData = {
            main: {
                name: assetPublish.name,
                dateCreated: new Date().toISOString().replace(/\.[0-9]{3}/, ''),
                author: assetPublish.author,
                license: 'No License Specified', 
                price: String(assetPublish.price),
                datePublished: new Date().toISOString().replace(/\.[0-9]{3}/, ''),
                type: "dataset",
                network: assetPublish.network,
                files: generateFilesMetadata()
            },
            additionalInformation: {
                description: assetPublish.description,
                categories: [`ProtocolType:${assetPublish.category}`,
                `EventType:${assetPublish.protocol}`,
                `Blockchain:${assetPublish.network}`,
                `UseCase:defi-datasets`,
                `Version:v1`
                ],
                blockchain: assetPublish.network,
                version: "v1",
                source: "filecoin"
            }
        } as MetaData

        switch ( assetPublish.type) {
            
            case "report":  metadata.additionalInformation!.customData = {  
                    "subtype": assetPublish.type,
                    "report_type": assetPublish.report_type, 
                    "report_format": assetPublish.report_format
                }; 
                break;
            case "notebook":  metadata.additionalInformation!.customData = {  
                    "subtype": assetPublish.type,
                    "notebook_language": assetPublish.notebook_language, 
                    "notebook_requirements": assetPublish.notebook_requirements,
                    "notebook_format": assetPublish.notebook_format
                };
                break;
            default: break;
        }

        return metadata
    }

    const getNftTierAddress = (): string => {

        switch(assetPublish.tier) {
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

    const uploadFiles = async() => {
        const findLocal = assetPublish.assetFiles.find(file => file.type === FileType.Local)

        if (findLocal){
            fileUploadPopupRef.current?.open()
            await handleAssetFiles(assetPublish.assetFiles)
            setFilesUploadedMessage(generateFilesUploadedMessage(assetPublish.assetFiles))
            fileUploadPopupRef.current?.close()
        }
    }

    const onSubmitUserPublish = async() => {
        try {
            await uploadFiles()
            txPopupRef.current?.open()
         
            onAssetPublish({nftAddress: getNftTierAddress(), metadata: generateMetadata()})
            .then((ddo) =>
                {
                    setResultOk(true)
                    txPopupRef.current?.close()
                    resultPopupRef.current?.open()
                }
            )
            .catch((error) => { 
                    txPopupRef.current?.close()
                    setResultOk(false)
                    if (error.message.includes("Transaction was not mined within 50 blocks")){
                        setAssetErrorMessage("Transaction was not mined within 50 blocks, but it might still be mined. Check later your profile to see the Assets already published")
                    }
                    resultPopupRef.current?.open()
                }
            )               
        } catch (error: any ) {
            setAssetErrorMessage(error.message)
            popupRef.current?.open()
        }
    }
   
    const updateFilesAdded = (assetFile: AssetFile) => {
        const arrayFiles: AssetFile[] = assetPublish.assetFiles
        setAssetPublish({...assetPublish, assetFiles: [...arrayFiles, assetFile] })
    }

    const removeFile = (label: string) => {
        const arrayFiles: AssetFile[] = assetPublish.assetFiles

        const indexOfObject = arrayFiles.findIndex((assetFile) => {
            return assetFile.label === label;
          });

        if (indexOfObject !== -1) {
            arrayFiles.splice(indexOfObject, 1);
            setAssetPublish({...assetPublish, assetFiles: [...arrayFiles] })
          }
       
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
                         prevStep={ prevStep}
                         reset = {resetValues}
                         submit = { onSubmitUserPublish }
                         filesUploadedMessage = {filesUploadedMessage}
                         fileUploadPopupRef = {fileUploadPopupRef}
                         txPopupRef = {txPopupRef}
                         resultOk = {resultOk}
                         resultPopupRef = {resultPopupRef}
                    />
                </UiForm>
            </UiLayout>
        </UiLayout>
          )
          default: 
          // do nothing
    }
    
}