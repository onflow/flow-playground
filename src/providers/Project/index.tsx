import { navigate, Redirect, useLocation } from '@reach/router';
import {
  Account,
  ContractDeployment,
  Project,
} from 'api/apollo/generated/graphql';
import React, { createContext, useEffect, useState } from 'react';
import { ChildProps, Template } from 'src/types';
import { getHashLineNumber, getParams, LOCAL_PROJECT_ID } from 'util/url';
import ProjectMutator from './projectMutator';
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
  copyProject: (project: Project) => Promise<Project>;
  updateProject: (
    title: string,
    description: string,
    readme: string,
  ) => Promise<any>;
  saveProject: () => Promise<any>;
  deleteProject: (projectId: string) => Promise<any>;
  resetProject: (projectId: string) => Promise<any>;
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
  getActiveCode: () => [string, string];
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
  hightlightedLines: number[];
}

export const ProjectContext: React.Context<ProjectContextValue> =
  createContext(null);

interface ProjectProviderProps extends ChildProps {
  project: Project;
  isLocal: boolean;
  client: any;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({
  children,
  project,
  isLocal,
  client,
}) => {
  const projectId = project?.id;
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
  const hightlightedLines: number[] = getHashLineNumber();

  const checkAppErrors = async () => {
    await mutator.getApplicationErrors().then((res) => {
      if (res?.errorMessage) {
        setApplicationErrorMessage(res.errorMessage);
      }
    });
  };

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

  const copyProject = async (project: Project) => {
    setIsSaving(true);
    let res;
    try {
      // create default project and save to cache
      res = mutator.createProjectCopy(project);
      // refresh project list
    } catch (e) {
      checkAppErrors();
    } finally {
      setIsSaving(false);
    }
    return res;
  };

  const createBlankProject = async () => {
    setIsSaving(true);
    let res;
    try {
      // create default project and save to cache
      project = await mutator.createLocalProject();
      navigate(`/${project.id}`, { replace: true });
    } catch (e) {
      setIsSaving(false);
      checkAppErrors();
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
      checkAppErrors();
    } finally {
      setIsSaving(false);
    }

    return res;
  };

  const saveProject: any = async () => {
    setIsSaving(true);
    let res;
    try {
      res = await mutator.saveProject(title, description, readme);
    } catch (e) {
      console.error(e);
      checkAppErrors();
    } finally {
      setIsSaving(false);
    }

    return res;
  };

  const deleteProject = async (dProjectId: string) => {
    setIsSaving(true);
    let res;
    try {
      res = await mutator.deleteProject(dProjectId);
      if (projectId === dProjectId) {
        navigate(`/${LOCAL_PROJECT_ID}`, { replace: true });
      }
    } catch (e) {
      console.error(e);
      checkAppErrors();
    } finally {
      setIsSaving(false);
    }

    return res;
  };

  const resetProject = async (dProjectId: string) => {
    setIsSaving(true);
    let res;
    try {
      // TODO - reset project
      console.log('reset project');
      res = null; //await mutator.deleteProject(dProjectId);
    } catch (e) {
      console.error(e);
      checkAppErrors();
    } finally {
      setIsSaving(false);
    }

    return res;
  };

  const createContractDeployment: any = async (
    fileIndex: number,
    accountId: number,
    args: string[] = [],
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
        args,
      );

      const addr = deployAccount.address;
      const acctNum = addr.charAt(addr.length - 1);
      const acctHex = `0x0${acctNum}`;
      const signer = [acctHex];
      setLastSigners(signer);
    } catch (e) {
      console.error(e);
      setIsExecutingAction(false);
      checkAppErrors();
    } finally {
      setIsSaving(false);
    }

    setIsExecutingAction(false);
    return res;
  };

  const stripComments = (code: string) => {
    const commentsRegExp = /(\/\*[\s\S]*?\*\/)|(\/\/.*)/g;
    return code.replace(commentsRegExp, '');
  };

  const getContractName = (cadenceCode: string): string => {
    if (cadenceCode === '') return null;
    const complexMatcher = /(resource|struct)\s+\w+\s*{[\s\S]+?}/g;
    const noCommentsCode = stripComments(cadenceCode);
    const noComplex = noCommentsCode.replace(complexMatcher, '');
    const pattern =
      /(?:access\(\w+\)|pub)\s+contract\s+(?:interface)*\s*(\w*)[:\s\w]*(\s*{[.\s\S]*init\s*\((.*?)\)[.\s\S]*})?/g;
    // Search for the pattern in the Cadence code
    const match = pattern.exec(noComplex);
    if (!match) {
      console.log('Could not get contract name');
      setApplicationErrorMessage('Could not parse contract name');
    }
    // Return the contract name if found, otherwise return null
    return match ? match[1] : null;
  };

  const updateContractTemplate = async (script: string, title: string) => {
    setIsSaving(true);
    let res;
    try {
      const template = project.contractTemplates[active.index];
      res = await mutator.updateContractTemplate(
        template,
        script,
        title,
        active.index,
      );
      template.script = script;
      template.title = title;
      (template as Template).name = getContractName(script);
    } catch (e) {
      console.error(e);
      checkAppErrors();
    } finally {
      setIsSaving(false);
    }

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
      contractTemplate.script = script;
      (contractTemplate as Template).name = getContractName(script);
    } catch (e) {
      console.error(e);
      checkAppErrors();
    } finally {
      setIsSaving(false);
    }

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
      const template = project.scriptTemplates.find((t) => t.id === templateId);
      template.script = script;
      template.title = title;
    } catch (e) {
      console.error(e);
      checkAppErrors();
    } finally {
      setIsSaving(false);
    }

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
      const template = project.transactionTemplates.find(
        (t) => t.id === templateId,
      );
      template.script = script;
      template.title = title;
    } catch (e) {
      console.error(e);
      checkAppErrors();
    } finally {
      setIsSaving(false);
    }

    return res;
  };

  const updateActiveScriptTemplate = async (script: string) => {
    setIsSaving(true);
    let res;
    const template = project.scriptTemplates[active.index];
    template.script = script;
    try {
      res = await mutator.updateScriptTemplate(
        project.scriptTemplates[active.index].id,
        script,
        project.scriptTemplates[active.index].title,
      );
    } catch (e) {
      console.error(e);
      checkAppErrors();
    } finally {
      setIsSaving(false);
    }

    return res;
  };

  const updateActiveTransactionTemplate = async (script: string) => {
    setIsSaving(true);
    let res;
    const template = project.transactionTemplates[active.index];
    template.script = script;
    try {
      res = await mutator.updateTransactionTemplate(
        project.transactionTemplates[active.index].id,
        script,
        project.transactionTemplates[active.index].title,
      );
    } catch (e) {
      console.error(e);
      checkAppErrors();
    } finally {
      setIsSaving(false);
    }

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
      checkAppErrors();
    } finally {
      setIsSaving(false);
      setIsExecutingAction(false);
    }

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
      checkAppErrors();
    } finally {
      setIsSaving(false);
      setIsExecutingAction(false);
    }
    return res;
  };

  const deleteContractTemplate = async (templateId: string) => {
    setIsSaving(true);
    let res;
    try {
      project.contractTemplates = project.contractTemplates.filter(
        (t) => t.id !== templateId,
      );
      res = await mutator.deleteContractTemplate(templateId);
    } catch (e) {
      console.error(e);
      checkAppErrors();
    } finally {
      setIsSaving(false);
    }
    return res;
  };

  const deleteScriptTemplate = async (templateId: string) => {
    setIsSaving(true);
    let res;
    try {
      project.scriptTemplates = project.scriptTemplates.filter(
        (t) => t.id !== templateId,
      );
      res = await mutator.deleteScriptTemplate(templateId);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }

    return res;
  };

  const deleteTransactionTemplate = async (templateId: string) => {
    setIsSaving(true);
    let res;
    try {
      project.contractTemplates = project.contractTemplates.filter(
        (t) => t.id !== templateId,
      );
      res = await mutator.deleteTransactionTemplate(templateId);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }

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
    contractDeployments: ContractDeployment[],
  ): { code: string; id: number } => {
    const accountId = storageMapByAddress(selectedResourceAccount);
    const accountState = accounts[accountId || 0]?.state;
    const parsedAccountState = JSON.stringify(accountState, null, 4);
    // empty account storage = '"{}"' which is a string length 4
    // need to figure out a better way to determine empty storage
    const formattedAcctState = JSON.stringify(
      JSON.parse(accountState),
      null,
      4,
    );
    const state =
      parsedAccountState.length < 5 ? '(Empty)' : formattedAcctState;
    const address = accounts[accountId].address;

    //const contracts = JSON.stringify(accounts[accountId]?.deployedContracts);
    console.log(accounts[accountId]?.deployedContracts);
    console.log(address, contractDeployments);
    const contracts = JSON.stringify(
      (contractDeployments || [])
        .filter((c) => String(c.address) === String(address))
        .map((c) => ({
          contract: c.title,
          height: c.blockHeight,
        })),
      null,
      2,
    );

    return {
      code: `Deployed Contracts: \n${contracts} \nAccount Storage: \n${state}`,
      id: accountId,
    };
  };

  // "getActiveCode" is used to read Cadence code from active(selected) item
  const getActiveCode: () => [string, string] = () => {
    const {
      contractTemplates,
      scriptTemplates,
      transactionTemplates,
      contractDeployments,
      accounts,
    } = project;

    const { type, index } = active;
    let code: string, id: string;

    switch (type) {
      case EntityType.AccountStorage:
        code = getAccountCodeId(accounts, contractDeployments).code;
        id = String(getAccountCodeId(accounts, contractDeployments).id);
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
    return [code || '', id || 'unknown'];
  };

  // End of instantiation and return created context
  const activeEditor = getActiveEditor();

  const location = useLocation();
  if (!project) {
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
        const template = project.contractTemplates[templateIndex];
        const templateId = template.id;
        (template as Template).name = getContractName(template.script);
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
        isLoading: false,
        mutator,
        isSaving,
        isExecutingAction,
        createBlankProject,
        copyProject,
        updateProject,
        saveProject,
        deleteProject,
        resetProject,
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
        hightlightedLines,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
