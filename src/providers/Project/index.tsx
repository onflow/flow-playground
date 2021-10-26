import React, { createContext, useState } from 'react';
import { useApolloClient, useQuery } from '@apollo/react-hooks';
import { navigate, Redirect, useLocation } from '@reach/router';
import ProjectMutator from './projectMutator';
import useGetProject from './projectHooks';

import { GET_ACTIVE_PROJECT } from 'api/apollo/queries';
import { Project, Account } from 'api/apollo/generated/graphql';
import { getParams, scriptTypes } from '../../util/url';

export enum EntityType {
  Account = 1,
  TransactionTemplate,
  ScriptTemplate,
  Readme,
}

export type ActiveEditor = {
  type: EntityType;
  index: number;
  onChange: (code: string, title: string, description: string, readme: string) => void;
};

export interface ProjectContextValue {
  project: Project | null;
  isLoading: boolean;
  mutator: ProjectMutator;
  updateProject: (
    title: string,
    description: string,
    readme: string
  ) => Promise<any>;
  updateAccountDeployedCode: () => Promise<any>;
  updateAccountDraftCode: (value: string) => Promise<any>;
  updateSelectedContractAccount: (accountIndex: number) => void;
  updateSelectedTransactionAccounts: (accountIndexes: number[]) => void;
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
  deleteScriptTemplate: (templateId: string) => void;
  deleteTransactionTemplate: (templateId: string) => void;
  createTransactionExecution: (
    signingAccounts: Account[],
    args?: string[],
  ) => Promise<any>;
  createScriptExecution: (args?: string[]) => Promise<any>;
  active: ActiveEditor;

  setActive: (type: EntityType, index: number) => void;
  transactionAccounts: number[];
  isSavingCode: boolean;
}

export const ProjectContext: React.Context<ProjectContextValue> = createContext(
  null,
);

interface ProjectProviderProps {
  children: any;
  urlProjectId: string | null;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({
  children,
  urlProjectId,
}) => {
  const client = useApolloClient();

  const {
    data: { activeProject, activeProjectId },
  } = useQuery(GET_ACTIVE_PROJECT);

  const projectId = activeProjectId || urlProjectId;

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
    navigate('/404');
  }

  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [transactionAccounts, setTransactionAccounts] = useState<number[]>([0]);
  const [isSavingCode, setIsSaving] = useState(false);

  const [active, setActive] = useState<{ type: EntityType; index: number }>({
    type: EntityType.Account,
    index: 0,
  });

  const projectID = project ? project.id : null;
  const title = project ? project.title : null;
  const description = project ? project.description : null;
  const readme = project ? project.readme : null;

  const mutator = new ProjectMutator(client, projectID, isLocal, title, description, readme);

  let timeout: any;

  const updateProject: any = async (
    title: string,
    description: string,
    readme: string,
  ) => {
    clearTimeout(timeout);
    setIsSaving(true);
    const res = await mutator.saveProject(
      project.transactionTemplates[active.index].id,
      title,
      description,
      readme,
    );
    timeout = setTimeout(() => {
      setIsSaving(false);
    }, 1000);
    return res;
  };

  const updateAccountDeployedCode: any = async () => {
    clearTimeout(timeout);
    const res = await mutator.updateAccountDeployedCode(
      project.accounts[active.index],
      active.index,
    );
    setIsSaving(true);
    timeout = setTimeout(() => {
      setIsSaving(false);
    }, 1000);
    return res;
  };

  const updateAccountDraftCode = async (value: string) => {
    clearTimeout(timeout);
    setIsSaving(true);
    const res = await mutator.updateAccountDraftCode(
      project.accounts[active.index],
      value,
    );
    timeout = setTimeout(() => {
      setIsSaving(false);
    }, 1000);
    return res;
  };

  const updateScriptTemplate = async (
    templateId: string,
    script: string,
    title: string,
  ) => {
    clearTimeout(timeout);
    setIsSaving(true);
    const res = await mutator.updateScriptTemplate(templateId, script, title);
    timeout = setTimeout(() => {
      setIsSaving(false);
    }, 1000);
    return res;
  };

  const updateTransactionTemplate = async (
    templateId: string,
    script: string,
    title: string,
  ) => {
    clearTimeout(timeout);
    setIsSaving(true);
    const res = await mutator.updateTransactionTemplate(
      templateId,
      script,
      title,
    );
    timeout = setTimeout(() => {
      setIsSaving(false);
    }, 1000);
    return res;
  };

  const updateActiveScriptTemplate = async (script: string, title: string) => {
    clearTimeout(timeout);
    setIsSaving(true);
    const res = await mutator.updateScriptTemplate(
      project.scriptTemplates[active.index].id,
      script,
      title,
    );
    timeout = setTimeout(() => {
      setIsSaving(false);
    }, 1000);
    return res;
  };

  const updateActiveTransactionTemplate = async (
    script: string,
    title: string,
  ) => {
    clearTimeout(timeout);
    setIsSaving(true);
    const res = await mutator.updateTransactionTemplate(
      project.transactionTemplates[active.index].id,
      script,
      title,
    );
    timeout = setTimeout(() => {
      setIsSaving(false);
    }, 1000);
    return res;
  };

  const createTransactionExecution = async (
    signingAccounts: Account[],
    args?: [string],
  ) => {
    clearTimeout(timeout);
    setIsSaving(true);
    const res = await mutator.createTransactionExecution(
      project.transactionTemplates[active.index].script,
      signingAccounts,
      args,
    );
    timeout = setTimeout(() => {
      setIsSaving(false);
    }, 1000);
    return res;
  };

  const createScriptExecution = async (args?: string[]) => {
    clearTimeout(timeout);
    setIsSaving(true);
    const res = await mutator.createScriptExecution(
      project.scriptTemplates[active.index].script,
      args,
    );
    timeout = setTimeout(() => {
      setIsSaving(false);
    }, 1000);
    return res;
  };

  const deleteScriptTemplate = async (templateId: string) => {
    clearTimeout(timeout);
    setIsSaving(true);
    const res = await mutator.deleteScriptTemplate(templateId);
    timeout = setTimeout(() => {
      setIsSaving(false);
    }, 1000);
    return res;
  };

  const deleteTransactionTemplate = async (templateId: string) => {
    clearTimeout(timeout);
    setIsSaving(true);
    const res = await mutator.deleteTransactionTemplate(templateId);
    timeout = setTimeout(() => {
      setIsSaving(false);
    }, 1000);
    return res;
  };

  const updateSelectedContractAccount = (accountIndex: number) => {
    setActive({ type: EntityType.Account, index: accountIndex });
  };

  const updateSelectedTransactionAccounts = (accountIndexes: number[]) => {
    setTransactionAccounts(accountIndexes);
  };

  const getActiveEditor = (): ActiveEditor => {
    switch (active.type) {
      case EntityType.Account:
        return {
          type: active.type,
          index: active.index,
          onChange: (code: string) => updateAccountDraftCode(code),
        };
      case EntityType.TransactionTemplate:
        return {
          type: active.type,
          index: active.index,
          onChange: (code: any, title: string) =>
            updateActiveTransactionTemplate(code, title),
        };
      case EntityType.ScriptTemplate:
        return {
          type: active.type,
          index: active.index,
          onChange: (code: any, title: string) =>
            updateActiveScriptTemplate(code, title),
        };
      case EntityType.Readme:
        return {
          type: active.type,
          index: active.index,
          onChange: ((title: string, description: string, readme:string) => {
              if (project.persist) updateProject(title, description, readme)
          })
        };
    };
  };

  const activeEditor = getActiveEditor();

  const location = useLocation();

  if (isLoading) return null;
  if (!isLoading && !project) {
    navigate('/404');
    return null;
  }

  const params = getParams(location.search || '');
  const { type, id } = params;

  // TODO: check if that project is local
  // TODO: check that active item have the same id

  if (type == '' || type === undefined || !scriptTypes.includes(type)) {
    return (
      <Redirect noThrow
        to={`/${project.id}?type=account&id=${project.accounts[0].id}`}
      />
    );
  }

  if (id == '' || id === undefined) {
    let firstItemId;
    switch (type) {
      case 'tx':
        setActive({
          type: EntityType.TransactionTemplate,
          index: 0,
        });
        firstItemId = project.transactionTemplates[0].id;
        break;
      case 'script':
        setActive({
          type: EntityType.ScriptTemplate,
          index: 0,
        });
        firstItemId = project.scriptTemplates[0].id;
        break;
      case 'account':
      case 'readme':
      default:
        setActive({
          type: EntityType.Account,
          index: 0,
        });
        firstItemId = project.accounts[0].id;
        break;
    }
    return <Redirect noThrow to={`/${project.id}?type=${type}&id=${firstItemId}`} />;
  }

  const activeType = type || 'account';

  let templateIndex = 0;
  switch (activeType) {
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
        return <Redirect noThrow to={`/${project.id}?type=tx&id=${templateId}`} />;
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
        return <Redirect noThrow to={`/${project.id}?type=script&id=${templateId}`} />;
      }
      break;
    }

    case 'account': {
      if (id && id !== '') {
        const foundIndex = project.accounts.findIndex(
          (template) => template.id === id,
        );
        if (foundIndex > 0) {
          templateIndex = foundIndex;
        }
      }
      const sameType = active.type == EntityType.Account;
      const sameIndex = active.index == templateIndex;

      if (!sameIndex || !sameType || initialLoad) {
        setInitialLoad(false);
        setActive({
          type: EntityType.Account,
          index: templateIndex,
        });
        const templateId = project.accounts[templateIndex].id;
        return <Redirect noThrow to={`/${project.id}?type=account&id=${templateId}`} />;
      }
      break;
    }


    case 'readme': {
      if (id && id !== '') {
        const foundIndex = project.accounts.findIndex(
          (template) => template.id === id,
        );
        if (foundIndex > 0) {
          templateIndex = foundIndex;
        };
      };
      const sameType = active.type == EntityType.Readme;
      const sameIndex = active.index == templateIndex;

      if (!sameIndex || !sameType || initialLoad) {
        setInitialLoad(false);
        setActive({
          type: EntityType.Readme,
          index: templateIndex,
        });
        return <Redirect noThrow to={`/${project.id}?type=readme`} />;
      };
      break;
    };
    default:
      return null;
  }

  return (
    <ProjectContext.Provider
      value={{
        project,
        isLoading,
        mutator,
        isSavingCode,
        updateProject,
        updateAccountDeployedCode,
        updateAccountDraftCode,
        updateScriptTemplate,
        updateTransactionTemplate,
        updateActiveScriptTemplate,
        updateActiveTransactionTemplate,
        deleteScriptTemplate,
        deleteTransactionTemplate,
        createTransactionExecution,
        createScriptExecution,
        updateSelectedContractAccount,
        updateSelectedTransactionAccounts,
        active: activeEditor,
        setActive: (type: EntityType, index: number) => {
          setActive({ type, index });
        },
        transactionAccounts,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
