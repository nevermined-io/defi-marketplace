import { Router, Request, Response } from 'express'
import { createBundle } from '../controllers/bundles'
import { createDataset } from '../controllers/datasets'
import { v4 as uuidv4 } from 'uuid'
import { IDataset } from '../models/Dataset'

const router = Router()

const create = async (req: Request, res: Response) => {
  try {
    const datasets = req.body.datasets.map(
      dataset => {
        return {
          dataset_id: uuidv4(),
          key: dataset.key,
          source: dataset.source,
          file_name: dataset.file_name
        }
      }
    )
    const savedDatasets = await saveDatasets(datasets)
    const bundle = await saveBundle(req.body.user, savedDatasets)

    res.json({ "status": "OK" })

  } catch (error) {
    res.sendStatus(500).json(error.message)
  }
}


const saveBundle = async (user: string, datasets: IDataset[]) => {
  const bundleId = uuidv4()
  return createBundle({
    bundle_id: bundleId,
    did: "",
    status: "PENDING",
    user
  }, datasets)
}

const saveDatasets = async (datasets: IDataset[]) => {
  const datasetsSaved = await Promise.all(
    datasets.map(dataset => createDataset(dataset))
  )
  return datasetsSaved
}

router.post('/create', create)

export default router
