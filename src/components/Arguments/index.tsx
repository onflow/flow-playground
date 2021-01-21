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
import * as monaco from "monaco-editor/esm/vs/editor/editor.api"

import { ControlContainer, HoverPanel, StatusMessage, Heading, Title } from './styles';
import { Argument } from './types';
import {
  ActionButton,
  ArgumentsList,
  ArgumentsTitle,
  Signers,
} from './components';
import { CadenceSyntaxError, Highlight } from "../../util/language-syntax-errors";
import { Stack } from "layout/Stack";


type ArgumentsProps = {
  type: EntityType;
  list: Argument[];
  validCode: boolean;
  signers: number;
  syntaxErrors: CadenceSyntaxError[];
  goTo: (position: monaco.IPosition) => void;
  hover: (highlight: Highlight) => void;
  hideDecorations: () => void;
};

const validateByType = (value: any, type: string) => {
  if (value.length === 0) {
    return "Value can't be empty";
  }

  switch (true) {
    // Strings
    case type === 'String': {
      return null; // no need to validate String for now
    }

    // Integers
    case type.includes('Int'): {
      if (isNaN(value)) {
        return 'Should be a valid Integer number';
      }
      return null;
    }

    // Words
    case type.includes('Word'): {
      if (isNaN(value)) {
        return 'Should be a valid Word number';
      }
      return null;
    }

    // Fixed Point
    case type.includes('Fix'): {
      if (isNaN(value)) {
        return 'Should be a valid fixed point number';
      }
      return null;
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

    default:
      return null;
  }
};

const validate = (list: any, values: any) => {
  const result = list.reduce((acc: any, item: any) => {
    const { name, type } = item;
    const value = values[name];
    if (value) {
      const error = validateByType(value, type);
      if (error) {
        acc[name] = error;
      }
    }
    return acc;
  }, {});

  return result;
};

const getLabel = (resultType: ResultType, project: any, index: number) : string => {
  return resultType === ResultType.Contract
  ? 'Deployment'
  : resultType === ResultType.Script
  ? project.scriptTemplates[index].title
  : resultType === ResultType.Transaction
  ? project.transactionTemplates[index].title
  : 'Interaction';
}


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
  const { type, list, signers, validCode } = props;
  const { goTo, hover, hideDecorations, syntaxErrors } = props;
  const needSigners = type == EntityType.TransactionTemplate && signers > 0;
  const [selected, updateSelectedAccounts] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const [values, setValue] = useState<IValue>({});
  const constraintsRef = useRef();

  const errors = validate(list, values);
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
      return JSON.stringify({ value: values[name], type });
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
          {list.length > 0 && (
            <>
              <ArgumentsTitle
                type={type}
                errors={numberOfErrors}
                expanded={expanded}
                setExpanded={setExpanded}
              />

              {
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
              }
            </>
          )}
          {
            syntaxErrors.length > 0 && (
              <Stack>
                <Heading>
                  <Title>Syntax Errors</Title>
                </Heading>
                <Stack>
                  {syntaxErrors.map((item: CadenceSyntaxError) =>{
                    return <div
                      onClick={()=>goTo(item.position)}
                      onMouseOver={()=>hover(item.highlight)}
                      onMouseOut={()=>hideDecorations()}>{item.message}</div>
                  })}
                </Stack>
              </Stack>
            )
          }
          {needSigners && (
            <Signers
              maxSelection={signers}
              selected={selected}
              updateSelectedAccounts={updateSelectedAccounts}
            />
          )}
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
