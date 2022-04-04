import db from '../models'
import { ISample } from '../models/Sample'


export const findSampleByCategory = (protocol_type: string, event_type: string): ISample => {
  try {
    return db.Samples.findOne({
      where: {
        protocol_type,
        event_type
      }
    });
  } catch (error) {
    throw error
  }
}
