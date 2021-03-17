import {
  Project,
  Account,
  TransactionTemplate,
  ScriptTemplate
} from "api/apollo/generated/graphql";
import { strToSeed, uuid } from "../../util/rng";

const DEFAULT_ACCOUNT_1 = `// HelloWorld.cdc
//
// Welcome to Cadence! This is one of the simplest programs you can deploy on Flow.
//
// The HelloWorld contract contains a single string field and a public getter function.
//
// Follow the "Hello, World!" tutorial to learn more: https://docs.onflow.org/docs/hello-world

access(all) contract HelloWorld {

    // Declare a public field of type String.
    //
    // All fields must be initialized in the init() function.
    access(all) let greeting: String

    // The init() function is required if the contract contains any fields.
    init() {
        self.greeting = "Hello, World!"
    }

    // Public function that returns our friendly greeting!
    access(all) fun hello(): String {
        return self.greeting
    }
}
`;

const DEFAULT_ACCOUNT_2 = `access(all) contract HelloWorld {

  // Declare a public field of type String.
  //
  // All fields must be initialized in the init() function.
  access(all) let greeting: String

  // The init() function is required if the contract contains any fields.
  init() {
      self.greeting = "Hello from account 2!"
  }

  // Public function that returns our friendly greeting!
  access(all) fun hello(): String {
      return self.greeting
  }
}
`;

const DEFAULT_ACCOUNT_3 = `access(all) contract HelloWorld {

  // Declare a public field of type String.
  //
  // All fields must be initialized in the init() function.
  access(all) let greeting: String

  // The init() function is required if the contract contains any fields.
  init() {
      self.greeting = "Hello from account 3!"
  }

  // Public function that returns our friendly greeting!
  access(all) fun hello(): String {
      return self.greeting
  }
}
`;

const DEFAULT_ACCOUNT_4 = `access(all) contract HelloWorld {

  // Declare a public field of type String.
  //
  // All fields must be initialized in the init() function.
  access(all) let greeting: String

  // The init() function is required if the contract contains any fields.
  init() {
      self.greeting = "Hello from account 4!"
  }

  // Public function that returns our friendly greeting!
  access(all) fun hello(): String {
      return self.greeting
  }
}
`;

const DEFAULT_ACCOUNT_5 = `/**

# The Flow Fungible Token standard

## FungibleToken contract interface

The interface that all fungible token contracts would have to conform to.
If a users wants to deploy a new token contract, their contract
would need to implement the FungibleToken interface.

Their contract would have to follow all the rules and naming
that the interface specifies.

## Vault resource

Each account that owns tokens would need to have an instance
of the Vault resource stored in their account storage.

The Vault resource has methods that the owner and other users can call.

## Provider, Receiver, and Balance resource interfaces

These interfaces declare pre-conditions and post-conditions that restrict
the execution of the functions in the Vault.

They are separate because it gives the user the ability to share
a reference to their Vault that only exposes the fields functions
in one or more of the interfaces.

It also gives users the ability to make custom resources that implement
these interfaces to do various things with the tokens.
For example, a faucet can be implemented by conforming
to the Provider interface.

By using resources and interfaces, users of FungibleToken contracts
can send and receive tokens peer-to-peer, without having to interact
with a central ledger smart contract. To send tokens to another user,
a user would simply withdraw the tokens from their Vault, then call
the deposit function on another user's Vault to complete the transfer.

*/

/// FungibleToken
///
/// The interface that fungible token contracts implement.
///
pub contract interface FungibleToken {

    /// The total number of tokens in existence.
    /// It is up to the implementer to ensure that the total supply
    /// stays accurate and up to date
    ///
    pub var totalSupply: UFix64

    /// TokensInitialized
    ///
    /// The event that is emitted when the contract is created
    ///
    pub event TokensInitialized(initialSupply: UFix64)

    /// TokensWithdrawn
    ///
    /// The event that is emitted when tokens are withdrawn from a Vault
    ///
    pub event TokensWithdrawn(amount: UFix64, from: Address?)

    /// TokensDeposited
    ///
    /// The event that is emitted when tokens are deposited into a Vault
    ///
    pub event TokensDeposited(amount: UFix64, to: Address?)

    /// Provider
    ///
    /// The interface that enforces the requirements for withdrawing
    /// tokens from the implementing type.
    ///
    /// It does not enforce requirements on balance here,
    /// because it leaves open the possibility of creating custom providers
    /// that do not necessarily need their own balance.
    ///
    pub resource interface Provider {

        /// withdraw subtracts tokens from the owner's Vault
        /// and returns a Vault with the removed tokens.
        ///
        /// The function's access level is public, but this is not a problem
        /// because only the owner storing the resource in their account
        /// can initially call this function.
        ///
        /// The owner may grant other accounts access by creating a private
        /// capability that allows specific other users to access
        /// the provider resource through a reference.
        ///
        /// The owner may also grant all accounts access by creating a public
        /// capability that allows all users to access the provider
        /// resource through a reference.
        ///
        pub fun withdraw(amount: UFix64): @Vault {
            post {
                // result refers to the return value
                result.balance == amount:
                    "Withdrawal amount must be the same as the balance of the withdrawn Vault"
            }
        }
    }

    /// Receiver
    ///
    /// The interface that enforces the requirements for depositing
    /// tokens into the implementing type.
    ///
    /// We do not include a condition that checks the balance because
    /// we want to give users the ability to make custom receivers that
    /// can do custom things with the tokens, like split them up and
    /// send them to different places.
    ///
    pub resource interface Receiver {

        /// deposit takes a Vault and deposits it into the implementing resource type
        ///
        pub fun deposit(from: @Vault)
    }

    /// Balance
    ///
    /// The interface that contains the balance field of the Vault
    /// and enforces that when new Vaults are created, the balance
    /// is initialized correctly.
    ///
    pub resource interface Balance {

        /// The total balance of a vault
        ///
        pub var balance: UFix64

        init(balance: UFix64) {
            post {
                self.balance == balance:
                    "Balance must be initialized to the initial balance"
            }
        }
    }

    /// Vault
    ///
    /// The resource that contains the functions to send and receive tokens.
    ///
    pub resource Vault: Provider, Receiver, Balance {

        // The declaration of a concrete type in a contract interface means that
        // every Fungible Token contract that implements the FungibleToken interface
        // must define a concrete Vault resource that conforms to the Provider, Receiver,
        // and Balance interfaces, and declares their required fields and functions

        /// The total balance of the vault
        ///
        pub var balance: UFix64

        // The conforming type must declare an initializer
        // that allows prioviding the initial balance of the Vault
        //
        init(balance: UFix64)

        /// withdraw subtracts amount from the Vault's balance
        /// and returns a new Vault with the subtracted balance
        ///
        pub fun withdraw(amount: UFix64): @Vault {
            pre {
                self.balance >= amount:
                    "Amount withdrawn must be less than or equal than the balance of the Vault"
            }
            post {
                // use the special function before to get the value of the balance field
                // at the beginning of the function execution
                //
                self.balance == before(self.balance) - amount:
                    "New Vault balance must be the difference of the previous balance and the withdrawn Vault"
            }
        }

        /// deposit takes a Vault and adds its balance to the balance of this Vault
        ///
        pub fun deposit(from: @Vault) {
            post {
                self.balance == before(self.balance) + before(from.balance):
                    "New Vault balance must be the sum of the previous balance and the deposited Vault"
            }
        }
    }

    /// createEmptyVault allows any user to create a new Vault that has a zero balance
    ///
    pub fun createEmptyVault(): @Vault {
        post {
            result.balance == 0.0: "The newly created Vault must have zero balance"
        }
    }
}
`;

const DEFAULT_ACCOUNT_6 = `/**

# The Flow Non-Fungible Token standard

## NonFungibleToken contract interface

The interface that all non-fungible token contracts could conform to.
If a user wants to deploy a new nft contract, their contract would need
to implement the NonFungibleToken interface.

Their contract would have to follow all the rules and naming
that the interface specifies.

## NFT resource

The core resource type that represents an NFT in the smart contract.

## Collection Resource

The resource that stores a user's NFT collection.
It includes a few functions to allow the owner to easily
move tokens in and out of the collection.

## Provider and Receiver resource interfaces

These interfaces declare functions with some pre and post conditions
that require the Collection to follow certain naming and behavior standards.

They are separate because it gives the user the ability to share a reference
to their Collection that only exposes the fields and functions in one or more
of the interfaces. It also gives users the ability to make custom resources
that implement these interfaces to do various things with the tokens.

By using resources and interfaces, users of NFT smart contracts can send
and receive tokens peer-to-peer, without having to interact with a central ledger
smart contract.

To send an NFT to another user, a user would simply withdraw the NFT
from their Collection, then call the deposit function on another user's
Collection to complete the transfer.

*/

// The main NFT contract interface. Other NFT contracts will
// import and implement this interface 
//
pub contract interface NonFungibleToken {

    // The total number of tokens of this type in existence
    pub var totalSupply: UInt64

    // Event that emitted when the NFT contract is initialized
    //
    pub event ContractInitialized()

    // Event that is emitted when a token is withdrawn,
    // indicating the owner of the collection that it was withdrawn from.
    //
    // If the collection is not in an account's storage, from will be nil.
    //
    pub event Withdraw(id: UInt64, from: Address?)

    // Event that emitted when a token is deposited to a collection.
    //
    // It indicates the owner of the collection that it was deposited to.
    //
    pub event Deposit(id: UInt64, to: Address?)

    // Interface that the NFTs have to conform to
    //
    pub resource interface INFT {
        // The unique ID that each NFT has
        pub let id: UInt64
    }

    // Requirement that all conforming NFT smart contracts have
    // to define a resource called NFT that conforms to INFT
    pub resource NFT: INFT {
        pub let id: UInt64
    }

    // Interface to mediate withdraws from the Collection
    //
    pub resource interface Provider {
        // withdraw removes an NFT from the collection and moves it to the caller
        pub fun withdraw(withdrawID: UInt64): @NFT {
            post {
                result.id == withdrawID: "The ID of the withdrawn token must be the same as the requested ID"
            }
        }
    }

    // Interface to mediate deposits to the Collection
    //
    pub resource interface Receiver {

        // deposit takes an NFT as an argument and adds it to the Collection
        //
		pub fun deposit(token: @NFT)
    }

    // Interface that an account would commonly 
    // publish for their collection
    pub resource interface CollectionPublic {
        pub fun deposit(token: @NFT)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NFT
    }

    // Requirement for the the concrete resource type
    // to be declared in the implementing contract
    //
    pub resource Collection: Provider, Receiver, CollectionPublic {

        // Dictionary to hold the NFTs in the Collection
        pub var ownedNFTs: @{UInt64: NFT}

        // withdraw removes an NFT from the collection and moves it to the caller
        pub fun withdraw(withdrawID: UInt64): @NFT

        // deposit takes a NFT and adds it to the collections dictionary
        // and adds the ID to the id array
        pub fun deposit(token: @NFT)

        // getIDs returns an array of the IDs that are in the collection
        pub fun getIDs(): [UInt64]

        // Returns a borrowed reference to an NFT in the collection
        // so that the caller can read data and call methods from it
        pub fun borrowNFT(id: UInt64): &NFT {
            pre {
                self.ownedNFTs[id] != nil: "NFT does not exist in the collection!"
            }
        }
    }

    // createEmptyCollection creates an empty Collection
    // and returns it to the caller so that they can own NFTs
    pub fun createEmptyCollection(): @Collection {
        post {
            result.getIDs().length == 0: "The created collection must be empty!"
        }
    }
}
`;

const DEFAULT_ACCOUNTS = [
  DEFAULT_ACCOUNT_1,
  DEFAULT_ACCOUNT_2,
  DEFAULT_ACCOUNT_3,
  DEFAULT_ACCOUNT_4,
  DEFAULT_ACCOUNT_5,
  DEFAULT_ACCOUNT_6
];

const DEFAULT_TRANSACTION = `import HelloWorld from 0x01

transaction {

  prepare(acct: AuthAccount) {}

  execute {
    log(HelloWorld.hello())
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
    DEFAULT_ACCOUNTS,
    [{ title: "Transaction", code: DEFAULT_TRANSACTION }],
    [{ title: "Script" , code :DEFAULT_SCRIPT }]
  );
}

type ScriptDetails = {
  code: string,
  title: string
}

export function createLocalProject(
  parentId: string | null,
  seed: number,
  accounts: Array<string>,
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
    transactionTemplates: transactionTemplatesEntities,
    scriptTemplates: scriptsTemplatesEntities,
    version: ""
  };
}
