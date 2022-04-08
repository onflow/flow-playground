// External Modules
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FaRegCheckCircle, FaRegTimesCircle, FaSpinner } from 'react-icons/fa';
import { ExecuteCommandRequest } from 'monaco-languageclient';
import {
  IPosition,
  editor as monacoEditor,
} from 'monaco-editor/esm/vs/editor/editor.api';

// Project Modules
import { CadenceCheckerContext } from 'providers/CadenceChecker';
import { EntityType } from 'providers/Project';
import { useProject } from 'providers/Project/projectHooks';
import {
  CadenceProblem,
  formatMarker,
  goTo,
  hideDecorations,
  Highlight,
  hover,
  ProblemsList,
} from 'util/language-syntax-errors';
import { extractSigners } from 'util/parser';
import { CadenceCheckCompleted } from 'util/language-server';

// Local Generated Modules
import {
  ResultType,
  useSetExecutionResultsMutation,
} from 'api/apollo/generated/graphql';

// Component Scoped Files
import { getLabel, validateByType, useTemplateType } from './utils';
import { ControlPanelProps, IValue } from './types';
import { MotionBox } from './components';

// Other
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
  HoverPanel,
  StatusMessage,
} from '../../Arguments/styles';

const ControlPanel: React.FC<ControlPanelProps> = (props) => {
  // We should not render this component if editor is non-existent
  if (!props.editor) {
    return null;
  }

  // ===========================================================================
  // GLOBAL HOOKS
  const { languageClient } = useContext(CadenceCheckerContext);
  const { project, active, isSavingCode } = useProject();

  // HOOKS  -------------------------------------------------------------------
  const [executionArguments, setExecutionArguments] = useState({});
  const [processingStatus, setProcessingStatus] = useState(false);
  const [setResult] = useSetExecutionResultsMutation();
  const { scriptFactory, transactionFactory, contractDeployment } =
    useTemplateType();
  const [selected, updateSelectedAccounts] = useState([]);
  const [expanded, setExpanded] = useState(true);

  const [values, setValue] = useState<IValue>({});
  // Handles errors with arguments
  const [errors, setErrors] = useState({});
  // Handles problems, hints and info for checked code
  const [problemsList, setProblemsList] = useState({});

  // REFS  -------------------------------------------------------------------
  // Holds reference to constraining div for floating window
  const constraintsRef = useRef();
  // Holds reference to Disposable callback for languageClient
  const clientOnNotification = useRef(null);

  // ===========================================================================
  // METHODS  ------------------------------------------------------------------
  /**
   * Make active key out of active project item type and index
   */
  const getActiveKey = () => `${active.type}-${active.index}`;

  /**
   * Returns a list of problems, hints and info for active code
   */
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

  /**
   * Sends request to langugeClient to get entry point parameters.
   * @return Promise which resolved to a list of arguments
   */
  const getParameters = async (): Promise<[any?]> => {
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

  /**
   * Process model markers and collect them into respective groups for rendering
   * Pay attention, that we are passing "processMarkers" into the callback function of
   * language server. This will create closure around methods  - like "getActiveKey"
   * and their returned values, which would be able to pick up changes in component state.
   */
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

  /**
   * Get list of arguments from this component's state
   */
  const getArguments = (): any => {
    const key = getActiveKey();
    return executionArguments[key] || [];
  };

  /**
   * Disposes old languageClient callback and attached new one to create proper closure for all local methods.
   * Otherwise, they will refer to old value of "project" prop and provide de-synced values
   */
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

  /**
   * Validates that list of arguments conforms to their respective types
   * @param list - list of argument types
   * @param values - list of argument values
   */
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

    setErrors(errors);
  };

  /**
   * Processes arguments and send scripts and transaction for execution or contracts for deployment
   */
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
    }).then();
  };

  // VARIABLES AND CONSTANTS  -------------------------------------------------
  const { editor } = props;
  const { type } = active;
  const code = editor.getModel().getValue();
  const problems = getProblems();
  const validCode = problems.error.length === 0;

  const signers = extractSigners(code).length;
  const needSigners = type == EntityType.TransactionTemplate && signers > 0;

  const numberOfErrors = Object.keys(errors).length;
  const notEnoughSigners = needSigners && selected.length < signers;
  const haveErrors = numberOfErrors > 0 || notEnoughSigners;

  const { accounts } = project;
  const signersAccounts = selected.map((i) => accounts[i]);

  const list = getArguments();
  const actions = {
    goTo: (position: IPosition) => goTo(editor, position),
    hideDecorations: () => hideDecorations(editor),
    hover: (highlight: Highlight) => hover(editor, highlight),
  };

  const isOk = !haveErrors && validCode !== undefined && !!validCode;
  let statusIcon = isOk ? <FaRegCheckCircle /> : <FaRegTimesCircle />;
  let statusMessage = isOk ? 'Ready' : 'Fix errors';

  const progress = isSavingCode || processingStatus;
  if (progress) {
    statusIcon = <FaSpinner className="spin" />;
    statusMessage = 'Please, wait...';
  }

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

          <ErrorsList list={problems.error} actions={actions} />
          <Hints problems={problems} actions={actions} />

          <ControlContainer isOk={isOk} progress={progress}>
            <StatusMessage>
              {statusIcon}
              <p>{statusMessage}</p>
            </StatusMessage>
            <ActionButton active={isOk} type={type} onClick={send} />
          </ControlContainer>
        </HoverPanel>
      </MotionBox>
    </>
  );
};

export default ControlPanel;
