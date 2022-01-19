import db from '../models'
import { IDataset } from '../models/Dataset'

export const createDataset = async (dataset: IDataset) => {
  try {
    const exists: any[] = await findDatasetByName(dataset)

    const datasetID = exists.length == 0 ?
      await db.Datasets.create(dataset)
      :
      exists[0]

    return datasetID
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const findDatasetByName = (dataset: IDataset) => {
  try {
    return db.Datasets.findAll({
      where: {
        file_name: dataset.file_name
      }
    });
  } catch (error) {
    throw error
  }
}
