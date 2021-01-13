import {
  getImports,
  generateAddressMap,
  generateArguments,
  generateGetAccounts,
  generateScriptCode,
  replaceScriptTemplate,
  getArgumentsFromTemplate,
  zipArguments,
  generateArgumentsCode,
} from '../../src/util/generator';

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

  test('arguments code generation', () => {
    const args = [
      { type: 'Int', name: 'a' },
      { type: 'Int', value: 'b' },
      { type: 'String', value: 'name' },
      { type: 'Address', value: 'recipient' },
    ];
    const zipped = zipArguments(args);
    const code = generateArgumentsCode(zipped);
    const result = code;
    console.log(result);
    expect(code.length).not.toBe(0);
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

  test('should  create address map for imports', () => {
    const template = `
      import First from 0x01
      import Second from 0x02
      import Third from 0x03
      
      pub fun main(){
        console.log("Hello")
      }
    `;

    const imports = getImports(template);
    const result = generateAddressMap(imports);
    console.log({ result });
  });

  test('should create proper account getters', () => {
    const template = `
      import First from 0x01
      import Second from 0x02
      import Third from 0x03
      
      pub fun main(){
        console.log("Hello")
      }
    `;
    const imports = getImports(template);
    const getAccountsCode = generateGetAccounts(imports);
    console.log(getAccountsCode);
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
});

describe("Generator - Scripts", ()=>{
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
    const generatedCode = replaceScriptTemplate(
      scriptName,
      template
    );
    console.log(generatedCode);
  });
})
