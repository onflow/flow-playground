import React, { useEffect, useRef, useState } from 'react';
import { FaRegCheckCircle, FaRegTimesCircle, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from "framer-motion";
import { EntityType } from 'providers/Project';
import { useProject } from 'providers/Project/projectHooks';
import { useThemeUI, Box } from 'theme-ui';
import {
  Account,
  ResultType,
  useSetExecutionResultsMutation,
} from 'api/apollo/generated/graphql';

import { storageMap } from '../../util/accounts';
import { ArgumentsProps } from 'components/Arguments/types';
import { ExecuteCommandRequest } from 'monaco-languageclient';

import { ControlContainer, ToastContainer, HoverPanel, StatusMessage } from './styles';

import {
  ActionButton,
  ArgumentsList,
  ArgumentsTitle,
  ErrorsList,
  Hints,
  Signers,
} from './components';

const isDictionaary = (type:string) => type.includes("{")
const isArray = (type:string) => type.includes("[")
const isImportedType = (type:string) => type.includes(".")
const isComplexType = (type:string)=> isDictionaary(type)
  || isArray(type)
  || isImportedType(type)

const startsWith = (value : string, prefix: string) => {
  return value.startsWith(prefix) || value.startsWith("U"+prefix)
}

const checkJSON = (value: any, type: string) => {
  try{
    JSON.parse(value)
    return null
  } catch (e){
    return `Not a valid argument of type ${type}`
  }
}

const validateByType = (
  value: any,
  type: string,
) => {
  if (value.length === 0) {
    return "Value can't be empty";
  }

  switch (true) {
    // Strings
    case type === 'String': {
      return null; // no need to validate String for now
    }

    // Integers
    case startsWith(type,'Int'): {
      if (isNaN(value) || value === '') {
        return 'Should be a valid Integer number';
      }
      return null;
    }

    // Words
    case startsWith(type,'Word'): {
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


const getLabel = (
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

type ScriptExecution = (args?: string[]) => Promise<any>;
type TransactionExecution = (
  signingAccounts: Account[],
  args?: string[],
) => Promise<any>;
type DeployExecution = () => Promise<any>;

type ProcessingArgs = {
  disabled: boolean;
  scriptFactory?: ScriptExecution;
  transactionFactory?: TransactionExecution;
  contractDeployment?: DeployExecution;
};

const useTemplateType = (): ProcessingArgs => {
  const { isSavingCode } = useProject();
  const {
    createScriptExecution,
    createTransactionExecution,
    updateAccountDeployedCode,
  } = useProject();

  return {
    disabled: isSavingCode,
    scriptFactory: createScriptExecution,
    transactionFactory: createTransactionExecution,
    contractDeployment: updateAccountDeployedCode,
  };
};
interface IValue {
  [key: string]: string;
}

const Arguments: React.FC<ArgumentsProps> = (props) => {
  const { theme } = useThemeUI();
  const { type, list, signers } = props;
  const { goTo, hover, hideDecorations, problems } = props;
  const validCode = problems.error.length === 0;

  const needSigners = type == EntityType.TransactionTemplate && signers > 0;
  const [selected, updateSelectedAccounts] = useState([]);
  const [errors, setErrors] = useState({})
  const [expanded, setExpanded] = useState(true);
  const [values, setValue] = useState<IValue>({});
  const constraintsRef = useRef();

  const [notifications, setNotifications] = useState([]);
  const [counter, setCounter] = useState(0);
  const removeNotification = (set: { (setType: (prev: number[]) => number[]): void; }, id: number) => {
    set((prev: number[]) => {
      const newArr = [...prev];
      newArr.splice(
        newArr.findIndex((i) => i === id),
        1
      );
      return newArr;
    });
  };

  // const errors = validate(list, values);
  const numberOfErrors = Object.keys(errors).length;
  const notEnoughSigners = needSigners && selected.length < signers;
  const haveErrors = numberOfErrors > 0 || notEnoughSigners;

  const validate = (list: any, values: any) => {
    const errors = list.reduce((acc: any, item: any) => {
      const { name, type } = item;
      const value = values[name];
      if (value) {
        const error = validateByType(value, type);
        if (error) {
          acc[name] = error;
        }
      } else {
        if (type !== 'String') {
          acc[name] = "Value can't be empty";
        }
      }
      return acc;
    }, {});

    console.log({errors});
    setErrors(errors);
  };

  useEffect(()=>{
    validate(list, values)
  }, [list, values]);

  const [processingStatus, setProcessingStatus] = useState(false);

  const [setResult] = useSetExecutionResultsMutation();
  const {
    scriptFactory,
    transactionFactory,
    contractDeployment,
  } = useTemplateType();
  const { 
    project, 
    active, 
    isSavingCode, 
    updatedStorageAccts, 
    lastTxSigners 
  } = useProject();
  
  const storageAcctKeys = Object.keys(storageMap)

  // create state for account signers and accounts who's sstorage is updated after a tx
  const [lastUpdatedAccts, setLastUpdatedAccts] = useState< string[] | null >(null)
  const [lastTxSignerAccts, setLastTxSignerAccts] = useState< string[] | null >(null)
  useEffect(() => {
    if (updatedStorageAccts && lastTxSigners) {

      let storageAccts: string[] = []
      updatedStorageAccts?.map((acctIdx) => storageAccts.push(storageAcctKeys[acctIdx]))
      setLastUpdatedAccts(storageAccts)

      let txSignerAccts: string[] = []
      lastTxSigners?.map((acct: any) => {
        const addr = acct.address
        const acctNum = addr.charAt(addr.length-1)
        const acctHex = `0x0${acctNum}`
        txSignerAccts.push(acctHex)
      })
      setLastTxSignerAccts(txSignerAccts)

    }
  },[updatedStorageAccts, lastTxSigners])
  

  const { accounts } = project;

  const signersAccounts = selected.map((i) => accounts[i]);

  const send = async () => {
    if (!processingStatus) {
      setProcessingStatus(true);
    }

    // TODO: implement algorithm for drilling down dictionaries

    const fixed = list.map((arg) => {
      const { name, type } = arg;
      let value = values[name];

      // We probably better fix this on server side...
      if (type === 'UFix64') {
        if (value.indexOf('.') < 0) {
          value = `${value}.0`;
        }
      }
      return value;
    });

    const formatted = await props.languageClient.sendRequest(
      ExecuteCommandRequest.type,
      {
        command: 'cadence.server.parseEntryPointArguments',
        arguments: [
          props.editor.getModel().uri.toString(),
          fixed
        ],
      },
    );

    // Map values to strings that will be passed to backend
    const args:any = list.map((arg, index) => {
      const { type } = arg;
      const value = fixed[index]

      // If we have a complex type - return value formatted by language server
      if ( isComplexType(type)){
        return JSON.stringify(formatted[index])
      }

      return JSON.stringify({ value, type });
    });

    let rawResult, resultType;
    try {
      switch (type) {
        case EntityType.ScriptTemplate: {
          resultType = ResultType.Script;
          rawResult = await scriptFactory(args);
          break;
        }

        case EntityType.TransactionTemplate: {
          resultType = ResultType.Transaction;
          rawResult = await transactionFactory(signersAccounts, args);
          setNotifications((prev) => [...prev, counter]);
          setTimeout(() => removeNotification(setNotifications, counter), 5000);
          setCounter((prev) => prev + 1);
          break;
        }

        case EntityType.Account: {
          // Ask if user wants to redeploy the contract
          if (accounts[active.index] && accounts[active.index].deployedCode) {
            const choiceMessage =
              'Redeploying will clear the state of all accounts. Proceed?';
            if (!confirm(choiceMessage)) {
              setProcessingStatus(false);
              return;
            }
          }
          resultType = ResultType.Contract;
          rawResult = await contractDeployment();
          break;
        }
        default:
          break;
      }
    } catch (e) {
      console.error(e);
      rawResult = e.toString();
    }
    setProcessingStatus(false);

    // Display result in the bottom area
    setResult({
      variables: {
        label: getLabel(resultType, project, active.index),
        resultType,
        rawResult,
      },
    });
  };

  const isOk = !haveErrors && validCode !== undefined && !!validCode;
  let statusIcon = isOk ? <FaRegCheckCircle /> : <FaRegTimesCircle />;
  let statusMessage = isOk ? 'Ready' : 'Fix errors';

  const progress = isSavingCode || processingStatus;

  if (progress) {
    statusIcon = <FaSpinner className="spin" />;
    statusMessage = 'Please, wait...';
  }

  const actions = { goTo, hover, hideDecorations };

  return (
    <>
      <div ref={constraintsRef} className="constraints" />
      <motion.div
        className="drag-box"
        drag={true}
        dragConstraints={constraintsRef}
        dragElastic={1}
      >
        <HoverPanel>
          {validCode && (
            <>
              {list.length > 0 && (
                <>
                  <ArgumentsTitle
                    type={type}
                    errors={numberOfErrors}
                    expanded={expanded}
                    setExpanded={setExpanded}
                  />
                  <ArgumentsList
                    list={list}
                    errors={errors}
                    hidden={!expanded}
                    onChange={(name, value) => {
                      let key = name.toString();
                      let newValue = { ...values, [key]: value };
                      setValue(newValue);
                    }}
                  />
                </>
              )}
              {needSigners && (
                <Signers
                  maxSelection={signers}
                  selected={selected}
                  updateSelectedAccounts={updateSelectedAccounts}
                />
              )}
            </>
          )}

          <ErrorsList list={problems.error} {...actions} />
          <Hints problems={problems} {...actions} />
          <ControlContainer isOk={isOk} progress={progress}>
            <StatusMessage>
              {statusIcon}
              <p>{statusMessage}</p>
            </StatusMessage>
            <ActionButton active={isOk} type={type} onClick={send} />
          </ControlContainer>
        </HoverPanel>
        {(lastTxSignerAccts && lastUpdatedAccts && !progress) &&
          <ToastContainer isOk={isOk} progress={progress}>
              <ul>
                <AnimatePresence initial={true}>
                  {notifications.map((id) => (
                    <motion.li
                      key={id}
                      layout
                      initial={{ opacity: 0, y: 50, scale: 0.3 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                    >
                      <Box
                        my={1}
                        sx={{
                          padding: "0.8rem 0.5rem",
                          alignItems: "center",
                          border: `1px solid ${theme.colors.borderDark}`,
                          backgroundColor: theme.colors.background,
                          borderRadius: "8px",
                          width: "250px",
                          boxShadow: "10px 10px 20px #c9c9c9, -10px -10px 20px #ffffff"
                        }}
                      >
                        {`
                          Account${lastTxSignerAccts?.length > 1 ? "s" : ""} 
                          ${lastTxSignerAccts.join(", ")} completed a transaction,
                          updating the storage in 
                          account${lastUpdatedAccts?.length > 1 ? "s" : ""} 
                          ${lastUpdatedAccts.join(", ")}.
                        `}
                      </Box>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
          </ToastContainer>
        }

      </motion.div>
    </>
  );
};

export default Arguments;
