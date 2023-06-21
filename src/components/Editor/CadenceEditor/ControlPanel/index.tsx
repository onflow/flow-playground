// External Modules
import {
  editor as monacoEditor,
  IPosition,
} from 'monaco-editor/esm/vs/editor/editor.api';
import { ExecuteCommandRequest } from 'monaco-languageclient';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { FaRegTimesCircle, FaSpinner } from 'react-icons/fa';

// Project Modules
import { CadenceCheckerContext } from 'providers/CadenceChecker';
import { EntityType } from 'providers/Project';
import { useProject } from 'providers/Project/projectHooks';
import { CadenceCheckCompleted } from 'util/language-server';
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

// Local Generated Modules
import {
  Account,
  ResultType,
  useSetExecutionResultsMutation,
} from 'api/apollo/generated/graphql';

// Component Scoped Files
import { MotionBox, StatusIcon } from './components';
import { ControlPanelProps, IValue, UNSUPPORTED_TYPES } from './types';
import {
  getLabel,
  getResultType,
  useTemplateType,
  validateByType,
} from './utils';

// Other
import {
  EditorActionButton,
  ArgumentsList,
  ArgumentsTitle,
  Hints,
} from './Arguments/components';
import {
  ControlContainer,
  HoverPanel,
  StatusMessage,
} from './Arguments/styles';
import { SignersPanel } from 'components/Editor/CadenceEditor/ControlPanel/SignersPanel';
import { Template } from 'src/types';
import DismissiblePopup from 'components/DismissiblePopup';
import { userModalKeys } from 'util/localstorage';
import { addressToAccount } from 'util/accounts';
import theme from '../../../../theme';
import { Argument } from './Arguments/types';

const ButtonActionLabels = {
  [String(EntityType.TransactionTemplate)]: 'Send',
  [String(EntityType.ScriptTemplate)]: 'Execute',
  [String(EntityType.AccountStorage)]: 'Unknown',
  [String(EntityType.ContractTemplate)]: '',
};
const RedeployModalData = {
  title: 'Redeploy contracts will cause rollback',
  messages: [] as string[],
};
const ControlPanel: React.FC<ControlPanelProps> = (props) => {
  // ===========================================================================
  // GLOBAL HOOKS
  const { languageClient } = useContext(CadenceCheckerContext);
  const { project, active, isExecutingAction, setShowBottomPanel, isSaving } =
    useProject();

  // HOOKS  -------------------------------------------------------------------
  const [executionArguments, setExecutionArguments] = useState<any>({});
  const [processingStatus, setProcessingStatus] = useState(false);
  const [setResult] = useSetExecutionResultsMutation();
  const { scriptFactory, transactionFactory, contractDeployment } =
    useTemplateType();
  const [selectedAccounts, updateSelectedAccounts] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const [showRedeploy, setShowRedeploy] = useState(false);
  const [values, setValue] = useState<IValue>({});
  // Handles errors with arguments
  const [errors, setErrors] = useState({});
  // Handles problems, hints and info for checked code

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
      props.problemsList[key] || {
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

    props.setProblemsList({
      ...props.problemsList,
      [key]: errors,
    });
  };

  /**
   * Get list of arguments from this component's state
   */
  const getArguments = (): any => {
    const key = getActiveKey();
    const addSupported = (executionArguments[key] || []).map((arg: any) => ({
      ...arg,
      unsupported: UNSUPPORTED_TYPES.includes(arg.type),
    }));
    return addSupported;
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
    const errors = list.reduce((acc: any, item: Argument) => {
      const { name, type } = item;
      const value = values[name];
      if (item.unsupported) {
        acc[name] = `Type ${type} is not supported in Playground`;
      } else if (value) {
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

  // test if deployment of contract will rollback emulator
  // if same user has deployed same contract in the past
  // then emulator will be rolled back and contracts deployed afterwards will also be rolled back
  const isContractRedeploy = (
    type: EntityType,
    selectedAccounts: number[],
    accounts: Account[],
    activeIndex: number,
  ): boolean => {
    if (type !== EntityType.ContractTemplate) return false;
    const user = selectedAccounts[0];
    const acct = accounts[user];
    const template = project.contractTemplates[activeIndex];
    const templateContract = (template as Template)?.name;
    return (acct?.deployedContracts || []).includes(templateContract);
  };

  const actionButtonLabel = useMemo(() => {
    const type = active.type;
    const label = ButtonActionLabels[type];
    if (label) return label;

    const isRedeploy = isContractRedeploy(
      type,
      selectedAccounts,
      project.accounts,
      active.index,
    );
    const redeploy = isRedeploy ? 'Redeploy' : 'Deploy';
    return redeploy;
  }, [active.index, active.type, selectedAccounts, project.accounts, isSaving]);

  const doSend = async () => {
    if (active.type !== EntityType.ContractTemplate) return send(true);
    const isRedeploy = isContractRedeploy(
      active.type,
      selectedAccounts,
      project.accounts,
      active.index,
    );
    if (!isRedeploy) return send(true);

    // determine if other contracts will need to be redeployed and prompt user
    const template = project.contractTemplates[active.index];
    const contractName = (template as Template)?.name;
    if (!contractName) return send(true);

    const deployment = project.contractDeployments.find(
      (d) => d.title === contractName,
    );

    if (!deployment) return send(true);

    const rollbackBlock = deployment.blockHeight;
    const needRedeploy = (project.contractDeployments || [])
      .filter((c) => c.blockHeight > rollbackBlock)
      .map((c) => ({ title: c.title, account: addressToAccount(c.address) }));

    if (needRedeploy.length === 0) return send(true);

    RedeployModalData.messages = [
      `Emulator will roback to block ${rollbackBlock} to redeploy Contract ${contractName}`,
      `Contract${
        needRedeploy.length > 1 ? 's' : ''
      } that will not exist at block ${rollbackBlock}`,
      ...needRedeploy.map((r) => `${r.account}: ${r.title}`),
      `Redeploy ${needRedeploy.length > 1 ? 'these' : 'this'} contract${
        needRedeploy.length > 1 ? 's' : ''
      } if needed`,
    ];

    setShowRedeploy(true);
    return;
  };
  /**
   * Processes arguments and send scripts and transaction for execution or contracts for deployment
   */
  const send = async (doRun: boolean) => {
    setShowRedeploy(false);
    if (!doRun) return;

    if (!processingStatus) {
      setProcessingStatus(true);
    }
    const fixed = list.map((arg: any) => {
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
        value = `"${value.replace(/"/g, '\\"')}"`;
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

    let rawResult, resultType;
    if (!formatted) {
      resultType = getResultType(type);
      rawResult = 'Error parsing arguments';
    } else {
      // Map values to strings that will be passed to backend
      const args: any = list.map((_: any, index: number) =>
        JSON.stringify(formatted[index]),
      );

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

          case EntityType.ContractTemplate: {
            const selectedAccountId = selectedAccounts[0] || 0;
            resultType = ResultType.Contract;
            rawResult = await contractDeployment(
              active.index,
              selectedAccountId,
            );
            break;
          }
          default:
            break;
        }
      } catch (e) {
        console.error(e);
        rawResult = e.toString();
      }
    }

    setProcessingStatus(false);
    setShowBottomPanel(true);

    // Display result in the bottom area
    setResult({
      variables: {
        label: getLabel(resultType, project, active.index),
        resultType,
        rawResult,
      },
    }).then();
  };

  // MEMOIZED -----------------------------------------------------------------
  // we need to wrap it in useMemo, cause otherwise it might push component into infinite rerender
  // as "getArguments" will return new empty array on each render
  const list = useMemo(getArguments, [active, executionArguments]);

  // VARIABLES AND CONSTANTS  -------------------------------------------------
  const { editor } = props;
  const { type } = active;
  const code = editor.getModel().getValue();
  const problems = getProblems();
  const validCode = problems.error.length === 0;

  // contracts need one signer for deployment
  const signers =
    type === EntityType.TransactionTemplate ? extractSigners(code).length : 1;
  const needSigners =
    (type === EntityType.TransactionTemplate && signers > 0) ||
    type == EntityType.ContractTemplate;
  const numberOfErrors = Object.keys(errors).length;

  // TODO: disable button if not enough signers
  const notEnoughSigners = needSigners && selectedAccounts.length < signers;
  const haveErrors = numberOfErrors > 0;

  const { accounts } = project;
  const signersAccounts = selectedAccounts.map((i: number) => accounts[i]);

  const actions = {
    goTo: (position: IPosition) => goTo(editor, position),
    hideDecorations: () => hideDecorations(editor),
    hover: (highlight: Highlight) => hover(editor, highlight),
  };

  const openErrorPanel = () => {
    props.setSelectedBottomTab(1);
    setShowBottomPanel(true);
  };

  const isOk =
    !haveErrors && validCode !== undefined && !!validCode && !notEnoughSigners;
  let statusIcon;
  let statusMessage;
  switch (true) {
    case !isOk:
      statusIcon = <FaRegTimesCircle />;
      statusMessage = problems?.error?.length
        ? `${problems?.error?.length} Error${
            problems?.error?.length > 1 ? 's' : ''
          }`
        : '';
      break;
  }

  const progress = isExecutingAction || processingStatus;
  if (progress) {
    statusIcon = <FaSpinner className="spin" />;
    statusMessage = 'Please wait...';
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

  if (type === EntityType.AccountStorage || theme.isMobile) {
    return null;
  }

  return (
    <>
      <div ref={constraintsRef} className="constraints" />
      <MotionBox dragConstraints={constraintsRef}>
        <HoverPanel minWidth="362px">
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
            <SignersPanel
              maxSelection={signers}
              selectedAccounts={selectedAccounts}
              updateSelectedAccounts={updateSelectedAccounts}
            />
          )}
          <Hints problems={problems} actions={actions} />
          <ControlContainer isOk={isOk} progress={progress} showPrompt={false}>
            {statusMessage && (
              <StatusMessage
                isOk={isOk}
                data-test="control-panel-status-message"
                onClick={openErrorPanel}
              >
                <StatusIcon isOk={isOk} progress={progress} showPrompt={false}>
                  {statusIcon}
                </StatusIcon>
                <p>{statusMessage}</p>
              </StatusMessage>
            )}
            <EditorActionButton
              enabled={isOk}
              label={actionButtonLabel}
              selectedAccounts={selectedAccounts}
              onClick={() => doSend()}
            />
          </ControlContainer>
        </HoverPanel>
      </MotionBox>
      <DismissiblePopup
        visible={showRedeploy}
        storageKey={userModalKeys.REDEPLOY_KEY}
        onClose={send}
        {...RedeployModalData}
      />
    </>
  );
};

export default ControlPanel;
