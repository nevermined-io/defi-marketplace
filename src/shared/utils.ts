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

export function getDdoTokenAddress(ddo: DDO) {
  return ddo.findServiceByType('access')
    ?.attributes
    ?.serviceAgreementTemplate
    ?.conditions
    ?.find(({ name }) => name === 'lockPayment')
    ?.parameters
    ?.find(({ name }) => name === '_tokenAddress')
    ?.value
}


export const sortBy = (list: DDO[], key: Function) =>
  list.sort((a: any, b: any) => key(a) + key(b))

export const getAttributes = (ddo: DDO): MetaData =>
  ddo.findServiceByType('metadata')
    ?.attributes

export const getCategories = (atts: MetaData): (string[] | undefined)=>
  atts
    ?.additionalInformation
    ?.categories

export const getVersion = (categories: string[] | undefined) =>
  categories
    ?.find(cat => cat.includes('Version') || /\d/.test(cat))
    ?.split('.').pop()

