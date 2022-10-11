import React, { useState, useRef, useEffect } from 'react'
import {
  BEM,
  UiForm,
  UiLayout,
  UiText,
  UiPopupHandlers,
  NotificationPopup,
  UiDivider
} from '@nevermined-io/styles'
import {
  Catalog,
  AssetFile,
  AssetService,
  RoyaltyKind,
  getRoyaltyScheme
} from '@nevermined-io/catalog-core'
import { NextPage } from 'next'
import { MetaData } from '@nevermined-io/nevermined-sdk-js'
import { BasicInfoStep } from './basic-info'
import { DetailsStep } from './details'
import { FilesStep } from './files'
import { handleAssetFiles, FileType } from './files-handler'
import { toast } from '../../components'
import { gatewayAddress, NFT_TIERS } from 'src/config'
import { ProgressBar } from './progress-bar/progress-bar'
import styles from './publish-asset.module.scss'

const b = BEM('publish-asset', styles)

export const UserPublishMultiStep: NextPage = () => {
  const {
    errorAssetMessage,
    setErrorAssetMessage,
    setAssetMessage,
    assetPublish,
    setAssetPublish,
    publishNFT721
  } = AssetService.useAssetPublish()
  const [filesUploadedMessage, setFilesUploadedMessage] = useState<string[]>([])
  const popupRef = useRef<UiPopupHandlers>()
  const fileUploadPopupRef = useRef<UiPopupHandlers>()
  const txPopupRef = useRef<UiPopupHandlers>()
  const [step, setStep] = useState<number>(1)
  const [resultOk, setResultOk] = useState(false)
  const [isProcessComplete, setIsProcessComplete] = useState(false)
  const resultPopupRef = useRef<UiPopupHandlers>()
  const { sdk } = Catalog.useNevermined()

  useEffect(() => {
    setAssetPublish({
      ...assetPublish,
      category: 'None',
      protocol: 'None',
      network: 'None',
      price: 0,
      tier: 'Community',
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
      tier: 'Community',
      assetFiles: [],
      notebook_language: 'Python',
      notebook_requirements: '',
      notebook_format: 'Source code',
      report_type: 'Aggregation',
      report_format: 'CSV'
    })
    setFilesUploadedMessage([])
    setErrorAssetMessage('')
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
    contentLength: string
  }

  const generateFilesMetadata = () => {
    const files: FileMetadata[] = []
    assetPublish.assetFiles.forEach((assetFile: AssetFile, i: number) => {
      const file: FileMetadata = {
        index: i + 1,
        contentType: assetFile.content_type ? assetFile.content_type : '',
        url: assetFile.filecoin_id ? assetFile.filecoin_id : '',
        contentLength: assetFile.size ? assetFile.size : ''
      }
      files.push(file)
    })

    return files
  }

  const generateMetadata = () => {
    const metadata: MetaData = {
      curation: {
        rating: 0,
        numVotes: 0,
        isListed: true
      },
      main: {
        name: assetPublish.name,
        dateCreated: new Date().toISOString().replace(/\.[0-9]{3}/, ''),
        author: assetPublish.author,
        license: 'No License Specified',
        price: String(assetPublish.price),
        datePublished: new Date().toISOString().replace(/\.[0-9]{3}/, ''),
        type: 'dataset',
        network: assetPublish.network,
        files: generateFilesMetadata()
      },
      additionalInformation: {
        description: assetPublish.description,
        categories: [
          `ProtocolType:${assetPublish.category}`,
          `EventType:${assetPublish.protocol}`,
          `Blockchain:${assetPublish.network}`,
          `UseCase:defi-datasets`,
          `Version:v1`
        ],
        blockchain: assetPublish.network,
        version: 'v1',
        source: 'filecoin'
      }
    } as MetaData

    switch (assetPublish.type) {
      case 'report':
        metadata.additionalInformation!.customData = {
          subtype: assetPublish.type,
          report_type: assetPublish.report_type,
          report_format: assetPublish.report_format,
          tier_name: assetPublish.tier
        }
        break
      case 'notebook':
        metadata.additionalInformation!.customData = {
          subtype: assetPublish.type,
          notebook_language: assetPublish.notebook_language,
          notebook_requirements: assetPublish.notebook_requirements,
          notebook_format: assetPublish.notebook_format,
          tier_name: assetPublish.tier
        }
        break
      default:
        metadata.additionalInformation!.customData = {
          subtype: assetPublish.type,
          tier_name: assetPublish.tier
        }
        break
    }

    return metadata
  }

  const getNftTierAddress = (): string => {
    return NFT_TIERS.find((tier) => tier.name === assetPublish.tier)?.address || ''
  }

  const generateFilesUploadedMessage = (assetFiles: AssetFile[]) => {
    const messages: string[] = []
    for (const assetFile of assetFiles) {
      const isLocalFile: boolean = assetFile.type === FileType.Local
      if (isLocalFile)
        messages.push(
          `- File ${assetFile.name} uploaded to Filecoin with ID: ${assetFile.filecoin_id}`
        )
    }
    return messages
  }

  const uploadFiles = async () => {
    const findLocal = assetPublish.assetFiles.find((file) => file.type === FileType.Local)

    if (findLocal) {
      fileUploadPopupRef.current?.open()
      await handleAssetFiles(assetPublish.assetFiles)
      setFilesUploadedMessage(generateFilesUploadedMessage(assetPublish.assetFiles))
      fileUploadPopupRef.current?.close()
    }
  }

  const onSubmitUserPublish = async () => {
    try {
      await uploadFiles()
      txPopupRef.current?.open()

      const royaltyAttributes = {
        royaltyKind: RoyaltyKind.Standard,
        scheme: getRoyaltyScheme(sdk, RoyaltyKind.Standard),
        amount: 0
      }

      publishNFT721({
        nftAddress: getNftTierAddress(),
        metadata: generateMetadata(),
        providers: [gatewayAddress],
        royaltyAttributes: royaltyAttributes
      })
        .then(() => {
          setResultOk(true)
          txPopupRef.current?.close()
          resultPopupRef.current?.open()
          toast.success(`Asset published correctly in the Marketplace`)
        })
        .catch((error) => {
          txPopupRef.current?.close()
          setResultOk(false)
          if (error.message.includes('Transaction was not mined within 50 blocks')) {
            setErrorAssetMessage(
              'Transaction was not mined within 50 blocks, but it might still be mined. Check later the Published Assets section in your Account'
            )
          }
          resultPopupRef.current?.open()
          toast.error(errorAssetMessage)
        })
    } catch (error: any) {
      setErrorAssetMessage(error.message)
      popupRef.current?.open()
    }
  }

  const updateFilesAdded = (assetFile: AssetFile) => {
    const arrayFiles: AssetFile[] = assetPublish.assetFiles
    setAssetPublish({ ...assetPublish, assetFiles: [...arrayFiles, assetFile] })
  }

  const removeFile = (label: string) => {
    const arrayFiles: AssetFile[] = assetPublish.assetFiles

    const indexOfObject = arrayFiles.findIndex((assetFile) => {
      return assetFile.label === label
    })

    if (indexOfObject !== -1) {
      arrayFiles.splice(indexOfObject, 1)
      setAssetPublish({ ...assetPublish, assetFiles: [...arrayFiles] })
    }
  }

  return (
    <UiLayout type="container" className={b()}>
      <NotificationPopup closePopup={closePopup} message={errorAssetMessage} popupRef={popupRef} />
      <UiLayout type="container">
        <UiText type="h2" wrapper="h2">
          Publish new asset
        </UiText>
        <UiDivider className={b('divider-line', ['fade'])} />
        <ProgressBar currentStep={step} totalSteps={3} isProcessComplete={isProcessComplete} />
        <UiForm className={b('step-container')}>
          {step === 1 && <BasicInfoStep nextStep={nextStep} />}
          {step === 2 && <DetailsStep prevStep={prevStep} nextStep={nextStep} />}
          {step === 3 && (
            <FilesStep
              prevStep={prevStep}
              updateFilesAdded={updateFilesAdded}
              removeFile={removeFile}
              submit={onSubmitUserPublish}
              filesUploadedMessage={filesUploadedMessage}
              fileUploadPopupRef={fileUploadPopupRef}
              txPopupRef={txPopupRef}
              resultOk={resultOk}
              resultPopupRef={resultPopupRef}
              reset={resetValues}
              setIsProcessComplete={setIsProcessComplete}
            />
          )}
        </UiForm>
      </UiLayout>
    </UiLayout>
  )
}
