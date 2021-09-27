import { DDO, MetaData } from '@nevermined-io/nevermined-sdk-js'

import { categories, subcategories, networks } from './constants'

export function toDate(date: string) {
  return new Date(date).toLocaleDateString('en-uk')
}

export function getDefiInfo({additionalInformation}: MetaData) {
  const cats = additionalInformation?.categories
  if (cats) {
    const contains = (list: string[]) => cats.find(cat => list.includes(cat))
    return {
      category: contains(categories), 
      subcategory: contains(subcategories), 
      network: contains(networks),
    }
  }
}