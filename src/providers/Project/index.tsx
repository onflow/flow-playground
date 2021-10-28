import React, { createContext, useState } from 'react';
import { useApolloClient, useQuery } from '@apollo/react-hooks';
import { navigate } from '@reach/router';
import ProjectMutator from './projectMutator';
import useGetProject from './projectHooks';

import { GET_ACTIVE_PROJECT } from 'api/apollo/queries';
import { Project, Account } from 'api/apollo/generated/graphql';

export enum EntityType {
  Account = 1,
  TransactionTemplate,
  ScriptTemplate,
}

export type ActiveEditor = {
  type: EntityType;
  index: number;
  onChange: (code: string, title: string) => void;
};

export interface ProjectContextValue {
  project: Project | null;
  isLoading: boolean;
  mutator: ProjectMutator;
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
  active: any;
  setActive: any;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({
  children,
  urlProjectId,
  active,
  setActive
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

  const [transactionAccounts, setTransactionAccounts] = useState<number[]>([0]);
  const [isSavingCode, setIsSaving] = useState(false);

  const projectID = project ? project.id : null;

  const mutator = new ProjectMutator(client, projectID, isLocal);

  let timeout: any;

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
    // console.log("GET ACTIVE EDITOR ACTIVE:", active);
    
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
    }
  };

  const activeEditor = getActiveEditor();

  if (isLoading) return null;
  if (!isLoading && !project) {
    navigate('/');
    return null;
  }

  return (
    <ProjectContext.Provider
      value={{
        project,
        isLoading,
        mutator,
        isSavingCode,
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
