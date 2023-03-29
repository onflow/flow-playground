import { useApolloClient, useQuery } from '@apollo/react-hooks';
import { navigate, Redirect, useLocation } from '@reach/router';
import { Account, Project } from 'api/apollo/generated/graphql';
import { GET_ACTIVE_PROJECT } from 'api/apollo/queries';
import React, { createContext, useEffect, useState } from 'react';
import { ChildProps } from 'src/types';
import { getParams, LOCAL_PROJECT_ID } from 'util/url';
import useGetProject from './projectHooks';
import ProjectMutator, { PROJECT_SERIALIZATION_KEY } from './projectMutator';
import { storageMapByAddress } from 'util/accounts';
import { editor as monacoEditor } from 'monaco-editor/esm/vs/editor/editor.api';

export enum EntityType {
  AccountStorage,
  ContractTemplate,
  TransactionTemplate,
  ScriptTemplate,
  Readme,
}

export type ActiveEditor = {
  type: EntityType;
  index: number;
  // TODO: Type onChange functions for each EntityType
  onChange: any;
};

export interface ProjectContextValue {
  project: Project | null;
  isLoading: boolean;
  mutator: ProjectMutator;
  createBlankProject: () => Promise<Project>;
  updateProject: (
    title: string,
    description: string,
    readme: string,
  ) => Promise<any>;
  saveProject: () => Promise<any>;
  deleteProject: (projectId: string) => Promise<any>;
  createContractDeployment: (
    fileIndex: number,
    accountId: number,
  ) => Promise<any>;
  updateSelectedContractAccount: (accountIndex: number) => void;
  updateSelectedTransactionAccounts: (accountIndexes: number[]) => void;
  updateActiveContractTemplate: (script: string) => Promise<any>;
  updateActiveScriptTemplate: (script: string, title: string) => Promise<any>;
  updateActiveTransactionTemplate: (
    script: string,
    title: string,
  ) => Promise<any>;
  updateScriptTemplate: (
    templateId: string,
    title: string,
    script: string,
  ) => Promise<any>;
  updateTransactionTemplate: (
    templateId: string,
    title: string,
    script: string,
  ) => Promise<any>;
  updateContractTemplate: (title: string, script: string) => Promise<any>;
  deleteScriptTemplate: (templateId: string) => void;
  deleteTransactionTemplate: (templateId: string) => void;
  deleteContractTemplate: (templateID: string) => void;
  createTransactionExecution: (
    signingAccounts: Account[],
    args?: string[],
  ) => Promise<any>;
  createScriptExecution: (args?: string[]) => Promise<any>;
  active: ActiveEditor;
  setActive: (type: EntityType, index: number) => void;
  getActiveCode: () => [string, number];
  selectedResourceAccount: string;
  setSelectedResourceAccount: (account: string) => void;
  lastSigners: string[];
  setLastSigners: (signers: string[]) => void;
  transactionAccounts: number[];
  isSaving: boolean;
  isExecutingAction: boolean;
  showProjectsSidebar: boolean;
  toggleProjectsSidebar: () => void;
  showBottomPanel: boolean;
  toggleBottomPanel: () => void;
  setShowBottomPanel: (show: boolean) => void;
  applicationErrorMessage: string;
  setApplicationErrorMessage: (message: string) => void;
  clearApplicationErrors: () => void;
  setCurrentEditor: (editor: monacoEditor.ICodeEditor) => void;
  currentEditor: monacoEditor.ICodeEditor | null;
}

export const ProjectContext: React.Context<ProjectContextValue> =
  createContext(null);

interface ProjectProviderProps extends ChildProps {
  urlProjectId: string | null;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({
  children,
  urlProjectId,
}) => {
  const client = useApolloClient();

  const {
    data: { activeProject, activeProjectId },
  } = useQuery(GET_ACTIVE_PROJECT, {
    context: {
      serializationKey: PROJECT_SERIALIZATION_KEY,
    },
  });

  const projectId = urlProjectId || activeProjectId;

  let project: Project;
  let isLocal: boolean;
  let isLoading: boolean;
  try {
    const {
      project: _project,
      isLocal: _isLocal,
      isLoading: _isLoading,
    } = useGetProject(client, projectId, activeProject);
    project = _project;
    isLocal = _isLocal;
    isLoading = _isLoading;
  } catch (e) {
    console.error(e);
    navigate('/404');
  }

  const [active, setActive] = useState<{ type: EntityType; index: number }>({
    type: EntityType.ContractTemplate,
    index: 0,
  });
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [transactionAccounts, setTransactionAccounts] = useState<number[]>([0]);
  const [isSaving, setIsSaving] = useState(false);
  const [isExecutingAction, setIsExecutingAction] = useState(false);
  const [lastSigners, setLastSigners] = useState(null);
  const [showProjectsSidebar, setShowProjectsSidebar] = useState(false);
  const [showBottomPanel, setShowBottomPanel] = useState(false);
  const [applicationErrorMessage, setApplicationErrorMessage] = useState('');
  const [currentEditor, setCurrentEditor] =
    useState<monacoEditor.ICodeEditor | null>(null);

  useEffect(() => {
    if (showProjectsSidebar) {
      // close project sidebar if open and a different project gets loaded.
      setShowProjectsSidebar(false);
    }
  }, [projectId]);

  const [selectedResourceAccount, setSelectedResourceAccount] = useState<
    string | null
  >(null);

  const toggleProjectsSidebar = () => setShowProjectsSidebar((prev) => !prev);
  const toggleBottomPanel = () => setShowBottomPanel((prev) => !prev);

  const projectID = project ? project.id : null;
  const title = project ? project.title : null;
  const description = project ? project.description : null;
  const readme = project ? project.readme : null;

  const mutator = new ProjectMutator(
    client,
    projectID,
    isLocal,
    title,
    description,
    readme,
  );

  const createBlankProject = async () => {
    setIsSaving(true);
    let res;
    try {
      // create default project and save to cache
      project = await mutator.createLocalProject();
      navigate(`/${project.id}`, { replace: true });
    } catch (e) {
      setIsSaving(false);
      await mutator.getApplicationErrors().then((res) => {
        setApplicationErrorMessage(res.errorMessage);
      });
    }
    setIsSaving(false);
    setShowProjectsSidebar(false);
    return res;
  };

  const updateProject: any = async (
    title: string,
    description: string,
    readme: string,
  ) => {
    setIsSaving(true);
    let res;
    try {
      if (project.id === LOCAL_PROJECT_ID) {
        mutator.updateLocalProjectMeta(title, description, readme);
      } else {
        res = await mutator.saveProject(title, description, readme);
      }
    } catch (e) {
      console.error(e);
      setIsSaving(false);
      await mutator.getApplicationErrors().then((res) => {
        setApplicationErrorMessage(res.errorMessage);
      });
    }
    setIsSaving(false);
    return res;
  };

  /**
   * save local project to server and get project id
   */
  const saveProject: any = async () => {
    setIsSaving(true);
    let res;
    try {
      res = await mutator.saveProject(title, description, readme);
    } catch (e) {
      setIsSaving(false);
      await mutator.getApplicationErrors().then((res) => {
        setApplicationErrorMessage(res.errorMessage);
      });
    }

    setIsSaving(false);
    return res;
  };

  const deleteProject = async (dProjectId: string) => {
    setIsSaving(true);
    let res;
    try {
      res = await mutator.deleteProject(dProjectId);
      if (projectId === dProjectId) {
        navigate(`/`);
      }
    } catch (e) {
      console.error(e);
      setIsSaving(false);
      await mutator.getApplicationErrors().then((res) => {
        setApplicationErrorMessage(res.errorMessage);
      });
    }
    setIsSaving(false);
    return res;
  };

  const createContractDeployment: any = async (
    fileIndex: number,
    accountId: number,
  ) => {
    setIsSaving(true);
    setIsExecutingAction(true);
    let res;
    try {
      const deployAccount = project.accounts[accountId];
      const template = project.contractTemplates[fileIndex];
      res = await mutator.createContractDeployment(
        template,
        deployAccount,
        active.index,
      );

      const addr = project.accounts[active.index].address;
      const acctNum = addr.charAt(addr.length - 1);
      const acctHex = `0x0${acctNum}`;
      const signer = [acctHex];
      setLastSigners(signer);
    } catch (e) {
      console.error(e);
      setIsSaving(false);
      setIsExecutingAction(false);
      await mutator.getApplicationErrors().then((res) => {
        setApplicationErrorMessage(res.errorMessage);
      });
    }
    setIsSaving(false);
    setIsExecutingAction(false);
    return res;
  };

  const updateContractTemplate = async (script: string, title: string) => {
    setIsSaving(true);
    let res;
    try {
      res = await mutator.updateContractTemplate(
        project.contractTemplates[active.index],
        script,
        title,
        active.index,
      );
    } catch (e) {
      console.error(e);
      setIsSaving(false);
      await mutator.getApplicationErrors().then((res) => {
        setApplicationErrorMessage(res.errorMessage);
      });
    }
    setIsSaving(false);
    return res;
  };

  const updateActiveContractTemplate = async (script: string) => {
    setIsSaving(true);
    let res;
    const contractTemplate = project.contractTemplates[active.index];
    try {
      res = await mutator.updateContractTemplate(
        project.contractTemplates[active.index],
        script,
        contractTemplate.title,
        active.index,
      );
    } catch (e) {
      console.error(e);
      setIsSaving(false);
      await mutator.getApplicationErrors().then((res) => {
        setApplicationErrorMessage(res.errorMessage);
      });
    }
    setIsSaving(false);
    return res;
  };

  const updateScriptTemplate = async (
    templateId: string,
    script: string,
    title: string,
  ) => {
    setIsSaving(true);
    let res;
    try {
      res = await mutator.updateScriptTemplate(templateId, script, title);
    } catch (e) {
      console.error(e);
      setIsSaving(false);
      await mutator.getApplicationErrors().then((res) => {
        setApplicationErrorMessage(res.errorMessage);
      });
    }
    setIsSaving(false);
    return res;
  };

  const updateTransactionTemplate = async (
    templateId: string,
    script: string,
    title: string,
  ) => {
    setIsSaving(true);
    let res;
    try {
      res = await mutator.updateTransactionTemplate(templateId, script, title);
    } catch (e) {
      console.error(e);
      setIsSaving(false);
      await mutator.getApplicationErrors().then((res) => {
        setApplicationErrorMessage(res.errorMessage);
      });
    }
    setIsSaving(false);
    return res;
  };

  const updateActiveScriptTemplate = async (script: string) => {
    setIsSaving(true);
    let res;
    try {
      res = await mutator.updateScriptTemplate(
        project.scriptTemplates[active.index].id,
        script,
        project.scriptTemplates[active.index].title,
      );
    } catch (e) {
      console.error(e);
      setIsSaving(false);
      await mutator.getApplicationErrors().then((res) => {
        setApplicationErrorMessage(res.errorMessage);
      });
    }
    setIsSaving(false);
    return res;
  };

  const updateActiveTransactionTemplate = async (script: string) => {
    setIsSaving(true);
    let res;
    try {
      res = await mutator.updateTransactionTemplate(
        project.transactionTemplates[active.index].id,
        script,
        project.transactionTemplates[active.index].title,
      );
    } catch (e) {
      console.error(e);
      setIsSaving(false);
      await mutator.getApplicationErrors().then((res) => {
        setApplicationErrorMessage(res.errorMessage);
      });
    }
    setIsSaving(false);
    return res;
  };

  const createTransactionExecution = async (
    signingAccounts: Account[],
    args?: [string],
  ) => {
    setIsSaving(true);
    setIsExecutingAction(true);
    let res;
    try {
      res = await mutator.createTransactionExecution(
        project.transactionTemplates[active.index].script,
        signingAccounts,
        args,
      );

      let signers: string[] = [];
      signingAccounts?.map((acct: any) => {
        const addr = acct.address;
        const acctNum = addr.charAt(addr.length - 1);
        const acctHex = `0x0${acctNum}`;
        signers.push(acctHex);
      });
      setLastSigners(signers);
    } catch (e) {
      console.error(e);
      setIsSaving(false);
      setIsExecutingAction(false);
      await mutator.getApplicationErrors().then((res) => {
        setApplicationErrorMessage(res.errorMessage);
      });
    }
    setIsSaving(false);
    setIsExecutingAction(false);
    return res;
  };

  const createScriptExecution = async (args?: string[]) => {
    setIsSaving(true);
    setIsExecutingAction(true);
    let res;
    try {
      res = await mutator.createScriptExecution(
        project.scriptTemplates[active.index].script,
        args,
      );
    } catch (e) {
      console.error(e);
      setIsSaving(false);
      setIsExecutingAction(false);
      await mutator.getApplicationErrors().then((res) => {
        setApplicationErrorMessage(res.errorMessage);
      });
    }
    setIsSaving(false);
    setIsExecutingAction(false);
    return res;
  };

  const deleteContractTemplate = async (templateId: string) => {
    setIsSaving(true);
    let res;
    try {
      res = await mutator.deleteContractTemplate(templateId);
    } catch (e) {
      console.error(e);
      setIsSaving(false);
      await mutator.getApplicationErrors().then((res) => {
        setApplicationErrorMessage(res.errorMessage);
      });
    }
    setIsSaving(false);
    return res;
  };

  const deleteScriptTemplate = async (templateId: string) => {
    setIsSaving(true);
    let res;
    try {
      res = await mutator.deleteScriptTemplate(templateId);
    } catch (e) {
      console.error(e);
      setIsSaving(false);
      await mutator.getApplicationErrors().then((res) => {
        setApplicationErrorMessage(res.errorMessage);
      });
    }
    setIsSaving(false);
    return res;
  };

  const deleteTransactionTemplate = async (templateId: string) => {
    setIsSaving(true);
    let res;
    try {
      res = await mutator.deleteTransactionTemplate(templateId);
    } catch (e) {
      console.error(e);
      setIsSaving(false);
      await mutator.getApplicationErrors().then((res) => {
        setApplicationErrorMessage(res.errorMessage);
      });
    }
    setIsSaving(false);
    return res;
  };

  const updateSelectedContractAccount = (accountIndex: number) => {
    setActive({ type: EntityType.AccountStorage, index: accountIndex });
  };

  const updateSelectedTransactionAccounts = (accountIndexes: number[]) => {
    setTransactionAccounts(accountIndexes);
  };

  const clearApplicationErrors = () => {
    mutator.clearApplicationErrors();
  };

  const getActiveEditor = (): ActiveEditor => {
    switch (active.type) {
      case EntityType.AccountStorage:
        return {
          type: active.type,
          index: active.index,
          onChange: () => '',
        };
      case EntityType.ContractTemplate:
        return {
          type: active.type,
          index: active.index,
          onChange: (code: string) => updateActiveContractTemplate(code),
        };
      case EntityType.TransactionTemplate:
        return {
          type: active.type,
          index: active.index,
          onChange: (code: any) => updateActiveTransactionTemplate(code),
        };
      case EntityType.ScriptTemplate:
        return {
          type: active.type,
          index: active.index,
          onChange: (code: any) => updateActiveScriptTemplate(code),
        };
      case EntityType.Readme:
        return {
          type: active.type,
          index: active.index,
          onChange: (title: string, description: string, readme: string) => {
            if (project.persist) updateProject(title, description, readme);
          },
        };
    }
  };

  const getAccountCodeId = (
    accounts: Account[],
  ): { code: string; id: number } => {
    const accountId = storageMapByAddress(selectedResourceAccount);
    const accountState = accounts[accountId || 0]?.state;
    const parsedAccountState = JSON.stringify(accountState);
    // empty account storage = '"{}"' which is a string length 4
    // need to figure out a better way to determine empty storage
    const state =
      parsedAccountState.length < 5 ? '(Empty)' : parsedAccountState;
    const contracts = JSON.stringify(accounts[accountId]?.deployedContracts);

    return {
      code: `Deployed Contracts: \n${contracts} \nAccount Storage: \n${state}`,
      id: accountId,
    };
  };

  // "getActiveCode" is used to read Cadence code from active(selected) item
  const getActiveCode: () => [string, number] = () => {
    const {
      contractTemplates,
      scriptTemplates,
      transactionTemplates,
      accounts,
    } = project;

    const { type, index } = active;
    let code: string, id: number;

    switch (type) {
      case EntityType.AccountStorage:
        code = getAccountCodeId(accounts).code;
        id = getAccountCodeId(accounts).id;
        break;
      case EntityType.ContractTemplate:
        code = contractTemplates[index].script;
        id = contractTemplates[index].id;
        break;
      case EntityType.TransactionTemplate:
        code = transactionTemplates[index].script;
        id = transactionTemplates[index].id;
        break;
      case EntityType.ScriptTemplate:
        code = scriptTemplates[index].script;
        id = scriptTemplates[index].id;
        break;
    }
    return [code || '', id || 8];
  };

  const activeEditor = getActiveEditor();

  const location = useLocation();
  if (isLoading) return null;
  if (!isLoading && !project) {
    navigate('/');
    return null;
  }

  const params = getParams(location.search || '');
  const { id, type, storage: storageAddress } = params;

  let templateIndex = 0;
  switch (type) {
    case 'tx': {
      if (id && id !== '') {
        const foundIndex = project.transactionTemplates.findIndex(
          (template) => template.id === id,
        );
        if (foundIndex > 0) {
          templateIndex = foundIndex;
        }
      }

      const sameType = active.type == EntityType.TransactionTemplate;
      const sameIndex = active.index == templateIndex;

      if (!sameIndex || !sameType || initialLoad) {
        setInitialLoad(false);
        setActive({
          type: EntityType.TransactionTemplate,
          index: templateIndex,
        });
        const templateId = project.transactionTemplates[templateIndex].id;
        return (
          <Redirect noThrow to={`/${project.id}?type=tx&id=${templateId}`} />
        );
      }
      break;
    }
    case 'script': {
      if (id && id !== '') {
        const foundIndex = project.scriptTemplates.findIndex(
          (template) => template.id === id,
        );
        if (foundIndex > 0) {
          templateIndex = foundIndex;
        }
      }
      const sameType = active.type == EntityType.ScriptTemplate;
      const sameIndex = active.index == templateIndex;

      if (!sameIndex || !sameType || initialLoad) {
        setInitialLoad(false);
        setActive({
          type: EntityType.ScriptTemplate,
          index: templateIndex,
        });
        const templateId = project.scriptTemplates[templateIndex].id;
        return (
          <Redirect
            noThrow
            to={`/${project.id}?type=script&id=${templateId}`}
          />
        );
      }
      break;
    }
    case 'readme': {
      const sameType = active.type == EntityType.Readme;
      const sameIndex = active.index == templateIndex;

      if (!sameIndex || !sameType || initialLoad) {
        setInitialLoad(false);
        setActive({
          type: EntityType.Readme,
          index: 0,
        });
        return <Redirect noThrow to={`/${project.id}`} />;
      }

      break;
    }
    case 'account': {
      const storageIndex = storageMapByAddress(storageAddress);
      const sameType = active.type == EntityType.AccountStorage;
      const sameIndex = active.index == storageIndex;
      if (!sameType || !sameIndex || initialLoad) {
        setInitialLoad(false);
        setActive({
          type: EntityType.AccountStorage,
          index: storageIndex,
        });
        const rawAddress = project.accounts[templateIndex].address;

        return (
          <Redirect
            noThrow
            to={`/${project.id}?type=account&address=${rawAddress}&storage=${storageAddress}`}
          />
        );
      }

      break;
    }
    default: {
      if (id && id !== '') {
        const foundIndex = project.contractTemplates.findIndex(
          (template) => template.id === id,
        );
        if (foundIndex > 0) {
          templateIndex = foundIndex;
        }
      }
      const sameType = active.type == EntityType.ContractTemplate;
      const sameIndex = active.index == templateIndex;

      if (!sameIndex || !sameType || initialLoad) {
        setInitialLoad(false);
        setActive({
          type: EntityType.ContractTemplate,
          index: templateIndex,
        });
        const templateId = project.contractTemplates[templateIndex].id;
        return (
          <Redirect
            noThrow
            to={`/${project.id}?type=contract&id=${templateId}`}
          />
        );
      }
    }
  }

  return (
    <ProjectContext.Provider
      value={{
        project,
        isLoading,
        mutator,
        isSaving,
        isExecutingAction,
        createBlankProject,
        updateProject,
        saveProject,
        deleteProject,
        createContractDeployment,
        updateContractTemplate,
        updateScriptTemplate,
        updateTransactionTemplate,
        updateActiveScriptTemplate,
        updateActiveContractTemplate,
        updateActiveTransactionTemplate,
        deleteScriptTemplate,
        deleteTransactionTemplate,
        deleteContractTemplate,
        createTransactionExecution,
        createScriptExecution,
        updateSelectedContractAccount,
        updateSelectedTransactionAccounts,
        active: activeEditor,
        setActive: (type: EntityType, index: number) => {
          setActive({ type, index });
        },
        getActiveCode,
        selectedResourceAccount,
        setSelectedResourceAccount: (account: string) => {
          setSelectedResourceAccount(account);
        },
        lastSigners,
        setLastSigners: (signers: string[]) => {
          setLastSigners(signers);
        },
        transactionAccounts,
        showProjectsSidebar,
        toggleProjectsSidebar,
        showBottomPanel,
        toggleBottomPanel,
        setShowBottomPanel,
        applicationErrorMessage,
        setApplicationErrorMessage,
        clearApplicationErrors,
        setCurrentEditor,
        currentEditor,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
