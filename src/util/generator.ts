import prettier from 'prettier';
import parserBabel from 'prettier/parser-babel';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Project } from 'api/apollo/generated/graphql';

import contractUnitTestTemplate from '../templates/js/contractUnitTest.hbs';
import transactionUnitTestTemplate from '../templates/js/transactionUnitTest.hbs';
import scriptUnitTestTemplate from '../templates/js/scriptUnitTest.hbs';
import testSuit from '../templates/js/testSuit.hbs';

import readmeTemplate from '../templates/js/config/README.md.hbs';
import babelConfigTemplate from '../templates/js/config/babel.config.hbs';
import packageTemplate from '../templates/js/config/package.json.hbs';
import jestConfigTemplate from '../templates/js/config/jest.config.js.hbs';

export const prettify = (code: string): string => {
  return prettier.format(code, { parser: 'babel', plugins: [parserBabel] });
};

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

export const getAccountCalls = (template: string) => {
  const matches = template.match(/(?:getAccount\()(0x.*)(?:\))/g);
  if (matches) {
    return matches.map((item: string) => item.match(/0x[\w\d]*/g)[0]).sort();
  }
  return [];
};

export const filterExisting = (accounts: string[]): string[] => {
  return ['0x01', '0x02', '0x03', '0x04'].filter(
    (item) => !accounts.includes(item),
  );
};

export const getFullAccountList = (
  accounts: string[],
  signersAmount?: number,
): string[] => {
  if (accounts.length >= signersAmount) {
    return accounts;
  }

  const available = filterExisting(accounts);
  const fullList = [...accounts];
  let shift = 0;
  while (fullList.length < signersAmount) {
    fullList.push(available[shift]);
    shift += 1;
  }

  return fullList.sort();
};

export const getArgumentsFromTemplate = (template: string) => {
  const pattern = /(?:transaction\s*\()(.*)(?:\).*)|(?:fun main\()(.*)(?:\).*)/g;
  const result = pattern.exec(template);

  if (result) {
    const match = result[1] || result[2];
    if (match) {
      return match.split(',').map((pair) => {
        const [name, type] = pair.replace(/\s/g, '').split(':');
        return { name, type };
      });
    }
    return [];
  }

  return [];
};

export const getDefaultValueForType = (type: string) => {
  const values: { [index: string]: number | string | boolean } = {
    Address: `0x0ae53cb6e3f42a79`, // default address for FlowToken on Emulator

    Bool: true,

    Character: 'a',
    String: 'Hello',

    Int: 1337,
    Int8: 8,
    Int16: 16,
    Int32: 32,
    Int64: 64,
    Int128: 128,
    Int256: 256,

    UInt: 1337,
    UInt8: 8,
    UInt16: 16,
    UInt32: 32,
    UInt64: 64,
    UInt128: 128,
    UInt256: 256,

    Word8: 8,
    Word16: 16,
    Word32: 32,
    Word64: 64,
    Word128: 128,
    Word256: 256,

    Fix64: '64.0',
    UFix64: '64.0',
  };

  return values[type] || 'Unsupported';
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

export const getSignersAmount = (template: string): number => {
  const match = /(?:prepare.*\()(.*)(?:\)\s*)/g.exec(template)[1];
  return match ? match.replace(/\s/g, '').split(',').length : 0;
};

export const getContractName = (template: string) => {
  const match = template.match(/(?:contract\s*)([\d\w]*)(?:\s*{)/);
  if (match) {
    return match[1];
  }
  return '';
};

export const generateContractTarget = (toAddress: string) => {
  return `
    const to = getAccountAddress("${getNameByAddress(toAddress)}")
  `;
};

export const generateContractUnitTest = (
  accountAddress: string,
  template: string,
) => {
  const imports = getImports(template);
  const contractName = getContractName(template);

  const unitTest = contractUnitTestTemplate({
    accountAddress,
    contractName,
    imports,
  });

  return prettify(unitTest);
};

export const generateTransactionUnitTest = (name: string, template: string) => {
  const imports = getImports(template);
  const argumentsList = getArgumentsFromTemplate(template);
  const zippedArguments = zipArguments(argumentsList);

  const signersAmount = getSignersAmount(template);
  const accountCalls = getAccountCalls(template);
  const fullAccountList = getFullAccountList(accountCalls, signersAmount);
  const accounts = fullAccountList.map((item) => getNameByAddress(item));
  const signers = accounts.slice(0, signersAmount);

  const code = transactionUnitTestTemplate({
    name,
    imports,
    signers,
    accounts,
    accountCalls,
    arguments: zippedArguments,
  });

  return prettify(code);
};
export const generateScriptUnitTest = (
  name: string,
  template: string,
): string => {
  const imports = getImports(template);
  const argumentsList = getArgumentsFromTemplate(template);
  const zippedArguments = zipArguments(argumentsList);

  const accountCalls = getAccountCalls(template);
  const accounts = accountCalls.map((item) => getNameByAddress(item));

  const code = scriptUnitTestTemplate({
    name,
    imports,
    arguments: zippedArguments,
    accounts,
    accountCalls,
  });

  return prettify(code);
};

export const generateReadMe = async (id: 'string') => {
  return readmeTemplate({
    projectLink: `https://play.onflow.org/${id.toLowerCase()}`,
  });
};

export const generatePackageConfig = async (projectName: string) => {
  return packageTemplate({
    name: projectName,
  });
};

const generateTests = async (cadenceFolder: string, project: Project) => {
  const contractsUnitTests = [];
  for (let i = 0; i < project.accounts.length; i++) {
    const account = project.accounts[i];
    const address = `0x0${account.address.slice(-1)}`;
    const code = account.draftCode;
    if (code.length > 0) {
      const unitTest = generateContractUnitTest(address, code);
      contractsUnitTests.push(unitTest);
    }
  }

  const transactionsUnitTests = [];
  for (let i = 0; i < project.transactionTemplates.length; i++) {
    const tx = project.transactionTemplates[i];
    const unitTest = generateTransactionUnitTest(tx.title, tx.script);
    transactionsUnitTests.push(unitTest);
  }

  const scriptsUnitTests = [];
  for (let i = 0; i < project.scriptTemplates.length; i++) {
    const script = project.scriptTemplates[i];
    const unitTest = generateScriptUnitTest(script.title, script.script);
    scriptsUnitTests.push(unitTest);
  }

  const code = testSuit({
    cadenceFolder,
    contractsUnitTests,
    transactionsUnitTests,
    scriptsUnitTests,
  });

  return prettify(code);
};

export const createZip = async (
  folderName: string,
  projectName: string,
  project: Project,
) => {
  const zip = new JSZip();

  const id = project.id.toLowerCase();

  const readMeFile = await readmeTemplate({
    projectLink: `https://play.onflow.org/${id}`,
    projectTitle: `${project.title}`,
    projectDescription: `${project.description}`,
    projectReadme: `${project.readme}`,
  });
  const packageConfig = await packageTemplate({ name: projectName });
  const babelConfig = await babelConfigTemplate();
  const jestConfig = await jestConfigTemplate();
  const testFile = await generateTests(folderName, project);

  zip.file('test/README.md', readMeFile);
  zip.file('test/package.json', packageConfig);
  zip.file('test/babel.config.json', babelConfig);
  zip.file('test/jest.config.js', jestConfig);
  zip.file('test/index.test.js', testFile);

  const { accounts, transactionTemplates, scriptTemplates } = project;

  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];
    const name = getContractName(account.draftCode);
    const fileName = `cadence/contracts/${name}.cdc`;
    zip.file(fileName, account.draftCode);
  }

  for (let i = 0; i < transactionTemplates.length; i++) {
    const template = transactionTemplates[i];
    const name = template.title;
    const fileName = `cadence/transactions/${name}.cdc`;
    zip.file(fileName, template.script);
  }

  for (let i = 0; i < scriptTemplates.length; i++) {
    const template = scriptTemplates[i];
    const name = template.title;
    const fileName = `cadence/scripts/${name}.cdc`;
    zip.file(fileName, template.script);
  }

  // Save everything as ZIP
  const projectFile = await zip.generateAsync({ type: 'blob' });
  saveAs(projectFile, `${projectName}.zip`);
};
