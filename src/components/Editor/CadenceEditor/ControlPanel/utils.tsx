import {
  Account,
  ContractDeployment,
  ResultType,
} from 'api/apollo/generated/graphql';
import { useProject } from 'providers/Project/projectHooks';
import { ProcessingArgs } from './types';
import { EntityType } from 'providers/Project';

const isDictionary = (type: string) => type.includes('{');
const isArray = (type: string) => type.includes('[');
const isImportedType = (type: string) => type.includes('.');
const isComplexType = (type: string) =>
  isDictionary(type) || isArray(type) || isImportedType(type);

export const startsWith = (value: string, prefix: string) => {
  return value.startsWith(prefix) || value.startsWith('U' + prefix);
};

export const checkJSON = (value: any, type: string) => {
  try {
    JSON.parse(value);
    return null;
  } catch (e) {
    return `Not a valid argument of type ${type}`;
  }
};

export const validateByType = (value: any, type: string) => {
  if (value.length === 0) {
    return "Value can't be empty";
  }

  switch (true) {
    // Strings
    case type === 'String': {
      return null; // no need to validate String for now
    }

    // Integers
    case startsWith(type, 'Int'): {
      if (isNaN(value) || value === '') {
        return 'Should be a valid Integer number';
      }
      return null;
    }

    // Words
    case startsWith(type, 'Word'): {
      if (isNaN(value) || value === '') {
        return 'Should be a valid Word number';
      }
      return null;
    }

    // Fixed Point
    case startsWith(type, 'Fix'): {
      if (isNaN(value) || value === '') {
        return 'Should be a valid fixed point number';
      }
      return null;
    }

    case isComplexType(type): {
      // This case it to catch complex arguments like Dictionaries
      return checkJSON(value, type);
    }

    // Address
    case type === 'Address': {
      if (!value.match(/(^0x[\w\d]{16})|(^0x[\w\d]{1,4})/)) {
        return 'Not a valid Address';
      }
      return null;
    }

    // Booleans
    case type === 'Bool': {
      if (value !== 'true' && value !== 'false') {
        return 'Boolean values can be either true or false';
      }
      return null;
    }

    default: {
      return null;
    }
  }
};

export const getLabel = (
  resultType: ResultType,
  project: any,
  index: number,
): string => {
  return resultType === ResultType.Contract
    ? 'Deployment'
    : resultType === ResultType.Script
    ? project.scriptTemplates[index].title
    : resultType === ResultType.Transaction
    ? project.transactionTemplates[index].title
    : 'Interaction';
};

export const getResultType = (type: EntityType) => {
  switch (type) {
    case EntityType.ContractTemplate:
      return ResultType.Contract;
    case EntityType.TransactionTemplate:
      return ResultType.Transaction;
    case EntityType.ScriptTemplate:
      return ResultType.Script;
    default:
      return undefined;
  }
};

export const useTemplateType = (): ProcessingArgs => {
  const {
    isSaving,
    createScriptExecution,
    createTransactionExecution,
    createContractDeployment,
  } = useProject();

  return {
    disabled: isSaving,
    scriptFactory: createScriptExecution,
    transactionFactory: createTransactionExecution,
    contractDeployment: createContractDeployment,
  };
};

export const getSelectedAccount = (
  accounts: Account[],
  selectedAccounts: number[],
): Account => {
  return accounts[selectedAccounts[0] || 0];
};

export const getAccountContract = (
  accountLongAddressContract: string,
  deployedContracts: ContractDeployment[],
): string => {
  if (accountLongAddressContract.indexOf('.') === -1) return null;
  const addressContract = accountLongAddressContract.split('.');
  const address = addressContract[0];
  const deployed = deployedContracts.find(
    (d) => d.address === address && d.title === addressContract[1],
  );
  if (!deployed) return null;
  // TODO: need to get contract name to work, only works if account has one contract deployed
  return deployed?.script || null;
};

export const hasDuplicates = (array: string[]) => {
  return new Set(array).size !== array.length;
};

export const findDuplicateIndex = (array: string[]): number => {
  for (let i = 0; i < array.length; i++) {
    if (array.indexOf(array[i]) !== array.lastIndexOf(array[i])) {
      return i;
    }
  }
  return -1;
};

export const isMobile = (): boolean => {
  return window.matchMedia('(max-width: 768px)')?.matches;
}
