import axios from 'axios';
import { bundleServiceUri, sampleUri } from "src/config";



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
