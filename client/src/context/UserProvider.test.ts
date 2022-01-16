import { UserProvider } from './UserProvider'

describe('UserProvider', () => {
  describe('removeFromBatchSelected', () => {
    it('removes dids from batchSelected', () => {
      const userProvider = new UserProvider()
      userProvider.addToBatchSelected(['did1', 'did2', 'did3', 'did4'])
      const stillSelected = userProvider.removeFromBatchSelected(['did2', 'did4'])
      expect(stillSelected).toEqual(['did1', 'did3'])
    })
  })
})
