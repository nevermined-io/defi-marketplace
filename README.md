[![banner](https://raw.githubusercontent.com/nevermined-io/assets/main/images/logo/banner_logo.png)](https://nevermined.io)

# DeFi Data Marketplace

- [DeFi Data Marketplace](#defi-data-marketplace)
  - [Get Started](#get-started)
    - [Starting the environment](#starting-the-environment)
    - [Configuration](#configuration)
      - [Environment Variables](#environment-variables)
      - [Connecting to local NVM](#connecting-to-local-nvm)
      - [Connecting to Mumbai](#connecting-to-mumbai)
    - [Testing](#testing)
    - [Code Style](#code-style)
    - [Production](#production)
    - [How to make a release](#how-to-make-a-release)
    - [Changelog](#changelog)
    - [Build](#build)
    - [License](#license)

## Get Started

This repo contains a client and a server, both written in TypeScript:

- **client**: Nextjs app setup with [Nevermined SDK JS](https://github.com/nevermined-io/sdk-js). Web app with the markeplace frontend.
- **server**: Node.js app, using [Express](https://expressjs.com). Used to create bundles on user purchase.

To run these services, first install the dependencies:

```bash
npm install
```

In development mode, run:
```bash
npm run dev
```

And for the server:
```bash
npm run start-watch
```

Open [http://localhost:3000](http://localhost:3000) to view the client in the browser.

### Starting the environment

The client is configured to run as a standalone service. Using the configuration provided, the client will connect to the test environment in mumbai testnet. In order to change this configuration and use a local nevermined stack, change the enviroment variables described in the section [environment variables](#environment-variables)

The server needs a database in order to save and retrieve the data needed to create the bundles, To create this database a docker-compose.yml file is provided. Cd into the server folder and run:

```bash
docker-compose up
```

This will create a MySql database where the server will store the data. Next step is to create the database schema. To do so, we can execute [this script](https://github.com/nevermined-io/defi-dataset-loader/blob/master/data/database_schema.sql) in the new database created, that will create the schema for us.

### Configuration
Both client an server have some environment variables that configure which environment will be used.

#### Environment Variables
On the client side there are two files that contains env vars.
* `src/config.ts`
* `next.config.js`

On the server side, the env vars are defined at
* `src/config.ts`

#### Connecting to local NVM
In order to connect with a local NVM instance we need to change the following env vars

```bash
NEXT_PUBLIC_GATEWAY_ADDRESS=0x068ed00cf0441e4829d9784fcbe7b9e26d4bd8d0
NEXT_PUBLIC_BUNDLE_SERVICE_URI="http://localhost:4001"
NEXT_PUBLIC_ACCESS_CONDITION_URI="http://localhost:9000/subgraphs/name/neverminedio/AccessCondition"
NEXT_PUBLIC_METADATA_URI="http://metadata:5000"
NEXT_PUBLIC_GATEWAY_URI="http://localhost:8030"
NEXT_PUBLIC_FAUCET_URI="http://localhost:3001"
```

#### Connecting to Mumbai

To connect to the mumbai enviroment the values should be as follows

```bash
NEXT_PUBLIC_GATEWAY_ADDRESS=0x068ed00cf0441e4829d9784fcbe7b9e26d4bd8d0
NEXT_PUBLIC_BUNDLE_SERVICE_URI="https://defi.v2.marketplace-api.mumbai.nevermined.rocks/"
NEXT_PUBLIC_ACCESS_CONDITION_URI="https://graph-node.mumbai.keyko.rocks/subgraphs/name/neverminedio/AccessCondition"
NEXT_PUBLIC_METADATA_URI="https://metadata.mumbai.nevermined.rocks"
NEXT_PUBLIC_GATEWAY_URI="https://gateway.mumbai.nevermined.rocks"
NEXT_PUBLIC_FAUCET_URI="http://localhost:3001"
```

### Testing

For run the tests you can use on each project folder:

```bash
npm test
```

### Code Style
For linting and auto-formatting you can use on each project folder:

```bash
npm run lint
```

### Production
To create the production code run:

```bash
npm run build
```

### How to make a release
1. Make sure that the versions in both package.json (client, server) files are up to date.

2. Tag the repo and push the tag
```bash
git tag v0.1.0
git push origin v0.1.0
```
### Changelog
See the [CHANGELOG.md](./CHANGELOG.md) file. This file is auto-generated during the above mentioned release process.
### Build

### License

```bash
Copyright 2022 Nevermined AG
This product includes software developed at
BigchainDB GmbH and Ocean Protocol (https://www.oceanprotocol.com/)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```