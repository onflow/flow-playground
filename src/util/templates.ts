export const getInterpolatedTemplate = (path: string, contractResource: string, interfaces: string): any => {
  return `import ExampleToken from 0x01

  pub fun main(address: Address): UFix64 {
      let account = getAccount(address)

      let vaultRef = account
          .getCapability(${path})
          .borrow<&${contractResource}{${interfaces}}>()
          ?? panic("Could not borrow Balance capability")

      return vaultRef.balance
  }`

}