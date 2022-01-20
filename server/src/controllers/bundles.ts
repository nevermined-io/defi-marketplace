import { IDataset } from '../models/Dataset'
import db from '../models'
import { IBundle } from '../models/Bundle'


export const createBundle = async (bundle: IBundle, datasets: IDataset[]) => {
  try {
    const bundleSaved = await db.Bundles.create(bundle)
    await bundleSaved.addDatasets(datasets)

    return bundleSaved.dataValues.bundle_id

  } catch (error) {
    console.log(error)
    throw error
  }
}


export const getBundleStatus = async (id: string): Promise<IBundle> => {
  try {
    const bundle = await db.Bundles.findAll({
      where: {
        bundle_id: id
      }
    });

    if (bundle.lenght == 0) return null

    const { bundle_id, user, did, status } = bundle[0].dataValues

    return {
      bundle_id,
      user,
      did,
      status
    }

  } catch (error) {
    console.log(error)
    throw error
  }
}
