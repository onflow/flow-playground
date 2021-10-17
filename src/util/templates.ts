export const getInterpolatedTemplate = (type: string, contractOwner: string, path: string, contractResource: string, interfaces: string): any => {
  if (type === 'tx') {
  return `// The 'borrowedCapability' constant borrows a capability from a public path
    // for a given account. The capability is scoped to a contract its implemented
    // contract-level interfaces. It was deployed in this playground by ${contractOwner}.

    // Copy-paste 'borrowedCapability into a script that suits your needs. Make
    // sure the 'address' parameter in 'getAccount()' is a valid account address.

    /*
      ...
    */
  

    // Here's an example transaction that uses a capability scoped to a fungible token
    // contract that implements the 'Balance' interface and returns the balance
    // as a UFix64 type

    /*
      ...
    */
      `

  } else if (type === 'script') {
  return `// The 'borrowedCapability' constant borrows a capability from a public path
    // for a given account. The capability is scoped to a contract its implemented
    // contract-level interfaces. It was deployed in this playground by ${contractOwner}.

    // Copy-paste 'borrowedCapability into a script that suits your needs. Make
    // sure the 'address' parameter in 'getAccount()' is a valid account address.

    /*
    let borrowedCapability = getAccount(address)
        .getCapability(${path})
        .borrow<&${contractResource}{${interfaces}}>()
        ?? panic("Could not borrow Balance capability")
    */
  

    // Here's an example script that uses a capability scoped to a fungible token
    // contract that implements the 'Balance' interface and returns the balance
    // as a UFix64 type

    /*
    import ExampleToken from 0x01

      pub fun main(address: Address): UFix64 {
          let account = getAccount(address)

          let vaultRef = account
              .getCapability(/public/MainReceiver)
              .borrow<&ExampleToken.Vault{ExampleToken.Balance}>()
              ?? panic("Could not borrow Balance capability")

          return vaultRef.balance
      }
      */
      `
  }

}