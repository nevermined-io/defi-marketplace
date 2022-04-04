import { Router, Request, Response } from 'express'
import { findSampleByCategory } from '../controllers/samples'

const router = Router()

const getSample = async (req: Request, res: Response) => {

  const { protocol_type, event_type } = req.params
  const sample = await findSampleByCategory(protocol_type, event_type)

  if (!sample) {
    res
      .status(500)
      .json({ message: 'internal server error' })
      .send()
  }

  res.json({ sample })
}

router.get('/:protocol_type/:event_type', getSample)

export default router
