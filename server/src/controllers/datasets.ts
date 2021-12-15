import db from '../models'
import { IDataset } from '../models/Dataset'

export const createDataset = async (dataset: IDataset) => {
  try {
    const exists: any[] = await findDatasetByKey(dataset)

    const datasetID = exists.length == 0 ?
      await db.Datasets.create(dataset)
      :
      exists[0]

    return datasetID
  } catch (error) {
    throw error
  }
}

export const findDatasetByKey = (dataset: IDataset) => {
  try {
    return db.Datasets.findAll({
      where: {
        key: dataset.key
      }
    });
  } catch (error) {
    throw error
  }
}
