import { navigate } from '@reach/router';

import ApolloClient from 'apollo-client';

import { Account, Project } from 'api/apollo/generated/graphql';
import {
  CREATE_PROJECT,
  CREATE_SCRIPT_EXECUTION,
  CREATE_SCRIPT_TEMPLATE,
  CREATE_TRANSACTION_EXECUTION,
  CREATE_TRANSACTION_TEMPLATE,
  DELETE_SCRIPT_TEMPLATE,
  DELETE_TRANSACTION_TEMPLATE,
  SAVE_PROJECT,
  SET_ACTIVE_PROJECT,
  UPDATE_ACCOUNT_DEPLOYED_CODE,
  UPDATE_ACCOUNT_DRAFT_CODE,
  UPDATE_SCRIPT_TEMPLATE,
  UPDATE_TRANSACTION_TEMPLATE,
} from 'api/apollo/mutations';
import { GET_LOCAL_PROJECT, GET_PROJECT } from 'api/apollo/queries';

import Mixpanel from 'util/mixpanel';
import {
  registerOnCloseSaveMessage,
  unregisterOnCloseSaveMessage,
} from 'util/onclose';

export default class ProjectMutator {
  client: ApolloClient<object>;
  projectId: string | null = null;
  title: string;
  description: string;
  readme: string;
  isLocal: boolean;
  track: any;

  constructor(
    client: ApolloClient<object>,
    projectId: string | null,
    isLocal: boolean,
    title: string,
    description: string,
    readme: string,
  ) {
    this.client = client;
    this.projectId = projectId;
    this.isLocal = isLocal;
    this.title = title;
    this.description = description;
    this.readme = readme;
  }

  async createProject(): Promise<Project> {
    const { project: localProject } = this.client.readQuery({
      query: GET_LOCAL_PROJECT,
    });

    const parentId = localProject.parentId;
    const accounts = localProject.accounts.map((acc: Account) => acc.draftCode);
    const seed = localProject.seed;
    const title = localProject.title;
    const description = localProject.description;
    const readme = localProject.readme;
    const transactionTemplates = localProject.transactionTemplates.map(
      (tpl: any) => ({ script: tpl.script, title: tpl.title }),
    );
    const scriptTemplates = localProject.scriptTemplates.map((tpl: any) => ({
      script: tpl.script,
      title: tpl.title,
    }));

    const { data } = await this.client.mutate({
      mutation: CREATE_PROJECT,
      variables: {
        parentId: parentId,
        accounts: accounts,
        seed: seed,
        title: title,
        description: description,
        readme: readme,
        transactionTemplates: transactionTemplates,
        scriptTemplates: scriptTemplates,
      },
    });

    const project = data.project;

    this.projectId = project.id;
    this.isLocal = false;

    await this.client.mutate({
      mutation: SET_ACTIVE_PROJECT,
      variables: {
        id: this.projectId,
      },
    });
    Mixpanel.people.set({
      projectId: project.id,
    });
    Mixpanel.track('Project created', { projectId: project.id, project });
    return project;
  }

  async saveProject(
    isFork: boolean,
    title: string,
    description: string,
    readme: string,
  ) {
    if (this.isLocal) {
      await this.createProject();
      unregisterOnCloseSaveMessage();
    }

    const key = ['SAVE_PROJECT', this.projectId];

    this.client.writeData({
      id: `Project:${this.projectId}`,
      data: {
        title,
        description,
        readme,
        persist: true,
      },
    });

    await this.client.mutate({
      mutation: SAVE_PROJECT,
      variables: {
        projectId: this.projectId,
        title,
        description,
        readme,
      },
      context: {
        debounceKey: key,
        serializationKey: key,
      },
    });

    if (isFork) {
      Mixpanel.track('Project forked', { projectId: this.projectId });
    } else {
      Mixpanel.track('Project saved', { projectId: this.projectId });
    }

    navigate(`/${this.projectId}`, { replace: true });
  }

  async updateAccountDraftCode(account: Account, code: string) {
    this.client.writeData({
      id: `Account:${account.id}`,
      data: {
        __typename: 'Account',
        draftCode: code,
      },
    });

    if (this.isLocal) {
      registerOnCloseSaveMessage();
      return;
    }

    const key = ['UPDATE_ACCOUNT_DRAFT_CODE', this.projectId, account.id];

    await this.client.mutate({
      mutation: UPDATE_ACCOUNT_DRAFT_CODE,
      variables: {
        projectId: this.projectId,
        accountId: account.id,
        code,
      },
      context: {
        debounceKey: key,
        serializationKey: key,
      },
      fetchPolicy: 'no-cache',
    });
  }

  async updateAccountDeployedCode(account: Account, index: number) {
    if (this.isLocal) {
      const project = await this.createProject();
      account = project.accounts[index];
      unregisterOnCloseSaveMessage();
    }

    const res = await this.client.mutate({
      mutation: UPDATE_ACCOUNT_DEPLOYED_CODE,
      variables: {
        projectId: this.projectId,
        accountId: account.id,
        code: account.draftCode,
      },
      // Redeploying code affects all accounts and requires a project refetch
      refetchQueries: [
        { query: GET_PROJECT, variables: { projectId: this.projectId } },
      ],
      awaitRefetchQueries: true,
    });

    Mixpanel.track('Contract deployed', {
      projectId: this.projectId,
      accountId: account.id,
      code: account.draftCode,
    });
    return res;
  }

  async updateTransactionTemplate(
    templateId: string,
    script: string,
    title: string,
  ) {
    this.client.writeData({
      id: `TransactionTemplate:${templateId}`,
      data: {
        script,
        title,
      },
    });

    if (this.isLocal) {
      registerOnCloseSaveMessage();
      return;
    }

    const key = ['UPDATE_TRANSACTION_TEMPLATE', this.projectId, templateId];

    await this.client.mutate({
      mutation: UPDATE_TRANSACTION_TEMPLATE,
      variables: {
        projectId: this.projectId,
        templateId: templateId,
        script,
        title,
      },
      context: {
        debounceKey: key,
        serializationKey: key,
      },
      fetchPolicy: 'no-cache',
    });
  }

  async createTransactionExecution(
    script: string,
    signers: Account[],
    args: string[],
  ) {
    if (this.isLocal) {
      await this.createProject();
    }

    const signerAddresses: string[] = signers.map(
      (account: Account) => account.address,
    );

    const res = await this.client.mutate({
      mutation: CREATE_TRANSACTION_EXECUTION,
      variables: {
        projectId: this.projectId,
        signers: signerAddresses,
        arguments: args,
        script,
      },
      refetchQueries: [
        { query: GET_PROJECT, variables: { projectId: this.projectId } },
      ],
    });
    Mixpanel.track('Transaction template executed', {
      projectId: this.projectId,
      script,
    });

    return res;
  }

  async createTransactionTemplate(script: string, title: string) {
    if (this.isLocal) {
      await this.createProject();
    }

    const res = await this.client.mutate({
      mutation: CREATE_TRANSACTION_TEMPLATE,
      variables: {
        projectId: this.projectId,
        script,
        title,
      },
      refetchQueries: [
        { query: GET_PROJECT, variables: { projectId: this.projectId } },
      ],
      awaitRefetchQueries: true,
    });

    Mixpanel.track('Transaction template created', {
      projectId: this.projectId,
      script,
    });

    return res;
  }

  async updateScriptTemplate(
    templateId: string,
    script: string,
    title: string,
  ) {
    this.client.writeData({
      id: `ScriptTemplate:${templateId}`,
      data: {
        script: script,
        title: title,
      },
    });

    if (this.isLocal) {
      registerOnCloseSaveMessage();
      return;
    }

    const key = ['UPDATE_SCRIPT_TEMPLATE', this.projectId, templateId];

    await this.client.mutate({
      mutation: UPDATE_SCRIPT_TEMPLATE,
      variables: {
        projectId: this.projectId,
        templateId: templateId,
        script: script,
        title: title,
      },
      context: {
        debounceKey: key,
        serializationKey: key,
      },
      fetchPolicy: 'no-cache',
    });
  }

  async deleteTransactionTemplate(templateId: string) {
    if (this.isLocal) {
      this.createProject();
    }

    const res = await this.client.mutate({
      mutation: DELETE_TRANSACTION_TEMPLATE,
      variables: {
        projectId: this.projectId,
        templateId,
      },
      refetchQueries: [
        { query: GET_PROJECT, variables: { projectId: this.projectId } },
      ],
    });

    return res;
  }

  async deleteScriptTemplate(templateId: string) {
    if (this.isLocal) {
      await this.createProject();
    }

    const res = await this.client.mutate({
      mutation: DELETE_SCRIPT_TEMPLATE,
      variables: {
        projectId: this.projectId,
        templateId,
      },
      refetchQueries: [
        { query: GET_PROJECT, variables: { projectId: this.projectId } },
      ],
    });

    return res;
  }

  async createScriptExecution(script: string, args: string[]) {
    if (this.isLocal) {
      await this.createProject();
    }

    const res = await this.client.mutate({
      mutation: CREATE_SCRIPT_EXECUTION,
      variables: {
        projectId: this.projectId,
        script,
        arguments: args,
      },
    });
    Mixpanel.track('Script template executed', {
      projectId: this.projectId,
      script,
    });
    return res;
  }

  async createScriptTemplate(script: string, title: string) {
    if (!this.projectId) {
      await this.createProject();
    }

    const res = await this.client.mutate({
      mutation: CREATE_SCRIPT_TEMPLATE,
      variables: {
        projectId: this.projectId,
        script,
        title,
      },
      refetchQueries: [
        { query: GET_PROJECT, variables: { projectId: this.projectId } },
      ],
      awaitRefetchQueries: true,
    });

    Mixpanel.track('Script template created', {
      projectId: this.projectId,
      script,
    });

    return res;
  }
}
