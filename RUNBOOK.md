## Overview 

The Flow Playground is an web-based interactive IDE for running Cadence code.
It also provides code for the tutorial projects found here: https://docs.onflow.org/cadence/tutorial/01-first-steps

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



