import { DDO, MetaData } from '@nevermined-io/nevermined-sdk-js'

import { categoryPrefix, subcategoryPrefix, networkPrefix } from './constants'

export function toDate(date: string) {
  return new Date(date).toLocaleDateString('en-uk')
}

export function getDefiInfo({ additionalInformation }: MetaData) {
  const cats = additionalInformation?.categories
  if (cats) {
    const contains = (prefix: string) => {
      const filtered = cats.filter(cat => cat.includes(prefix))
      return filtered.length > 0 ? filtered[0].substring(filtered[0].indexOf(":") + 1) : ""
    }
    return {
      category: contains(categoryPrefix),
      subcategory: contains(subcategoryPrefix),
      network: contains(networkPrefix),
    }
  }
}

export function getDdoTokenAddres(ddo: DDO) {
  return ddo.findServiceByType('access')
    ?.attributes
    ?.serviceAgreementTemplate
    ?.conditions
    ?.find(({ name }) => name === 'lockPayment')
    ?.parameters
    ?.find(({ name }) => name === '_tokenAddress')
    ?.value
}
