import axios from 'axios'
import axiosRetry from 'axios-retry'
import { filecoinUploadUri, ipfsGatewayUri } from 'src/config'
import { AssetFile, AssetsModule} from '@nevermined-io/catalog-core'

export enum FileType {
  FilecoinID = 'Filecoin',
  Local = 'Local'
}

const uploadFileToFilecoin = async (file: File, assets: AssetsModule) => {

  if (file) {
    const response = assets.uploadAssetToFilecoin(file, filecoinUploadUri)
    return response
  }
}

export const handleAssetFiles = async (assetFiles: AssetFile[], assets: AssetsModule ) => {
  for (const assetFile of assetFiles) {
    const isLocalFile: boolean = assetFile.type.match(FileType.Local) != null

    if (isLocalFile && assetFile.file) {
      assetFile.filecoin_id = await uploadFileToFilecoin(assetFile.file, assets)
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
