import React, { useRef, useState } from 'react';
import { FaRegCheckCircle, FaRegTimesCircle, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { EntityType } from 'providers/Project';
import { useProject } from 'providers/Project/projectHooks';
import {
  Account,
  ResultType,
  useSetExecutionResultsMutation,
} from 'api/apollo/generated/graphql';

import { ArgumentsProps } from 'components/Arguments/types';
import { ExecuteCommandRequest } from 'monaco-languageclient';

import { ControlContainer, HoverPanel, StatusMessage } from './styles';

import {
  ActionButton,
  ArgumentsList,
  ArgumentsTitle,
  ErrorsList,
  Hints,
  Signers,
} from './components';

/*
const validateByType = async (
  value: any,
  // type: string,
  // editor,
  // languageClient,
) => {
  if (value.length === 0) {
    return "Value can't be empty";
  }

  switch (true) {
    // // Strings
    // case type === 'String': {
    //   return null; // no need to validate String for now
    // }

    // // Integers
    // case type.includes('Int'): {
    //   if (isNaN(value) || value === '') {
    //     return 'Should be a valid Integer number';
    //   }
    //   return null;
    // }

    // // Words
    // case type.includes('Word'): {
    //   if (isNaN(value) || value === '') {
    //     return 'Should be a valid Word number';
    //   }
    //   return null;
    // }

    // // Fixed Point
    // case type.includes('Fix'): {
    //   if (isNaN(value) || value === '') {
    //     return 'Should be a valid fixed point number';
    //   }
    //   return null;
    // }

    // // Address
    // case type === 'Address': {
    //   if (!value.match(/(^0x[\w\d]{16})|(^0x[\w\d]{1,4})/)) {
    //     return 'Not a valid Address';
    //   }
    //   return null;
    // }

    // // Booleans
    // case type === 'Bool': {
    //   if (value !== 'true' && value !== 'false') {
    //     return 'Boolean values can be either true or false';
    //   }
    //   return null;
    // }

    default: {
/*      const result = await languageClient.sendRequest(
        ExecuteCommandRequest.type,
        {
          command: 'cadence.server.parseEntryPointArguments',
          arguments: [editor.getModel().uri.toString()],
        },
      );
      if (!result) {
        return 'Argument value is invalid.';
      }


      return null;
    }
  }
};
 */

const validate = async (list: any, values: any, editor: any, languageClient: any) => {

  return {}

  console.log({list})

  const result = await languageClient.sendRequest(
    ExecuteCommandRequest.type,
    {
      command: 'cadence.server.parseEntryPointArguments',
      arguments: [
        editor.getModel().uri.toString(),
        Object.values(values)
      ],
    },
  );

  console.log({result})

  return {};
  /*
  return list.reduce((acc: any, item: any) => {
    const { name, type } = item;
    const value = values[name];
    if (value) {
      const error = validateByType(value)//, type, editor, languageClient);
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
   */
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
  const { type, list, signers } = props;
  const { goTo, hover, hideDecorations, problems } = props;
  const validCode = problems.error.length === 0;

  const needSigners = type == EntityType.TransactionTemplate && signers > 0;
  const [selected, updateSelectedAccounts] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const [values, setValue] = useState<IValue>({});
  const constraintsRef = useRef();

  const errors = validate(list, values, props.editor, props.languageClient);
  const numberOfErrors = Object.keys(errors).length;
  const notEnoughSigners = needSigners && selected.length < signers;
  const haveErrors = numberOfErrors > 0 || notEnoughSigners;

  const [processingStatus, setProcessingStatus] = useState(false);

  const [setResult] = useSetExecutionResultsMutation();
  const {
    scriptFactory,
    transactionFactory,
    contractDeployment,
  } = useTemplateType();
  const { project, active, isSavingCode } = useProject();
  const { accounts } = project;

  const signersAccounts = selected.map((i) => accounts[i]);

  const send = async () => {
    if (!processingStatus) {
      setProcessingStatus(true);
    }

    // Map values to strings that will be passed to backend
    const args = list.map((arg) => {
      const { name, type } = arg;
      let value = values[name];

      // We probably better fix this on server side...
      if (type === 'UFix64') {
        if (value.indexOf('.') < 0) {
          value = `${value}.0`;
        }
      }

      return JSON.stringify({ value, type });
    });

    console.log({ args })

    console.log(props.editor.getModel());

    const formatted = await props.languageClient.sendRequest(
      ExecuteCommandRequest.type,
      {
        command: 'cadence.server.parseEntryPointArguments',
        arguments: [
          props.editor.getModel().uri.toString(),
          Object.values(args)
        ],
      },
    );

    console.log({formatted})

    return

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
      </motion.div>
    </>
  );
};

export default Arguments;
