import {
  Project,
  Account,
  Contract,
  TransactionTemplate,
  ScriptTemplate
} from "api/apollo/generated/graphql";
import { integer } from "vscode-languageserver-types";
import { strToSeed, uuid } from "../../util/rng";

const CONTRACT_TEMPLATE = `// Cadence contract
// Welcome to Cadence! This is one of the simplest programs you can deploy on Flow.
// The HelloWorld contract contains a single string field and a public getter function.
// Follow the "Hello, World!" tutorial to learn more: https://docs.onflow.org/cadence/tutorial/02-hello-world/

access(all) contract {FUNCTION_NAME} {

  // Declare a public field of type String.
  // All fields must be initialized in the init() function.
  access(all) let greeting: String

  // The init() function is required if the contract contains any fields.
  init() {
      self.greeting = "{GREETING} from account {ACCOUNT}!"
  }

  // Public function that returns our friendly greeting!
  access(all) fun greet(): String {
      return self.greeting
  }
}
`;

export function makeContract(functionName: string, greeting: string, accountName: string) {
  return CONTRACT_TEMPLATE.replace(`{FUNCTION_NAME}`, functionName)
                          .replace(`{GREETING}`, greeting)
                          .replace(`{ACCOUNT}`, accountName);
}

const DEFAULT_TRANSACTION = `import HelloWorld from 0x01

transaction {

  prepare(acct: AuthAccount) {}

  execute {
    log(HelloWorld.greet())
  }
}
`;

const DEFAULT_SCRIPT = `pub fun main(): Int {
  return 1
}
`;

export function createDefaultProject(): Project {
  return createLocalProject(
    null,
    strToSeed(uuid()),
    //soe this needs to be updated when number of accounts are made flexible instead of fixed 5
    ['','','','',''],
    [
      { title: "[DRAFT]", code: makeContract(`HelloWorld`, `Hello`, `0x01`), index: 0}, 
      { title: "[DRAFT]", code: makeContract(`HelloWorldA`, `HelloA`, `0x01`), index: 0},
      { title: "[DRAFT]", code: makeContract(`HelloWorldB`, `HelloB`, `0x01`), index: 0},
      { title: "[DRAFT]", code: makeContract(`HiWorld`, `Hi`, `0x02`), index: 1},
      { title: "[DRAFT]", code: makeContract(`HiWorldA`, `HiA`, `0x02`), index: 1},
      { title: "[DRAFT]", code: makeContract(`YoWorld`, `Yo`, `0x03`), index: 2},
      { title: "[DRAFT]", code: makeContract(`HolaWorld`, `Hola`, `0x04`), index: 3},
      { title: "[DRAFT]", code: makeContract(`HejsanWorld`, `Hejsan`, `0x05`), index: 4},
      { title: "[DRAFT]", code: makeContract(`HejsanWorldA`, `HejsanA`, `0x05`), index: 4},
    ],
    [{ title: "Transaction", code: DEFAULT_TRANSACTION }],
    [{ title: "Script" , code :DEFAULT_SCRIPT }]
  );
}

type ScriptDetails = {
  code: string,
  title: string
}

type ContractDetails = {
  code: string,
  title: string,
  index: integer
}

export function createLocalProject(
  parentId: string | null,
  seed: number,
  accounts: Array<string>,
  contracts: Array<ContractDetails>,
  transactionTemplates: Array<ScriptDetails>,
  scriptTemplates: Array<ScriptDetails>
): Project {
  const accountEntities: Account[] = accounts.map((script, i) => {
    return {
      __typename: "Account",
      id: `LOCAL-account-${i}`,
      address: `000000000000000000000000000000000000000${i + 1}`,
      title: "",
      draftCode: script,
      deployedCode: "",
      deployedContracts: [],
      state: ""
    };
  });

  const contractsEntities: Contract[] = contracts.map(
    (script, i) => {
      const { title, code, index } = script
      return {
        __typename: "Contract",
        id: `LOCAL-con-temp-${i}`,
        title: title || `CONTRACT_${i + 1}`,
        script: code,
        deployedScript: "",
        index: index,
      };
    }
  );

  const transactionTemplatesEntities: TransactionTemplate[] = transactionTemplates.map(
    (script, i) => {
      const { title, code } = script
      return {
        __typename: "TransactionTemplate",
        id: `LOCAL-tx-temp-${i}`,
        title: title || `Transaction ${i + 1}`,
        script: code,
        index: i,
      };
    }
  );

  const scriptsTemplatesEntities: ScriptTemplate[] = scriptTemplates.map(
    (script, i) => {
      const { title, code } = script
      return {
        __typename: "ScriptTemplate",
        id: `LOCAL-script-temp-${i}`,
        title: title || `Script ${i + 1}`,
        script: code,
        index: i,
      };
    }
  );

  return {
    __typename: "Project",
    id: "LOCAL-project",
    publicId: "",
    persist: false,
    mutable: false,
    title: "",
    seed: seed,
    parentId: parentId,
    accounts: accountEntities,
    contracts: contractsEntities,
    transactionTemplates: transactionTemplatesEntities,
    scriptTemplates: scriptsTemplatesEntities,
    version: ""
  };
}
