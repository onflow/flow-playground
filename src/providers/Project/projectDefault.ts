import {
  Account,
  ContractTemplate,
  Project,
  ScriptTemplate,
  TransactionTemplate,
} from 'api/apollo/generated/graphql';
import { accountIndexes } from 'util/accounts';
import { strToSeed, uuid } from 'util/rng';
import { LOCAL_PROJECT_ID } from 'util/url';

const HelloWorldContract = `// HelloWorld.cdc
//
// Welcome to Cadence! This is one of the simplest programs you can deploy on Flow.
//
// The HelloWorld contract contains a single string field and a public getter function.
//
// Follow the "Hello, World!" tutorial to learn more: https://docs.onflow.org/cadence/tutorial/02-hello-world/
pub contract HelloWorld {
  // Declare a public field of type String.
  //
  // All fields must be initialized in the init() function.
  pub var greeting: String

  // Public function that returns our friendly greeting!
  access(all) fun changeGreeting(newGreeting: String) {
    self.greeting = newGreeting
  }

  // Public function that returns our friendly greeting!
  access(all) fun hello(): String {
      return self.greeting
  }

  // The init() function is required if the contract contains any fields.
  init() {
    self.greeting = "Hello, World!"
  }
}
`;

export const DEFAULT_ACCOUNT_STATE = '{}';

const DEFAULT_TRANSACTION = `import HelloWorld from 0x05

transaction(greeting: String) {

  prepare(acct: AuthAccount) {
    log(acct.address)
  }

  execute {
    HelloWorld.changeGreeting(newGreeting: greeting)
  }
}
`;

const DEFAULT_SCRIPT = `import HelloWorld from 0x05

pub fun main() {
  log(HelloWorld.hello())
}
`;

export const SEED_TITLE = 'Untitled Project';
export const SEED_DESCRIPTION = 'Showcase Cadence interactions';
export const SEED_README = '';

export const PLACEHOLDER_TITLE = 'Name of your project';
export const PLACEHOLDER_DESCRIPTION =
  'Single sentence describing this project';
export const PLACEHOLDER_README = `Here you can provide a detailed explanation to help others understand how to use your Playground project.
Editor supports Markdown. Please, consult https://www.markdownguide.org/cheat-sheet/ for examples and tips.`;

export function createDefaultProject(): Project {
  return createLocalProject(
    null,
    strToSeed(uuid()),
    SEED_TITLE,
    SEED_DESCRIPTION,
    SEED_README,
    accountIndexes(),
    [
      {
        title: `HelloWorld`,
        code: HelloWorldContract,
      },
    ],
    [{ title: 'ChangeGreeting', code: DEFAULT_TRANSACTION }],
    [{ title: 'GetGreeting', code: DEFAULT_SCRIPT }],
  );
}

type ScriptDetails = {
  code: string;
  title: string;
};

export function createLocalProject(
  parentId: string | null,
  seed: number,
  title: string,
  description: string,
  readme: string,
  accounts: Array<string>,
  contractTemplates: Array<ScriptDetails>,
  transactionTemplates: Array<ScriptDetails>,
  scriptTemplates: Array<ScriptDetails>,
): Project {
  const accountEntities: Account[] = accounts.map((_account) => {
    return {
      __typename: 'Account',
      address: `000000000000000${_account}`,
      deployedContracts: [],
      state: DEFAULT_ACCOUNT_STATE,
    };
  });
  const contractTemplatesEntities: ContractTemplate[] = contractTemplates.map(
    (script, i) => {
      return {
        __typename: 'ContractTemplate',
        id: `local-contract-temp-${i}`,
        title: script.title || `Contract ${i + 1}`,
        script: script.code,
        index: i,
      };
    },
  );

  const transactionTemplatesEntities: TransactionTemplate[] =
    transactionTemplates.map((script, i) => {
      const { title, code } = script;
      return {
        __typename: 'TransactionTemplate',
        id: `local-tx-temp-${i}`,
        title: title || `Transaction ${i + 1}`,
        script: code,
        index: i,
      };
    });

  const scriptsTemplatesEntities: ScriptTemplate[] = scriptTemplates.map(
    (script, i) => {
      const { title, code } = script;
      return {
        __typename: 'ScriptTemplate',
        id: `local-script-temp-${i}`,
        title: title || `Script ${i + 1}`,
        script: code,
        index: i,
      };
    },
  );

  return {
    __typename: 'Project',
    id: LOCAL_PROJECT_ID,
    publicId: '',
    persist: false,
    mutable: false,
    title: title,
    description: description,
    readme: readme,
    seed: seed,
    parentId: parentId,
    accounts: accountEntities,
    contractTemplates: contractTemplatesEntities,
    transactionTemplates: transactionTemplatesEntities,
    scriptTemplates: scriptsTemplatesEntities,
    version: '',
    numberOfAccounts: accountEntities.length,
    updatedAt: null,
    contractDeployments: [],
  };
}
