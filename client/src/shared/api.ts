import { DDO } from "@nevermined-io/nevermined-sdk-js"
import { AdditionalInformation } from "@nevermined-io/nevermined-sdk-js"
import axios from 'axios';
import { bundleCreateUri, bundleServiceUri, bundleStatusUri, userBundlesUri } from "src/config";

interface AdditionalInformationExtended extends AdditionalInformation {
  key: string;
  source: string;
  file_name: string;
}

interface Dataset {
  datasetId: string;
  fileName: string;
  source: string
}

export interface Bundle {
  bundleId: string;
  did: string;
  status: string;
  user: string;
  datasets: Dataset[];
  updatedAt: string;
  createdAt: string;
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

export const checkBundleStatus = (bundleId: string): Promise<any> => {
  return axios({
    method: 'get',
    url: `${bundleServiceUri}${bundleStatusUri}/${bundleId}`
  })
}


export const getAllUserBundlers = async (user: string): Promise<Bundle[]> => {
  const response = await axios({
    method: 'get',
    url: `${bundleServiceUri}${userBundlesUri}/${user}`
  })

  return response.data.bundles.map((bundle: any) => {
    return {
      bundleId: bundle.bundle_id,
      did: bundle.did,
      status: bundle.status,
      user: bundle.user,
      updatedAt: bundle.updatedAt,
      createdAt: bundle.createdAt,
      datasets: bundle.Datasets.map((dataset: any) => {
        return {
          datasetId: dataset.dataset_id,
          fileName: dataset.file_name,
          source: dataset.source
        }
      })
    }
  })
}
