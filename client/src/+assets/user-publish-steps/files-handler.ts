import axios from 'axios'
import axiosRetry from 'axios-retry'
import { neverminedNodeUri, filecoinUploadUri, ipfsGatewayUri } from 'src/config'
import { AssetFile } from '@nevermined-io/catalog-core'

export enum FileType {
  FilecoinID = 'Filecoin',
  Local = 'Local'
}

const handlePostRequest = async (url: string, formData: FormData, retries = 3) => {
  axiosRetry(axios, {
    retries: retries,
    shouldResetTimeout: true,
    retryDelay: (retryCount) => {
      console.log(`retry attempt: ${retryCount}`)
      return retryCount * 2000 // time interval between retries
    },
    retryCondition: () => true // retry no matter what
  })

  let response

  try {
    response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  } catch (e) {
    console.error(e)
    throw e
  }
  return response?.data
}

const uploadFileToFilecoin = async (file: File) => {
  if (file) {
    const form = new FormData()
    form.append('file', file)

    const gatewayUploadUrl = neverminedNodeUri + filecoinUploadUri
    const response = await handlePostRequest(gatewayUploadUrl, form)
    return response.url
  }
}

export const handleAssetFiles = async (assetFiles: AssetFile[]) => {
  for (const assetFile of assetFiles) {
    const isLocalFile: boolean = assetFile.type.match(FileType.Local) != null

    if (isLocalFile && assetFile.file) {
      assetFile.filecoin_id = await uploadFileToFilecoin(assetFile.file)
    }
  }
}

export const checkFilecoinIdExists = async (id: string): Promise<[boolean, AssetFile]> => {
  id = id.replace('cid://', '')
  const url = `${ipfsGatewayUri}\\ipfs\\${id}`

  axiosRetry(axios, {
    retries: 2,
    shouldResetTimeout: true,
    retryDelay: (retryCount) => {
      console.log(`retry attempt: ${retryCount}`)
      return retryCount * 1000 // time interval between retries
    },
    retryCondition: (error) => {
      return error?.response?.status != 503
    } // retry no matter what
  })

  const assetFile: AssetFile = {
    type: FileType.FilecoinID,
    label: id,
    filecoin_id: 'cid://'.concat(id)
  }

  try {
    const { status, headers } = await axios.get(url)

    if (status == 200) {
      assetFile.content_type = headers['content-type']
      assetFile.size = headers['content-length']

      return [true, assetFile]
    }

    return [false, assetFile]
  } catch (e) {
    console.error('Error getting Filecoin info for ' + id)
    console.error(e)
    return [false, assetFile]
  }
}
