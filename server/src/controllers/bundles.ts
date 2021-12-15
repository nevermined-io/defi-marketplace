import { IDataset } from '../models/Dataset'
import db from '../models'
import { IBundle } from '../models/Bundle'

export const createBundle = async (bundle: IBundle, datasets: IDataset[]) => {
  try {
    const bundleSaved = await db.Bundles.create(bundle)
    await bundleSaved.addDatasets(datasets)
  } catch (error) {
    throw error
  }
}
