import prettier from 'prettier';
export const getNameByAddress = (address: string) => {
  const addressBook: any = {
    '0x01': 'Alice',
    '0x02': 'Bob',
    '0x03': 'Charlie',
    '0x04': 'Dave',
  };

  return addressBook[address];
};

export const getImports = (
  template: string,
): { name: string; address: string }[] => {
  const regexp = /(?:import\s*)([\w\d]*)(?:\s*from\s*)(0x[\d\w]*)/gm;
  const groups = template.matchAll(regexp);

  const result = [];
  for (let group of groups) {
    result.push({
      name: group[1],
      address: group[2],
    });
  }

  return result;
};

export const generateGetAccounts = (
  imports: { name: string; address: string }[],
) => {
  let result = imports.reduce((acc, item) => {
    const name = getNameByAddress(item.address);
    acc = acc + `const ${name} = await getAccountAddress("${name}")\n`;
    return acc;
  }, '');
  result += '\n';

  return result;
};

export const generateAddressMap = (
  addressMap: { name: string; address: string }[],
) => {
  if (addressMap.length > 0) {
    let result = '\n';
    result = 'const addressMap = {\n';
    result += addressMap.reduce((acc, item, i: number) => {
      const lastItem = i === addressMap.length - 1;
      const address = getNameByAddress(item.address);
      return acc + `\t${item.name}: ${address}${lastItem ? '\n' : ',\n'}`;
    }, '');
    result += '}';

    return result;
  }
  return '';
};

export const getArgumentsFromTemplate = (template: string) => {
  const pattern = /(?:transaction\s*\()(.*)(?:\).*)|(?:fun main\()(.*)(?:\).*)/g;
  const result = pattern.exec(template);

  const match = result[1] || result[2];
  if (match) {
    return match.split(',').map((pair) => {
      const [name, type] = pair.replace(/\s/g, '').split(':');
      return { name, type };
    });
  }

  return [];
};

export const getDefaultValueForType = (type: string) => {
  const values: { [index: string]: number | string } = {
    Int: 1337,
    Int8: 8,
    Int16: 16,
    Int32: 32,
    UInt: 1337,
    UInt8: 8,
    UInt16: 16,
    UInt32: 32,
    UFix64: 1.0,
    String: 'Hello',
    Address: '0x0ae53cb6e3f42a79', // default address for FlowToken on Emulator
  };

  return values[type];
};

export const zipArguments = (
  argumentsList: { name: string; type: string }[],
) => {
  return argumentsList.reduce(
    (acc: any, item: { name: string; type: string }) => {
      const defaultValue = getDefaultValueForType(item.type);
      if (acc.length === 0) {
        acc.push({
          values: [defaultValue],
          type: item.type,
        });
      } else {
        const current = acc[acc.length - 1];
        if (current.type === item.type) {
          current.values.push(defaultValue);
        } else {
          acc.push({
            values: [defaultValue],
            type: item.type,
          });
        }
      }

      return acc;
    },
    [],
  );
};

export const generateArgumentsCode = (argumentsList: any) => {
  if (argumentsList.length > 0) {
    let result = `const args = [
      ${argumentsList.map((item: { values: any[]; type: string }) => {
        return `[${item.values.join(',')}, types.${item.type}]`;
      })}
    ]`;
    return result;
  }

  return '';
};

/*
  Script Generation Process
  - Gather Data
    - get list of imports
    - get list of arguments
    - get expected result type
    - get list of "getAccount" calls, then add new addressed to account list

  - Generate Code
    - generate getContractAddress($name) from list of imports
    - generate "getAccountAddress($name)" calls from account list
    - generate argument creation from list of arguments
      - provide meaningful default values
      - add comment that those values shall be updated
    - generate "executeScript" call
    - generate basic expectancy test (no errors)
    - generate mockup expectancy test based on result type
* */
export const replaceScriptTemplate = (scriptName: string, template: string) => {
  const imports = getImports(template);
  const argumentsList = getArgumentsFromTemplate(template);
  const zippedArguments = zipArguments(argumentsList);
  const argumentsCode = generateArgumentsCode(zippedArguments);

  // const accounts = generateGetAccounts(imports);
  const addressMap = generateAddressMap(imports);

  let result = `test("test template for ##SCRIPT-NAME##", async () => {
      // ##ADDRESS-MAP##
      
      const code = await getScriptCode({
        name: "##SCRIPT-NAME##", 
        // ##ADDRESS-MAP-CONDITIONAL##
      });
      
      // ##GET-ACCOUNTS##
      // ##ACCOUNTS-REPLACEMENT##
      
      // ##ARGUMENTS##
            
      const result = await executeScript({
        code, 
        // ##ARGS-CONDITIONAL##
      });
      
      // Add your expectations here
      expect().toBe();
    });
  `.replace(/##SCRIPT-NAME##/g, scriptName);

  if (addressMap.length > 0) {
    result = result.replace(/\/\/ ##ADDRESS-MAP##/, addressMap);
    result = result.replace(/\/\/ ##ADDRESS-MAP-CONDITIONAL##/, 'addressMap');
  } else {
    result = result.replace(/\/\/ ##ADDRESS-MAP##/, '');
    result = result.replace(/\/\/ ##ADDRESS-MAP-CONDITIONAL##/, '');
  }

  if (argumentsCode.length > 0) {
    result = result.replace(/\/\/ ##ARGUMENTS##/, argumentsCode);
    result = result.replace(/\/\/ ##ARGS-CONDITIONAL##/, 'args');
  } else {
    result = result.replace(/\/\/ ##ARGUMENTS##/, '');
    result = result.replace(/\/\/ ##ARGS-CONDITIONAL##/, '');
  }

  return prettier.format(result, { parser: 'babel' });
};

export const generateTransactionCode = (template: string) => {
  const imports = getImports(template);
  const accountsCode = generateGetAccounts(imports);
  const addressMapCode = generateAddressMap(imports);
  // TODO: add signers, but notify user that he shall update value here
  // TODO: generate arguments, but mention, that user shall update values

  let result = '\n';
  result += accountsCode;
  result += addressMapCode;
  return result;
};
