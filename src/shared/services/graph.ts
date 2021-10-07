export class GraphService {
  static instance: GraphService

  static getInstance() {
    return this.instance ??= new GraphService()
  }

  getConsumerAssets(address: string) {
    // Mocked data
    return Promise.resolve([
      'did:nv:f21c3eb2151f03f0e66b3f1df21981ec096ada2143af5af48f3b58dfbc70feaf',
      'did:nv:2d6115022a7e4d6cb20ffdd0c6e9cd1f938396e5d308d8fe246ad3d0609e762d',
      'did:nv:a2f9284cd60e14115e6a7ecc979813bbbd26be9da75d30754d9e0ec6b796d43c',
      ])
  }
}

export const graphService = GraphService.getInstance()
