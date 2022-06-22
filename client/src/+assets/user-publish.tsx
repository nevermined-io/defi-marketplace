import React, { useEffect, useContext, useState, useRef } from 'react'
import { User } from '../context'
import { Form, FormSelect, FormGroup, FormInput, FormTextarea, Orientation, UiButton, UiLayout, UiText, UiDivider, UiPopupHandlers, BEM } from 'ui'
import { NextPage } from 'next'
import { newLogin, StoreItemTypes } from '../shared'
import { NotificationPopup } from '../components'
import styles from './user-publish.module.scss'
import { MetaData, Nevermined } from "@nevermined-io/nevermined-sdk-js"
import AssetRewards from "@nevermined-io/nevermined-sdk-js/dist/node/models/AssetRewards";
import BigNumber from "bignumber.js";
import { networkArray, categories, protocols, assetTypes, Nft721ContractAddress } from 'src/config'

const b = BEM('user-publish', styles)
const tiers: string[] = ["Tier 1", "Tier 2", "Tier 3"]


interface UserPublishParams {

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

}

export const UserPublish: NextPage = () => {
    const {sdk, account, userProfile, loginMarketplaceAPI, web3 } = useContext(User)
    const [inputError, setInputError] = useState('') 
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [isUpdated, setIsUpated] = useState(false)
    const popupRef = useRef<UiPopupHandlers>()

    const [userId, setUserId] = useState('')
    const [userPublish, setUserPublish] = useState<UserPublishParams>({
        name: '',
        author: userProfile.nickname,
        description: '',
        type: 'dataset',
        category: 'None',
        protocol: 'None',
        file_id: '',
        sample_file_id: '',
        network: '',
        price: 0,
        tier: 'Tier 1'
    })

    
    const closePopup = (event: any) => {
        popupRef.current?.close()
        event.preventDefault()
    }


    const generateMetadata = () => {

        //   pending
        // contentlength  if filecoin id
        // ojo checksum and key set in gateway

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
                        contentType: 'text/plain',
                        url: userPublish.file_id,
                        contentLength: '',
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
                file_name: "Asset.csv"
            }
        } as MetaData
    
        return metadata
    }


    const onSubmitUserPublish = async() => {
        try {
            if (!userPublish.name) {
                setInputError('Title is required')
                return
            }

            if (!userPublish.author) {
                setInputError('Author is required')
                return
            }

            if (!userPublish.description) {
                setInputError('Description is required')
                return
            }

            if (!userPublish.type) {
                setInputError('Type is required')
                return
            }


            if (!userPublish.category) {
                setInputError('Category is required')
                return
            }

            if (!userPublish.protocol) {
                setInputError('Protocol is required')
                return
            }

            if (!userPublish.file_id) {
                setInputError('File is required')
                return
            }

            if (!userPublish.network) {
                setInputError('Network is required')
                return
            }

            const metadata = generateMetadata()

            const accounts = await sdk.accounts.list()
            const user_account = await accounts[0]
            const user_address = user_account.getId()

            // variable account in UserProvider stores the address!
        
            const assetRewards = new AssetRewards(user_address, new BigNumber(userPublish.price))
            const ddo = await sdk.nfts.create721(
                metadata,
                user_account,
                assetRewards,
                Nft721ContractAddress
            )

            if (ddo) {
                console.log("Asset Published with DID: " + ddo.id)
                alert("Asset Published with DID: " + ddo.id)
            }
        

            setIsUpated(true)
            setSuccessMessage('Your Asset has been published successfully')
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

    return (
        <UiLayout type='container'>
            <NotificationPopup closePopup={closePopup} message={errorMessage} popupRef={popupRef}/>
            <UiLayout type='container'>
                <UiText wrapper="h1" type="h1" variants={['heading']}>Publish new asset</UiText>
               
            </UiLayout>
           
            <UiLayout type='container'>

                <Form className=''>

                <UiText type="h2" wrapper="h2">Basic Info</UiText>
                <div  className={b('publish-horizontal-line')}/>

                    <FormGroup orientation={Orientation.Vertical}>
                        <FormInput
                            className={b('publish-form-input')}
                            label='Author'
                            disabled
                            value={userPublish.author} onChange={(e) => setUserPublish({...userPublish, author: e.target.value})}
                            placeholder='Type the author'
                        />
                    </FormGroup>
                    <FormGroup orientation={Orientation.Vertical}>
                        <FormInput
                            className={b('publish-form-input')}
                            label='Name *'
                            inputError={inputError}
                            value={userPublish.name} onChange={(e) => setUserPublish({...userPublish, name: e.target.value})}
                            placeholder='Type a name for the Asset'
                        />
                    </FormGroup>       
                    <FormGroup orientation={Orientation.Vertical}>
                        <FormTextarea
                            className={b('publish-form-input')}
                            label='Description *'
                            value={userPublish.description}
                            onChange={(e) => setUserPublish({...userPublish, description: e.target.value})}
                            placeholder='Type a description'
                        />
                    </FormGroup>

                    <UiDivider/>
                    <UiText type="h2" wrapper="h2">Details</UiText>
                    <div  className={b('publish-horizontal-line')}/>

                    <FormGroup orientation={Orientation.Vertical}>               
                        <FormSelect
                            value={userPublish.type}
                            onChange={(e) => setUserPublish({...userPublish, type: e})}
                            options={assetTypes}
                            className={b('publish-form-select')}
                            label='Type'
                            inputError={inputError}
                        /> 
                    </FormGroup>

                    <FormGroup orientation={Orientation.Vertical}>               
                        <FormSelect
                            value={userPublish.category}
                            onChange={(e) => setUserPublish({...userPublish, category: e})}
                            options={categories}
                            className={b('publish-form-select')}
                            label='Category'
                            inputError={inputError}
                        /> 
                    </FormGroup>
                
                    <FormGroup orientation={Orientation.Vertical}>
                        <FormSelect
                            value={userPublish.protocol}
                            onChange={(e) => setUserPublish({...userPublish, protocol: e})}
                            options={protocols}
                            className={b('publish-form-select')}
                            label='Protocol'
                            inputError={inputError}
                        /> 
                    </FormGroup>

                    <FormGroup orientation={Orientation.Vertical}>
                    <FormSelect
                        value={userPublish.network}
                        onChange={(e) => setUserPublish({...userPublish, network: e})}
                        options={networkArray}
                        className={b('publish-form-select')}
                        label='Network'
                        inputError={inputError}
                    /> 
                    </FormGroup>
    
                    <UiDivider/>
                    <UiText type="h2" wrapper="h2">Storage</UiText>
                    <div  className={b('publish-horizontal-line')}/>
            
                    <FormGroup orientation={Orientation.Vertical}>
                        <FormInput
                            className={b('publish-form-input')}
                            label='File ID *'
                            value={userPublish.file_id} onChange={(e) => setUserPublish({...userPublish, file_id: e.target.value})}
                            placeholder='Type the filecoin id for the file'
                        />
                    </FormGroup>
                    <FormGroup orientation={Orientation.Vertical}>
                        <FormInput
                            className={b('publish-form-input')}
                            label='Sample File ID'
                            value={userPublish.sample_file_id} onChange={(e) => setUserPublish({...userPublish, sample_file_id: e.target.value})}
                            placeholder='Type the filecoin id for the sample file'
                        />
                    </FormGroup>
                    

                    <UiDivider/>
                    <UiText type="h2" wrapper="h2">Price & Subscription</UiText>
                    <div  className={b('publish-horizontal-line')}/>
                    <FormGroup orientation={Orientation.Vertical}>
                        <FormInput
                            className={b('publish-form-input')}
                            label='Set Your Price'
                            value={userPublish.price} onChange={(e) => setUserPublish({...userPublish, price: e.target.value})}
                        />
                    </FormGroup>
                    <FormGroup orientation={Orientation.Vertical}>
                    <FormSelect
                        value={userPublish.tier}
                        onChange={(e) => setUserPublish({...userPublish, tier: e})}
                        options={tiers}
                        className={b('publish-form-select')}
                        label='Tier'
                        inputError={inputError}
                    /> 
                    </FormGroup>
                    
                    <div className={b('publish-submit-container')}>
                        <div className={b('publish-submit-container', ['updated-message'])}>
                            {(isUpdated) ? <UiText type="h3" wrapper="h3" variants={['success']}>{successMessage}</UiText> : null}
                        </div>
                        <div className={b('publish-submit-container', ['submit'])}>
                            <UiButton onClick={onSubmitUserPublish}>Publish Asset</UiButton>
                        </div>
                    </div>
                </Form>
            </UiLayout>
        </UiLayout>
    )
}