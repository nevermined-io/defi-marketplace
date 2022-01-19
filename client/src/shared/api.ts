import { DDO } from "@nevermined-io/nevermined-sdk-js"
import { AdditionalInformation } from "@nevermined-io/nevermined-sdk-js"
import axios from 'axios';
import { bundleCreateUri, bundleServiceUri } from "src/config";

interface AdditionalInformationExtended extends AdditionalInformation {
  key: string;
  source: string;
  file_name: string;
}

export const createBundle = (user: string, assets: DDO[]): Promise<any> => {
  const datasets = assets
    .map(asset => ({
      additionalInformationExtend:
        asset.findServiceByType('metadata').attributes.additionalInformation as AdditionalInformationExtended
    }))
    .map(additionalInformation => ({
      key: additionalInformation.additionalInformationExtend.key,
      source: additionalInformation.additionalInformationExtend.source,
      file_name: additionalInformation.additionalInformationExtend.file_name
    }))

  return axios({
    method: 'post',
    url: bundleServiceUri + bundleCreateUri,
    data: {
      user,
      datasets
    }
  })
}
