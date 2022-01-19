import {
  getImports,
  generateScriptUnitTest,
  getArgumentsFromTemplate,
  zipArguments,
  getAccountCalls,
  getSignersAmount,
  generateTransactionUnitTest,
  getFullAccountList,
  filterExisting,
  generateContractUnitTest,
} from 'util/generator';

// TODO: Fix tests that utilize Handlebars to work properly

describe('Generator Related Unit Tests', () => {
  test('properly zip arguments', () => {
    const args = [
      { type: 'Int', name: 'a' },
      { type: 'Int', value: 'b' },
      { type: 'String', value: 'name' },
      { type: 'Address', value: 'recipient' },
    ];
    const zippedArgs = zipArguments(args);

    expect(zippedArgs.length).toBe(3);
    expect(zippedArgs[0].values.length).toBe(2);
    expect(zippedArgs[0].type).toBe(args[0].type);

    expect(zippedArgs[1].values.length).toBe(1);
    expect(zippedArgs[1].type).toBe(args[2].type);

    expect(zippedArgs[2].values.length).toBe(1);
    expect(zippedArgs[2].type).toBe(args[3].type);
  });

  test('should find no imports in a script template', () => {
    const template = `
      pub fun main(){
        console.log("Hello")
      }
    `;
    const result = getImports(template);
    expect(result.length).toBe(0);
  });

  test('should find single import in script template', () => {
    const template = `
      import First from 0x01
      
      pub fun main(){
        console.log("Hello")
      }
    `;
    const result = getImports(template);
    expect(result.length).toBe(1);

    const first = result[0];
    expect(first.name).toBe('First');
    expect(first.address).toBe('0x01');
  });

  test('should find three (3) imports in transaction template', () => {
    const template = `
      import First from 0x01
      import Second from 0x02
      import Third from 0x03
      
      transaction {
        prepare(acct: AuthAccount) {
          log(HelloWorld.hello())
        }
      }
    `;
    const result = getImports(template);
    expect(result.length).toBe(3);

    const first = result[0];
    expect(first.name).toBe('First');
    expect(first.address).toBe('0x01');

    const second = result[1];
    expect(second.name).toBe('Second');
    expect(second.address).toBe('0x02');

    const third = result[2];
    expect(third.name).toBe('Third');
    expect(third.address).toBe('0x03');
  });

  test('should return list of arguments from script template', () => {
    const template = `
      pub fun main(a: Int, b: Int, recipient: Address) {
          log("hello, Jest")
      }
    `;

    const args = getArgumentsFromTemplate(template);
    expect(args.length).toBe(3);

    expect(args[0].name).toBe('a');
    expect(args[1].name).toBe('b');
    expect(args[2].name).toBe('recipient');

    expect(args[0].type).toBe('Int');
    expect(args[1].type).toBe('Int');
    expect(args[2].type).toBe('Address');
  });

  test('should return list of arguments from transaction template', () => {
    const template = `
      transaction (a: Int, b: Int, recipient: Address) {
        prepare(){
          log("hello, Jest")
        }
      }
    `;

    const args = getArgumentsFromTemplate(template);
    expect(args.length).toBe(3);

    expect(args[0].name).toBe('a');
    expect(args[1].name).toBe('b');
    expect(args[2].name).toBe('recipient');

    expect(args[0].type).toBe('Int');
    expect(args[1].type).toBe('Int');
    expect(args[2].type).toBe('Address');
  });

  test('should return empty list of arguments from script with no arguments', () => {
    const template = `
      pub fun main() {
        log("no args here")
      }
    `;

    const args = getArgumentsFromTemplate(template);
    expect(args.length).toBe(0);
  });

  test('should return list of arguments from transaction with no arguments', () => {
    const template = `
      transaction () {
        prepare(){
          log("hello, Jest")
        }
      }
    `;

    const args = getArgumentsFromTemplate(template);
    expect(args.length).toBe(0);
  });

  test('get accounts calls', () => {
    const template = `
      getAccount(0x02)
      getAccount(0x03)
      getAccount(0x01)
    `;
    const accounts = getAccountCalls(template);
    expect(accounts.length).toBe(3);
    expect(accounts[0]).toBe('0x01');
    expect(accounts[1]).toBe('0x02');
    expect(accounts[2]).toBe('0x03');
  });

  test('get no accounts calls', () => {
    const template = `
      log("Nothing to see here")
    `;
    const accounts = getAccountCalls(template);
    expect(accounts.length).toBe(0);
  });

  test('find 2 signers', () => {
    const signers = getSignersAmount(`
        prepare(acct: AuthAccount, second: AuthAccount) {}
    `);

    expect(signers).toBe(2);
  });

  test('find no signers', () => {
    const signers = getSignersAmount(`
        prepare() {}
    `);

    expect(signers).toBe(0);
  });

  test('filter existing accounts', () => {
    const accounts = ['0x01', '0x03'];
    const filtered = filterExisting(accounts);

    expect(filtered.length).toBe(2);
    expect(filtered[0]).toBe('0x02');
    expect(filtered[1]).toBe('0x04');
  });

  test('complete list to full - no accounts, 4 signers', () => {
    const accounts = [];
    const signersAmount = 4;
    const fullList = getFullAccountList(accounts, signersAmount);

    expect(fullList.length).toBe(4);
    expect(fullList[0]).toBe('0x01');
    expect(fullList[1]).toBe('0x02');
    expect(fullList[2]).toBe('0x03');
    expect(fullList[3]).toBe('0x04');
  });

  test('complete list to full - more signers', () => {
    const accounts = ['0x03'];
    const signersAmount = 3;
    const fullList = getFullAccountList(accounts, signersAmount);

    expect(fullList.length).toBe(3);
    expect(fullList[0]).toBe('0x01');
    expect(fullList[1]).toBe('0x02');
    expect(fullList[2]).toBe('0x03');
  });

  test('complete list to full - equal amount', () => {
    const accounts = ['0x01', '0x03'];
    const signersAmount = 2;
    const fullList = getFullAccountList(accounts, signersAmount);
    expect(fullList.length).toBe(2);
  });
});

describe('Generator - Contracts', () => {
  test('should deploy contract', () => {
    const template = `
      pub contract HelloWorld {
        init(){
          log("Hello, World")
        }
      }
    `;
    const accountAddress = '0x01';
    const generateCode = generateContractUnitTest(accountAddress, template);
    console.log(generateCode);
  });

  test('should deploy contract and handle imports', () => {
    const template = `
      import First from 0x01
      import Second from 0x02
    
      pub contract HelloWorld {
        init(){
          log("Hello, World")
        }
      }
    `;
    const accountAddress = '0x03';
    const generateCode = generateContractUnitTest(accountAddress, template);
    console.log(generateCode);
  });
});

describe('Generator - Scripts', () => {
  test('should create proper code - basic', () => {
    const template = `
      pub fun main() {
        return "Hello, Jest"
      }
    `;

    const scriptName = 'script-01';
    const generatedCode = generateScriptUnitTest(scriptName, template);
    console.log(generatedCode);
  });
  test('should create proper code - return type and getAccount call', () => {
    const template = `
      pub fun main(): String {
        let Dave = getAccount(0x04)
        return "Hello, Jest"
      }
    `;

    const scriptName = 'script-01';
    const generatedCode = generateScriptUnitTest(scriptName, template);
    console.log(generatedCode);
  });
  test('should create proper code - imports, return type and getAccount', () => {
    const template = `
      import First from 0x01
      import Second from 0x02
      import Third from 0x03
      
      pub fun main(): String {
        let Dave = getAccount(0x04)
        return "Hello, Jest"
      }
    `;

    const scriptName = 'script-01';
    const generatedCode = generateScriptUnitTest(scriptName, template);
    console.log(generatedCode);
  });
  test('should create proper code for all features', () => {
    const template = `
      import First from 0x01
      import Second from 0x02
      import Third from 0x03
      
      pub fun main(a: Int, b: Int, c: String, d:Address): String {
        let Dave = getAccount(0x04)
        return "Hello, Jest"
      }
    `;

    const scriptName = 'script-01';
    const generatedCode = generateScriptUnitTest(scriptName, template);
    console.log(generatedCode);
  });
});
describe('Generator - Transactions', () => {
  test('get number of signers - zero signers', () => {
    const template = `
      transaction{
        prepare(){}
      }  
    `;

    const signersAmount = getSignersAmount(template);
    expect(signersAmount).toBe(0);
  });

  test('get number of signers - single signer', () => {
    const template = `
      transaction{
        prepare(acc: AuthAccount){}
      }  
    `;

    const signersAmount = getSignersAmount(template);
    expect(signersAmount).toBe(1);
  });

  test('get number of signers - two signer', () => {
    const template = `
      transaction{
        prepare(first: AuthAccount, second: AuthAccount){}
      }  
    `;

    const signersAmount = getSignersAmount(template);
    expect(signersAmount).toBe(2);
  });

  test('should create proper code - basic', () => {
    const template = `
      transaction{
        prepare(acc: AuthAccount){}
      }  
    `;

    const scriptName = 'tx-01';
    const generatedCode = generateTransactionUnitTest(scriptName, template);
    console.log(generatedCode);
  });

  test('should create proper code - multiple signers', () => {
    const template = `
      transaction{
        prepare(first: AuthAccount, second: AuthAccount){
          let Alice = getAccount(0x01)
          log(Alice)
        }
      }  
    `;

    const scriptName = 'tx-01';
    const generatedCode = generateTransactionUnitTest(scriptName, template);
    console.log(generatedCode);
  });
  test('should create proper code - multiple signers, different account call', () => {
    const template = `
      transaction{
        prepare(first: AuthAccount, second: AuthAccount){
          let Charlie = getAccount(0x03)
          log(Charlie)
        }
      }  
    `;

    const scriptName = 'tx-01';
    const generatedCode = generateTransactionUnitTest(scriptName, template);
    console.log(generatedCode);
  });
});
