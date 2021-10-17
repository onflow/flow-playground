const transactionTemplates: { [identifier: string]: string} = {

  "createBorrowCap": `access(all) contract HelloWorld {

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
`,
}

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


//   return `access(all) contract HelloWorld {
//   // Declare a public field of type String.
//   //
//   // All fields must be initialized in the init() function.
//   access(all) let greeting: String

//   // The init() function is required if the contract contains any fields.
//   init() {
//       self.greeting = "${capCode}!"
//   }

//   // Public function that returns our friendly greeting!
//   access(all) fun hello(): String {
//       return self.greeting
//   }
// }`
}