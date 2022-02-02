import { Router, Request, Response } from 'express'
import { getAllUserBundles } from '../controllers/bundles'

const router = Router()


const getUserHistory = async (req: Request, res: Response) => {

  const { id } = req.params
  const bundles = await getAllUserBundles(id)

  if (!bundles) {
    res
      .status(500)
      .json({ message: 'internal server error' })
      .send()
  }

  res.json({ bundles })
}

router.get('/history/:id', getUserHistory)

export default router
