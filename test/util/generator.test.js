import {
  getImports,
  generateAddressMap,
  generateArguments,
  generateGetAccounts,
  generateScriptCode,
  replaceScriptTemplate,
} from '../../src/util/generator';

describe('Generator Related Unit Tests', () => {
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

  test('should create proper code for script', () => {
    const template = `
      import First from 0x01
      import Second from 0x02
      import Third from 0x03
      
      pub fun main(){
        console.log("Hello")
      }
    `;

    const generatedCode = generateScriptCode(template);
    console.log(generatedCode);
  });

  test('should create full proper code script test', () => {
    const template = `
      import First from 0x01
      import Second from 0x02
      import Third from 0x03
      
      pub fun main(){
        console.log("Hello")
      }
    `;

    const scriptName = 'script-01';
    const addressMapCode = generateScriptCode(template);
    const argumentsCode = generateArguments(template);
    const generatedCode = replaceScriptTemplate(scriptName, addressMapCode, argumentsCode);
    console.log(generatedCode);
  });
});
