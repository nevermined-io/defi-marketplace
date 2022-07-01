import axios from "axios";
import {gatewayURL, filecoinUploadUri } from 'src/config'

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


const handlePostRequest = async (url:string, formData: FormData) => {
            
    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data
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