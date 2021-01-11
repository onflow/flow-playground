// regexp for extracting names of the contracts
// (?:import\s*)([\w\d]*)(?:\s*from\s*)(0x[\d\w]*)

export const getImports = (template: string) => {
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

export const getNameByAddress = (address: string) => {
  switch (address) {
    case '0x01':
      return 'Alice';
    case '0x02':
      return 'Bob';
    case '0x03':
      return 'Charlie';
    case '0x04':
      return 'Dave';
    default:
      return false;
  }
};

export const generateGetAccounts = (
  imports: [{ name: string; address: string }],
) => {
  return imports.reduce((acc, item) => {
    const name = getNameByAddress(item.address);
    acc = acc + `const ${name} = await getAccountAddress("${name}")\n`;
    return acc;
  }, '');
};

export const generateAddressMap = (template: string) => {
  const addressMap = getImports(template);
  if (addressMap.length > 0) {
    return `
  const addressMap = {
    ${addressMap.map((item, i: number) => {
      const lastItem = i === addressMap.length - 1;
      return `${item.name}: ${item.address}${lastItem ? '\n' : ',\n'}`;
    })}
  }`;
  }
  return '';
};
