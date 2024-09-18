import { extractSigners } from "./parser";

const oneSigner = `
transaction {
  prepare(acct: auth(LoadValue, SaveValue) &Account) {}
}`


const twoSigners = `
transaction {
  prepare(authorizer1: auth(Capabilities,SomethingElse) &Account, authorizer2: auth(Storage,Vaults) &Account) { }
}`

describe('parser tests', () => {
  it('should extract one code signer', () => {

    const signers = extractSigners(oneSigner)

    expect(signers).toHaveLength(1)
  })
  it('should extract two code signer', () => {

    const signers = extractSigners(twoSigners)

    expect(signers).toHaveLength(2)
  })
})
