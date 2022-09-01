import { DDO } from "@nevermined-io/nevermined-sdk-js"
import { AdditionalInformation } from "@nevermined-io/nevermined-sdk-js"
import axios from 'axios';
import { bundleServiceUri, sampleUri } from "src/config";

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
