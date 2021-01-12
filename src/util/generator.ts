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

export const generateScriptCode = (template: string) => {
  const imports = getImports(template);
  const accountsCode = generateGetAccounts(imports);
  const addressMapCode = generateAddressMap(imports);
  let result = '\n';
  result += accountsCode;
  result += addressMapCode;

  return result;
};

export const getArgumentsFromTemplate = (template: string) => {
  const pattern = /(?:transaction\s*\()(.*)(?:\)\s*\{)|(?:fun main\()(.*)(?:\)\s*\{)/g;
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

export const generateArguments = (template: string) => {
  // TODO: implement extraction of arguments
  console.log(template);
  return '';
};

export const replaceScriptTemplate = (
  scriptName: string,
  addressMap: string,
  args: string,
) => {
  let result = `test("test template for ##SCRIPT-NAME##", async () => {
      ##ADDRESS-MAP##
      
      const code = await getScriptCode({
        name: "##SCRIPT-NAME##", ##ADDRESS-MAP-CONDITIONAL##
      });
      
      ##ARGUMENTS##
            
      const result = await executeScript({
        code, ##ARGS-CONDITIONAL##
      });
      
      // Add your expectations here
      expect().toBe();
    });
  `.replace(/##SCRIPT-NAME##/g, scriptName);

  if (addressMap.length > 0) {
    result = result.replace(/##ADDRESS-MAP##/, addressMap);
    result = result.replace(/##ADDRESS-MAP-CONDITIONAL##/, 'addressMap');
  } else {
    result = result.replace(/##ADDRESS-MAP##/, '');
    result = result.replace(/##ADDRESS-MAP-CONDITIONAL##/, '');
  }

  if (args.length > 0) {
    result = result.replace(/##ARGUMENTS##/, args);
    result = result.replace(/##ARGS-CONDITIONAL##/, 'args');
  } else {
    result = result.replace(/##ARGUMENTS##/, '');
    result = result.replace(/##ARGS-CONDITIONAL##/, '');
  }

  return prettier.format(result, { parser: 'babel' });
};
