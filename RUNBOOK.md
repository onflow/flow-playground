## Overview 

The Flow Playground is an web-based interactive IDE for running Cadence code.
It also provides code for the tutorial projects found here: https://docs.onflow.org/cadence/tutorial/01-first-steps

The overall project consists of the Web app (this) and an API backend: https://github.com/onflow/flow-playground-api

The Playground Web App is implemented in React. The major components are as follows:

- GraphQL / Apollo Client
  - All HTTP communication with the Playground API is donce via `GraphQL` using the `Apollo` client. 
  - The GrpahQL schema is defined by the Playground API here: https://github.com/onflow/flow-playground-api/blob/master/schema.graphql
    - This project uses the Apollo clients localStorage interface as well. 
    - You can view the _local_ GraphQL schema here: https://github.com/onflow/flow-playground/blob/master/src/api/apollo/local.graphql
  - CRUD methods (wrapped Apollo client) are implemented here: https://github.com/onflow/flow-playground/blob/master/src/providers/Project/projectMutator.ts 
  - Typescript typings, and CRUD methods for Apollo are auto-generated using: https://www.graphql-code-generator.com/
  - After making changes to the `schema.local` you'll need to run `npm run graphql:codegen` to auto-generate new typings and methods for Apollo client.

- Monaco Editor
  - The editor interface itself is implemented using https://microsoft.github.io/monaco-editor/
  - The editor component can be found here: https://github.com/onflow/flow-playground/tree/master/src/containers/Editor
  - The Cadence language definition (for linting and syntax highlighting) for Monaco can be found here: https://github.com/onflow/flow-playground/blob/master/src/util/cadence.ts

- Cadence Language Server
  - The Cadence Language Server (protocol for Monaco) is implemented in WASM. 
    - You can read about it here: https://github.com/onflow/cadence/blob/master/languageserver/README.md 
  - The integration can be found here: 
      - https://github.com/onflow/flow-playground/blob/master/src/util/language-server.ts
      - https://github.com/onflow/flow-playground/blob/master/src/util/language-client.ts

## Deployment

### Access

To create a Playground deployment, your user must: 
- Be added to the Flow/Dapper Labs Teamcity account
- Have write access to this repository for triggering Teamcity deploys (details below): https://github.com/dapperlabs/flow-playground
- Be connected to the Office VPN

A request for these should be filed here: https://dapperlabs.happyfox.com/

### Deployment Workflow

**Staging Deployment**

Once your PR contribution has been successfully merged into the `master` branch, you must take the following steps: 
1) Tag your commit, following [semver](https://semver.org/) conventions eg `git tag v0.42.0`
    - To find the current tag use: `git fetch --all && git tag` to display a list of tags.
2) Push your tag to the main branch: `git push origin --tags`
3) To trigger a staging deployment, update the version number here: https://github.com/dapperlabs/flow-playground/blob/master/Makefile#L3
    - Make sure the version number here, matches your new tag, if you want your changes to be deployed. 
4) Once updated visit: https://ci.eng.dapperlabs.com/buildConfiguration/Flow_FlowPlayground_FlowTestNetwork_BuildCiCdPlaygroundStaging#all-projects
    - Here, you will see your deployment in the queue, and the build log output.
5) If the Teamcity build succeeds your chnges will be available to preview here: https://play.staging.onflow.org

**Production Deployment**

Once a staging deployment has been verified. To move the changes into produciton, navigate to the production pipeline in Teamcity here: https://ci.eng.dapperlabs.com/buildConfiguration/Flow_FlowPlayground_FlowTestNetwork_BuildCiCdPlaygroundProduction#all-projects and click the "Deploy" button in the top right of the table. 

Procuction deployment progress can be viewed here: https://ci.eng.dapperlabs.com/buildConfiguration/Flow_FlowPlayground_FlowTestNetwork_BuildCiCdPlaygroundProduction#all-projects

**Deployment Guide Notion Doc**: 

More details and screenshots regarding the deployment process can be found here.
https://www.notion.so/dapperlabs/Flow-Playground-Deployment-Process-6ca452adb63a4b41bbe5f3b56eda7021

### Important Gotcha: User Sessions & Project "Forking"

_The Playground will not function in browsers where cookies or localStorage are disabled._

#### How It Works

The Playground determines what content to load into the UI based on a url query param named `projectId`.
- When a user first visits the Playground, the `projectId` param is set to `local-project`, indicating that this is a new project and has not been persisted.
  - https://github.dev/onflow/flow-playground/blob/2e3323aba9504e6a07fc13d1b2cec0e703edce43/src/util/url.ts#L16-L17
- At this point, a representation of the `Project` _model_ has been boostrapped and persisted to the browser's localStorage using Apollo
  - https://github.dev/onflow/flow-playground/blob/2e3323aba9504e6a07fc13d1b2cec0e703edce43/src/providers/Project/projectDefault.ts#L216
  - https://github.dev/onflow/flow-playground/blob/2e3323aba9504e6a07fc13d1b2cec0e703edce43/src/providers/Project/projectHooks.ts#L10-L11
- When a user performs some action that updates any field in the project, or clicks the save button, the project is read from localStorage, and sent to the API to be persisted. 
  - https://github.dev/onflow/flow-playground/blob/2e3323aba9504e6a07fc13d1b2cec0e703edce43/src/providers/Project/projectMutator.ts#L54-L55
- Once the mutation has returned successfully (The project state has been saved to the DB), another local value is set using Apollo/localstorage, to reflect the newly generated project's unique `id` (from the database)
  - https://github.dev/onflow/flow-playground/blob/2e3323aba9504e6a07fc13d1b2cec0e703edce43/src/providers/Project/projectMutator.ts#L93-L94
- The server response also sets a cookie **that links the current browser session with the new project ID** 
  - This is done so that if a user _shares_ a link to their new project (eg. https://play.onflow.org/46c7136f-803c-4166-9d46-25d8e927114c), to someone without the session cookie linking the ID and browser session, the UI will recognise (the save button becomes "fork") that this is the case, and on subsequent saves of the shared project, _will send a mutation to generate a new project based on the existing contents of the editor, preventing users from overwriting eachothers projects!_
 - The name of the cookie is `flow-playground`



