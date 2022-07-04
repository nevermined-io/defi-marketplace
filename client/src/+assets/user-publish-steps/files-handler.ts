import axios from 'axios';
import axiosRetry from 'axios-retry'
import {gatewayURL, filecoinUploadUri, ipfsGatewayUri } from 'src/config'

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



const handlePostRequest = async (url:string, formData: FormData, retries: number = 3) => {

    axiosRetry(axios, {
        retries: retries,
        shouldResetTimeout: true,
        retryDelay: (retryCount) => {
            console.log(`retry attempt: ${retryCount}`);
            return retryCount * 2000; // time interval between retries
          },
        retryCondition: (_error) => true // retry no matter what
      });
            
    let response 
    
    try {
        response = await axios.post(url, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        });
    }
    catch (e) {
        console.error(e);
        throw e;
    }
    return response?.data

  };

const uploadFileToFilecoin = async (file: File) => {

    if (file) {
        
        const form = new FormData()
        form.append('file', file)
    
        const gatewayUploadUrl = gatewayURL + filecoinUploadUri
        const response = await handlePostRequest(gatewayUploadUrl, form)    
        return response.url;
    }
};

export const handleAssetFiles = async (assetFiles: AssetFile[]) => {

    for (const assetFile of assetFiles){
        
        const isLocalFile: boolean = assetFile.type.match(FileType.Local) != null
        // assetFile.type === FileType.Local is not working
    
        if (isLocalFile && assetFile.file){         
            assetFile.filecoin_id = await(uploadFileToFilecoin(assetFile.file))
            console.log ("asset File: " + JSON.stringify(assetFile)) 
        }
    }

}

export const checkFilecoinIdExists = async (id: string): Promise<[boolean, AssetFile]> => {

    id = id.replace('cid://', '')
    const url =  `${ipfsGatewayUri}\\ipfs\\${id}`

    const assetFile:AssetFile = {
        type: FileType.FilecoinID,
        label: id,
        filecoin_id: id
    }

    try{
        const {data, status, headers} = await axios.get(url);

        if (status == 200){
            assetFile.content_type = headers['content-type']
            assetFile.size = headers['content-length']

            return [true, assetFile]
        }

        return [false, assetFile]
    }
    catch(e){
        console.error("Error getting Filecoin info for " + id);
        console.error(e);
        return [false, assetFile]
    }

}