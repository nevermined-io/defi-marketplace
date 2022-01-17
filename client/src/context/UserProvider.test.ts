import { UserProvider } from './UserProvider'

describe('UserProvider', () => {
  describe('removeFromBasket', () => {
    it('removes dids from basket', () => {
      const userProvider = new UserProvider()
      userProvider.addToBasket(['did1', 'did2', 'did3', 'did4'])
      const stillSelected = userProvider.removeFromBasket(['did2', 'did4'])
      expect(stillSelected).toEqual(['did1', 'did3'])
    })
  })
})
