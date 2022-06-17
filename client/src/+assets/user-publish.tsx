import React, { useEffect, useContext, useState, useRef } from 'react'
import { User } from '../context'
import { Form, FormSelect, FormGroup, FormInput, FormAddItem, FormTextarea, Orientation, UiButton, UiLayout, UiText, UiDivider, UiPopupHandlers, BEM } from 'ui'
import { NextPage } from 'next'
import { newLogin, StoreItemTypes } from '../shared'
import { NotificationPopup } from '../components'
import styles from './user-publish.module.scss'

const b = BEM('user-publish', styles)


interface UserPublishParams {

    title: string
    author: string
    description: string
    category: string
    protocol: string
    file_id: string
    sample_file_id?: string
    network: string
    price: number

}

export const UserPublish: NextPage = () => {
    const {sdk, account, loginMarketplaceAPI, web3 } = useContext(User)
    const [inputError, setInputError] = useState('') 
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [isUpdated, setIsUpated] = useState(false)
    const popupRef = useRef<UiPopupHandlers>()

    const [userId, setUserId] = useState('')
    const [userPublish, setUserPublish] = useState<UserPublishParams>({
        title: '',
        author: '',
        description: '',
        category: '',
        protocol: '',
        file_id: '',
        sample_file_id: '',
        network: '',
        price: 0,
    })

    
    const closePopup = (event: any) => {
        popupRef.current?.close()
        event.preventDefault()
    }

    /*
    const onAddAddress = async () => {
        try {
            const accounts = await sdk.accounts.list()
            const accountToAdd = accounts.find(a => a.getId().toLowerCase() === newAddress)
            const credential = await sdk.utils.jwt.generateClientAssertion(accountToAdd)
            const token = await sdk.marketplace.addNewAddress(credential)
            localStorage.setItem(StoreItemTypes.MarketplaceApiToken, token)
            setAddresses([...addresses, newAddress])
            setNewAddress('')
            setIsAddressAdded(true)
            setSuccessMessage('Added is added successfully')
        } catch (error: any) {
            if(error.message.includes('"statusCode":401')) {
                setErrorMessage('Your login is expired. Please change to the previous address, reload and sign again')
                localStorage.removeItem(StoreItemTypes.MarketplaceApiToken)
            }

            setErrorMessage(error.message)
            popupRef.current?.open()
        }
        
    }


    METADATA  IN LOADER

    metadata = {
            "main": {
                "name": file_name[0] + " " + file_name[1],
                "dateCreated": date_created,
                "author": "Keyko GmbH",
                "license": "CC0: Public Domain",
                "price": self.price,
                "datePublished": data_published,
                "network": self.blockchain,
                "files": [
                    {
                        "index": 0,
                        "contentType": "text/csv",
                        "checksum": str(uuid.uuid4()),
                        "checksumType": "MD5",
                        "contentLength": self.file_size,
                        "url": self.url
                    }
                ],
                "type": "dataset"
            },
            "additionalInformation": {
                "description": description,
                "categories": [
                    f'ProtocolType:{self.category}',
                    f'EventType:{self.subcategory}',
                    f'Blockchain:{self.blockchain}',
                    f'UseCase:defi-datasets',
                    f'Version:{version}'
                ],
                "blockchain": self.blockchain,
                "version": version,
                "source": "filecoin",
                "file_name": self.filename,
                "key": key.hex(),
                "sampleUrl": sample_url
            },
        }

        ddo = self.nevermined.assets.create(
            metadata=metadata,
            publisher_account=self.account,
            providers=[self.gateway_address],
            asset_rewards={
                "_amounts": [str(self.price)],
                "_receivers": [os.getenv('PROVIDER_ADDRESS')],
                "_tokenAddress": os.getenv('TOKEN_ADDRESS')
            }
        )



        METADATA IN EON

        import { MetaData, Nevermined } from "@nevermined-io/nevermined-sdk-js";


        const generateMetadata = (i: number): MetaData => {
    const projectMetadata = generateProjectMetadata(i)
    const metadata = {
        main: {
            name: projectMetadata.name,
            dateCreated: new Date().toISOString().replace(/\.[0-9]{3}/, ''),
            author: projectMetadata.attributes.developer,
            license: '',
            // Leave at zero for now so that users trying it on mumbai
            // don't need to fund their wallets with USDC
            price: '0',
            datePublished: new Date().toISOString().replace(/\.[0-9]{3}/, ''),
            type: 'dataset',
            network: 'India',
            files: [
                {
                    index: 1,
                    contentType: 'text/plain',
                    url: 's3://carbon-ox-mumbai/retirement.pdf',
                    contentLength: '136',
                }
            ]
        },
        additionalInformation: {
            description,
            categories: ["carbonv3"],
            blockchain: "India",
            version: "0.0.5",
            source: "filecoin",
            file_name: "Certificate.pdf",
            customData: projectMetadata
        }
    } as MetaData

    return metadata
}


const publish = async (i: number) => {
    const nevermined = await Nevermined.getInstance(config)
    const publisher = (await nevermined.accounts.list())[0]

    const assetRewards = new AssetRewards(publisher.getId(), new BigNumber(0))

    // create an mint nft
    const ddo = await nevermined.nfts.create(
        generateMetadata(i),
        publisher,
        100,
        0,
        assetRewards,
        undefined,
        MUMBAI_USDC,
        true,
        undefined,
    )

    // give the gateway permission to transfer the nft and release the rewards
    // this only needs to be called once
    await nevermined.nfts.setApprovalForAll(
        config.gatewayAddress!,
        true,
        publisher
    )

    return ddo
}





    */

    const onSubmitUserPublish = async() => {
        try {
            if (!userPublish.title) {
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


            // await sdk.profiles.update(userId, userProfile)
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
                <UiText type="h2" wrapper="h2">Details</UiText>
            </UiLayout>
           
            <UiLayout type='container'>
                <div  className={b('publish-horizontal-line')}/>
                <Form className=''>


                    <FormGroup orientation={Orientation.Vertical}>
                        <FormSelect
                            className={b('publish-form-input')}
                            label='Test Select'
                            inputError={inputError}
                            value={userPublish.title} onChange={(e) => setUserPublish({...userPublish, title: e.target.value})}
                            placeholder='Pick one'
                        />
                    </FormGroup>

                    <FormGroup orientation={Orientation.Vertical}>
                        <FormInput
                            className={b('publish-form-input')}
                            label='Title *'
                            inputError={inputError}
                            value={userPublish.title} onChange={(e) => setUserPublish({...userPublish, title: e.target.value})}
                            placeholder='Type your nickname'
                        />
                    </FormGroup>
                    <FormGroup orientation={Orientation.Vertical}>
                        <FormInput
                            className={b('publish-form-input')}
                            label='Author *'
                            value={userPublish.author} onChange={(e) => setUserPublish({...userPublish, author: e.target.value})}
                            placeholder='Type the author'
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
                    <FormGroup orientation={Orientation.Vertical}>
                        <FormInput
                            className={b('publish-form-input')}
                            label='Category *'
                            value={userPublish.category} onChange={(e) => setUserPublish({...userPublish, category: e.target.value})}
                            placeholder='Type the category'
                        />
                    </FormGroup>
                    <FormGroup orientation={Orientation.Vertical}>
                        <FormInput
                            className={b('publish-form-input')}
                            label='Protocol *'
                            value={userPublish.protocol} onChange={(e) => setUserPublish({...userPublish, protocol: e.target.value})}
                            placeholder='Type the protocol'
                        />
                    </FormGroup>
                   
                    <UiDivider/>
                    <UiText type="h2" wrapper="h2">Storage & Network</UiText>
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
                    <FormGroup orientation={Orientation.Vertical}>
                        <FormInput
                            className={b('publish-form-input')}
                            label='Network *'
                            value={userPublish.network} onChange={(e) => setUserPublish({...userPublish, network: e.target.value})}
                            placeholder='Type the Network'
                        />
                    </FormGroup>

                    <UiDivider/>
                    <UiText type="h2" wrapper="h2">Price</UiText>
                    <div  className={b('publish-horizontal-line')}/>
                    <FormGroup orientation={Orientation.Vertical}>
                        <FormInput
                            className={b('publish-form-input')}
                            label='Set Your Price'
                            value={userPublish.price} onChange={(e) => setUserPublish({...userPublish, price: e.target.value})}
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