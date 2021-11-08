export const getInterpolatedTemplate = (type: string, contractOwner: string, path: string, contractResource: string, interfaces: string): any => {
  if (type === 'tx') {
  return `// TEMPLATE TRANSACTION

// Below, the 'borrowedCapability' constant borrows a capability from a public path
// for a given account. The capability is scoped to a given contract and the implemented
// interfaces within that contract. For the Capability you chose the contract was 
// deployed by ${contractOwner} and implements these interfaces: ${interfaces}.

// Copy-paste 'borrowedCapability into a transaction that suits your needs. Make
// sure the 'address' parameter in 'getAccount()' is a valid account address.

/*
let borrowedCapability = getAccount(address)
    .getCapability(${path})
    .borrow<&${contractResource}{${interfaces}}>()
    ?? panic("Could not borrow the capability")
*/`

  } else if (type === 'script') {
  return `// TEMPLATE SCRIPT

// Below, the 'borrowedCapability' constant borrows a capability from a public path
// for a given account. The capability is scoped to a given contract and the implemented
// interfaces within that contract. For the Capability you chose the contract was 
// deployed by ${contractOwner} and implements these interfaces: ${interfaces}.

// Copy-paste 'borrowedCapability into a script that suits your needs. Make
// sure the 'address' parameter in 'getAccount()' is a valid account address.

/*
let borrowedCapability = getAccount(address)
    .getCapability(${path})
    .borrow<&${contractResource}{${interfaces}}>()
    ?? panic("Could not borrow the capability")
*/


// Here's an example script that uses a capability scoped to a fungible token
// contract that implements the 'Balance' interface and returns the balance
// as a UFix64 type.

import ExampleToken from 0x01

  pub fun main(address: Address): UFix64 {
      let account = getAccount(address)

      let vaultRef = account
          .getCapability(/public/MainReceiver)
          .borrow<&ExampleToken.Vault{ExampleToken.Balance}>()
          ?? panic("Could not borrow Balance capability")

      return vaultRef.balance
  }`
  };
};
