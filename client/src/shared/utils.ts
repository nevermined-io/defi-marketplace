import { DDO, MetaData } from '@nevermined-io/nevermined-sdk-js'
import { categoryPrefix, subcategoryPrefix, networkPrefix, SubscriptionTiers } from './constants'
import {NFT_TIERS} from '../config'

export function toDate(date: string) {
  return new Date(date).toLocaleDateString('en-uk')
}

export function getDefiInfo({ additionalInformation }: MetaData) {
  const cats = additionalInformation?.categories
  if (cats) {
    const contains = (prefix: string) => {
      const filtered = cats.filter((cat) => cat.includes(prefix))
      return filtered.length > 0 ? filtered[0].substring(filtered[0].indexOf(':') + 1) : ''
    }
    return {
      category: contains(categoryPrefix),
      subcategory: contains(subcategoryPrefix),
      network: contains(networkPrefix)
    }
  }
}

export function getDdoTokenAddress(ddo: DDO) {
  return ddo
    .findServiceByType('nft-access')
    ?.attributes?.serviceAgreementTemplate?.conditions?.find(({ name }) => name === 'lockPayment')
    ?.parameters?.find(({ name }) => name === '_tokenAddress')?.value
}

export interface DDOSubscription {
  address: string
  tier: SubscriptionTiers
}

export function getDdoSubscription(ddo: DDO): DDOSubscription {

  const subscriptionAddress = ddo
  .findServiceByType('nft-access')
  ?.attributes?.serviceAgreementTemplate?.conditions?.find(({name}:any)  => name === 'nftHolder')
  ?.parameters?.find(({name}:any)  => name === '_contractAddress')?.value

  const tier: string = NFT_TIERS.find( tier => tier.address === subscriptionAddress)?.name || ''

  return {
    address: subscriptionAddress?.toString() || "",
    tier: tier as SubscriptionTiers
  }

}

export const getAttributes = (ddo: DDO): MetaData => ddo.findServiceByType('metadata')?.attributes

export const getCategories = (atts: MetaData): string[] | undefined =>
  atts?.additionalInformation?.categories

export const getVersion = (categories: string[] | undefined) =>
  categories
    ?.find((cat) => cat.includes('Version') || /\d/.test(cat))
    ?.split('.')
    .pop()

export const calculateStartEndPage = (page: number, itemsPerPage: number) => {
  const start = (page - 1) * itemsPerPage
  const end = page * itemsPerPage
  return { start, end }
}

export const calculatePages = (totalItems: number, itemsPerPage: number) => {
  return Math.ceil(totalItems / itemsPerPage)
}
