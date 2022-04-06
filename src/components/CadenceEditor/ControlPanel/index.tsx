import React, { useContext, useEffect, useRef, useState } from 'react';
import { FaRegCheckCircle, FaRegTimesCircle, FaSpinner } from 'react-icons/fa';
import { AiFillCloseCircle } from 'react-icons/ai';
import { motion, AnimatePresence } from 'framer-motion';
import { ExecuteCommandRequest } from 'monaco-languageclient';
import { useThemeUI, Box, Text, Flex } from 'theme-ui';
import {
  IPosition,
  Range,
  editor as monacoEditor,
} from 'monaco-editor/esm/vs/editor/editor.api';

import {
  ResultType,
  useSetExecutionResultsMutation,
} from 'api/apollo/generated/graphql';

import { CadenceCheckerContext } from 'providers/CadenceChecker';
import { EntityType } from 'providers/Project';
import { useProject } from 'providers/Project/projectHooks';
import { RemoveToastButton } from 'layout/RemoveToastButton';
import {
  CadenceProblem,
  formatMarker,
  goTo,
  Highlight,
  ProblemsList,
} from 'util/language-syntax-errors';
import { extractSigners } from 'util/parser';

import {
  ActionButton,
  ArgumentsList,
  ArgumentsTitle,
  ErrorsList,
  Hints,
  Signers,
} from '../../Arguments/components';

import {
  ControlContainer,
  ToastContainer,
  HoverPanel,
  StatusMessage,
} from '../../Arguments/styles';

import { getLabel, validateByType, useTemplateType } from './utils';
import { ControlPanelProps, IValue } from './types';
import { MotionBox } from 'components/CadenceEditor/ControlPanel/components';
import { CadenceCheckCompleted } from 'util/language-server';

const hover =
  (editor: any) =>
  (highlight: Highlight): void => {
    const { startLine, startColumn, endLine, endColumn, color } = highlight;
    const model = editor.getModel();

    const selection = model.getAllDecorations().find((item: any) => {
      return (
        item.range.startLineNumber === startLine &&
        item.range.startColumn === startColumn
      );
    });

    const selectionEndLine = selection
      ? selection.range.endLineNumber
      : endLine;
    const selectionEndColumn = selection
      ? selection.range.endColumn
      : endColumn;

    const highlightLine = [
      {
        range: new Range(startLine, startColumn, endLine, endColumn),
        options: {
          isWholeLine: true,
          className: `playground-syntax-${color}-hover`,
        },
      },
      {
        range: new Range(
          startLine,
          startColumn,
          selectionEndLine,
          selectionEndColumn,
        ),
        options: {
          isWholeLine: false,
          className: `playground-syntax-${color}-hover-selection`,
        },
      },
    ];
    editor.getModel().deltaDecorations([], highlightLine);
    editor.revealLineInCenter(startLine);
  };

const ControlPanel: React.FC<ControlPanelProps> = (props) => {
  // Props
  const { editor } = props;

  if (!editor) {
    return null;
  }

  // Hooks
  const { languageClient } = useContext(CadenceCheckerContext);
  const {
    project,
    active,
    isSavingCode,
    lastSigners,
    // updateAccountDeployedCode
  } = useProject();
  const { theme } = useThemeUI();

  const getActiveKey = () => `${active.type}-${active.index}`;

  // Destructuring
  const { type } = active;

  // Collect problems with the code
  const [problemsList, setProblemsList] = useState({});

  const getProblems = (): ProblemsList => {
    const key = getActiveKey();
    return (
      problemsList[key] || {
        error: [],
        warning: [],
        hint: [],
        info: [],
      }
    );
  };

  const [list, setList] = useState([]);

  const code = '';
  const signers = extractSigners(code).length;

  const problems = getProblems();
  const validCode = problems.error.length === 0;

  const needSigners = type == EntityType.TransactionTemplate && signers > 0;
  const [selected, updateSelectedAccounts] = useState([]);
  const [errors, setErrors] = useState({});
  const [expanded, setExpanded] = useState(true);
  const [values, setValue] = useState<IValue>({});
  const constraintsRef = useRef();

  const removeNotification = (set: any, id: number) => {
    set((prev: any[]) => {
      delete prev[id];
      return {
        ...prev,
      };
    });
  };

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

    console.log({ errors });
    setErrors(errors);
  };

  const [processingStatus, setProcessingStatus] = useState(false);

  const [setResult] = useSetExecutionResultsMutation();
  const { scriptFactory, transactionFactory, contractDeployment } =
    useTemplateType();

  const [notifications, setNotifications] = useState<{
    [identifier: string]: string[];
  }>({});

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

      if (type === `String`) {
        value = `${value}`;
      }

      // We probably better fix this on server side...
      if (type === 'UFix64') {
        if (value.indexOf('.') < 0) {
          value = `${value}.0`;
        }
      }

      // Language server throws "input is not literal" without quotes
      if (type === `String`) {
        value = `\"${value.replace(/"/g, '\\"')}\"`;
      }

      return value;
    });

    let formatted: any;
    try {
      formatted = await languageClient.sendRequest(ExecuteCommandRequest.type, {
        command: 'cadence.server.parseEntryPointArguments',
        arguments: [editor.getModel().uri.toString(), fixed],
      });
    } catch (e) {
      console.log(e);
    }

    // Map values to strings that will be passed to backend
    const args: any = list.map((_, index) => JSON.stringify(formatted[index]));

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

  const actions = {
    goTo: (position: IPosition) => goTo(editor, position),
    hideDecorations: () => {},
    hover: () => {},
  };

  // ===========================================================================
  // Connect LanguageClient to ControlPanel
  // HOOKS  -------------------------------------------------------------------
  const clientOnNotification = useRef(null);
  const [executionArguments, setExecutionArguments] = useState({});

  // METHODS  ------------------------------------------------------------------
  const getParameters = async () => {
    if (!languageClient) {
      return [];
    }
    try {
      const args = await languageClient.sendRequest(
        ExecuteCommandRequest.type,
        {
          command: 'cadence.server.getEntryPointParameters',
          arguments: [editor.getModel().uri.toString()],
        },
      );
      return args || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  // Pay attention, that we are passing "processMarkers" into the callback function of
  // language server. This will create closure around methods  - like "getActiveKey"
  // and their returned values, which would be able to pick up changes in component state.
  const processMarkers = () => {
    const model = editor.getModel();
    const modelMarkers = monacoEditor.getModelMarkers({ resource: model.uri });
    const errors = modelMarkers.reduce(
      (acc: { [key: string]: CadenceProblem[] }, marker) => {
        const mappedMarker: CadenceProblem = formatMarker(marker);
        acc[mappedMarker.type].push(mappedMarker);
        return acc;
      },
      {
        error: [],
        warning: [],
        info: [],
        hint: [],
      },
    );

    const key = getActiveKey(); // <- this value will be from static closure

    setProblemsList({
      ...problemsList,
      [key]: errors,
    });
  };

  const setupLanguageClientListener = () => {
    if (clientOnNotification.current) {
      clientOnNotification.current.dispose();
    }
    clientOnNotification.current = languageClient.onNotification(
      CadenceCheckCompleted.methodName,
      async (result: CadenceCheckCompleted.Params) => {
        console.log('%cCheck completed', { color: 'green' });
        if (result.valid) {
          const params = await getParameters();
          const key = getActiveKey();

          // Update state
          setExecutionArguments({
            ...executionArguments,
            [key]: params,
          });
        }
        processMarkers();
      },
    );
  };

  // EFFECTS ------------------------------------------------------------------
  useEffect(() => {
    if (languageClient) {
      setupLanguageClientListener();
    }
  }, [languageClient, active]);

  useEffect(() => {
    validate(list, values);
  }, [list, values]);

  // ===========================================================================
  // RENDER
  return (
    <>
      <div ref={constraintsRef} className="constraints" />
      <MotionBox dragConstraints={constraintsRef}>
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
      </MotionBox>
      <ToastContainer>
        <ul>
          <AnimatePresence initial={true}>
            {Object.keys(notifications).map((id) => {
              const updatedAccounts = notifications[id];

              let updatedStorageAccts: string[] = [];
              updatedAccounts.map((acct: any) => {
                const addr = acct.address;
                const acctNum = addr.charAt(addr.length - 1);
                const acctHex = `0x0${acctNum}`;
                updatedStorageAccts.push(acctHex);
              });

              // render a new list item for each new id in 'notifications' state
              return (
                lastSigners &&
                updatedStorageAccts && (
                  <motion.li
                    key={id}
                    layout
                    initial={{ opacity: 0, y: 50, scale: 0.3 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{
                      opacity: 0,
                      scale: 0.5,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <Flex
                      sx={{
                        justifyContent: 'flex-end',
                      }}
                    >
                      <RemoveToastButton
                        onClick={() =>
                          removeNotification(setNotifications, parseInt(id))
                        }
                      >
                        <AiFillCloseCircle color="grey" size="32" />
                      </RemoveToastButton>
                    </Flex>
                    <Box
                      my={1}
                      sx={{
                        marginTop: '0.0rem',
                        padding: '0.8rem 0.5rem',
                        alignItems: 'center',
                        border: `1px solid ${theme.colors.borderDark}`,
                        backgroundColor: theme.colors.background,
                        borderRadius: '8px',
                        maxWidth: '500px',
                        boxShadow:
                          '10px 10px 20px #c9c9c9, -10px -10px 20px #ffffff',
                      }}
                    >
                      <Text
                        sx={{
                          padding: '0.75rem',
                        }}
                      >
                        {`Account${lastSigners?.length > 1 ? 's' : ''}
                        ${lastSigners.join(', ')}
                        updated the storage in
                        account${updatedStorageAccts?.length > 1 ? 's' : ''}
                        ${updatedStorageAccts.join(', ')}.`}
                      </Text>
                    </Box>
                  </motion.li>
                )
              );
            })}
          </AnimatePresence>
        </ul>
      </ToastContainer>
    </>
  );
};

export default ControlPanel;
