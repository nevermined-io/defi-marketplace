import { DDO } from "@nevermined-io/nevermined-sdk-js"
import { AdditionalInformation } from "@nevermined-io/nevermined-sdk-js"
import axios from 'axios';
import { bundleCreateUri, bundleServiceUri, bundleStatusUri, userBundlesUri, bundleDataset, sampleUri } from "src/config";

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

export const createBundle = (user: string, assets: DDO[], price: number): Promise<any> => {
  const datasets = assets
    .map(asset => ({
      additionalInformationExtend:
        asset.findServiceByType('metadata').attributes.additionalInformation as AdditionalInformationExtended,
      id: asset.id
    }))
    .map(assetInfo => ({
      id: assetInfo.id,
      key: assetInfo.additionalInformationExtend.key,
      source: assetInfo.additionalInformationExtend.source,
      file_name: assetInfo.additionalInformationExtend.file_name
    }))

  return axios({
    method: 'post',
    url: bundleServiceUri + bundleCreateUri,
    data: {
      user,
      datasets,
      price
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

  return response.data.bundles.map((bundle: any) => ({
    bundleId: bundle.bundle_id,
    did: bundle.did,
    status: bundle.status,
    user: bundle.user,
    updatedAt: bundle.updatedAt,
    createdAt: bundle.createdAt,
    datasets: bundle.Datasets.map((dataset: any) => ({
      datasetId: dataset.dataset_id,
      fileName: dataset.file_name,
      source: dataset.source
    }))
  }))
}



export const getBundlesWithDataset = async (dataset: string): Promise<Bundle[]> => {
  const response = await axios({
    method: 'get',
    url: `${bundleServiceUri}${bundleDataset}/${dataset}`
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



export const getSampleURL = async (protocolType: string, eventType: string): Promise<string> => {
  try {
    const response = await axios({
      method: 'get',
      url: `${bundleServiceUri}${sampleUri}/${protocolType}/${eventType}`
    })

    return response.data.sample.sample_url

  } catch (error) {
    return ""
  }

}


export const getDashboardUrl = async (): Promise<any> => {
  return axios({
    method: 'get',
    url: "https://1q6lvqnlg3.execute-api.us-east-1.amazonaws.com/test/anonymous-embed-sample",
    params: { "mode": "getUrl" },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    }
  })

}
