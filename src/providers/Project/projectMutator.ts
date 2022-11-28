import ApolloClient from 'apollo-client';

import {
  Account,
  ContractTemplate,
  GetProjectQuery,
  Project,
} from 'api/apollo/generated/graphql';
import {
  CREATE_CONTRACT_DEPLOYMENT,
  CREATE_CONTRACT_TEMPLATE,
  CREATE_PROJECT,
  CREATE_SCRIPT_EXECUTION,
  CREATE_SCRIPT_TEMPLATE,
  CREATE_TRANSACTION_EXECUTION,
  CREATE_TRANSACTION_TEMPLATE,
  DELETE_CONTRACT_TEMPLATE,
  DELETE_PROJECT,
  DELETE_SCRIPT_TEMPLATE,
  DELETE_TRANSACTION_TEMPLATE,
  SAVE_PROJECT,
  SET_ACTIVE_PROJECT,
  UPDATE_CONTRACT_TEMPLATE,
  UPDATE_SCRIPT_TEMPLATE,
  UPDATE_TRANSACTION_TEMPLATE,
} from 'api/apollo/mutations';
import { GET_LOCAL_PROJECT, GET_PROJECT } from 'api/apollo/queries';

import Mixpanel from 'util/mixpanel';
import {
  registerOnCloseSaveMessage,
  unregisterOnCloseSaveMessage,
} from 'util/onclose';
import { createDefaultProject, DEFAULT_ACCOUNT_STATE } from './projectDefault';

// TODO: Switch to directives for serialization keys after upgrading to the newest Apollo/apollo-link-serialize
export const PROJECT_SERIALIZATION_KEY = 'PROJECT_SERIALIZATION_KEY';

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

  async createProject(blank = false): Promise<Project> {
    const newProject = blank
      ? createDefaultProject()
      : this.client.readQuery({
          query: GET_LOCAL_PROJECT,
        }).project;

    const parentId = newProject.parentId;
    const seed = newProject.seed;
    const title = newProject.title;
    const description = newProject.description;
    const readme = newProject.readme;
    const transactionTemplates = newProject.transactionTemplates.map(
      (tpl: any) => ({ script: tpl.script, title: tpl.title }),
    );
    const scriptTemplates = newProject.scriptTemplates.map((tpl: any) => ({
      script: tpl.script,
      title: tpl.title,
    }));
    const contractTemplates = newProject.contractTemplates.map((tpl: any) => ({
      script: tpl.script,
      title: tpl.title,
    }));

    const { data } = await this.client.mutate({
      mutation: CREATE_PROJECT,
      variables: {
        parentId: parentId,
        title: title,
        description: description,
        readme: readme,
        seed: seed,
        numberOfAccounts: newProject.accounts.length,
        transactionTemplates,
        scriptTemplates,
        contractTemplates,
      },
      context: {
        serializationKey: PROJECT_SERIALIZATION_KEY,
      },
    });

    const project = data.project;

    this.projectId = project.id;
    this.isLocal = false;
    // TODO: this writeQuery is required to avoid having the active GET_PROJECT hook refetch unnecessarily. Investigate further after switching to Apollo 3
    this.client.writeQuery({
      query: GET_PROJECT,
      variables: {
        projectId: project.id,
      },
      data,
    });

    await this.client.mutate({
      mutation: SET_ACTIVE_PROJECT,
      variables: {
        id: project.id,
      },
    });

    Mixpanel.people.set({
      projectId: project.id,
    });
    Mixpanel.track('Project created', { projectId: project.id, project });
    return project;
  }

  async saveProject(title: string, description: string, readme: string) {
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
        serializationKey: PROJECT_SERIALIZATION_KEY,
      },
    });

    Mixpanel.track('Project saved', { projectId: this.projectId });
  }

  clearProjectAccountsOnReDeploy(accountAddress: string) {
    const project = this.getProject();

    const newProject = {
      ...project,
      accounts: project.accounts.map((cachedAccount: Account) => {
        if (cachedAccount.address === accountAddress) return cachedAccount;
        return {
          ...cachedAccount,
          deployedContracts: [],
          state: DEFAULT_ACCOUNT_STATE,
        };
      }),
    };

    this.client.writeQuery({
      query: GET_PROJECT,
      variables: {
        projectId: this.projectId,
      },
      data: {
        project: newProject,
      },
    });
  }

  async deleteProject(projectId: string) {
    const res = await this.client.mutate({
      mutation: DELETE_PROJECT,
      variables: {
        projectId,
      },
      context: {
        serializationKey: PROJECT_SERIALIZATION_KEY,
      },
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
        serializationKey: PROJECT_SERIALIZATION_KEY,
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
      awaitRefetchQueries: true,
      context: {
        serializationKey: PROJECT_SERIALIZATION_KEY,
      },
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
      context: {
        serializationKey: PROJECT_SERIALIZATION_KEY,
      },
    });

    const project = this.getProject();
    this.client.writeQuery({
      query: GET_PROJECT,
      variables: {
        projectId: project.id,
      },
      data: {
        project: {
          ...project,
          transactionTemplates: [
            ...project.transactionTemplates,
            res.data.createTransactionTemplate,
          ],
        },
      },
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
        serializationKey: PROJECT_SERIALIZATION_KEY,
      },
      fetchPolicy: 'no-cache',
    });
  }

  async deleteTransactionTemplate(templateId: string) {
    if (this.isLocal) {
      await this.createProject();
    }

    const res = await this.client.mutate({
      mutation: DELETE_TRANSACTION_TEMPLATE,
      variables: {
        projectId: this.projectId,
        templateId,
      },
      context: {
        serializationKey: PROJECT_SERIALIZATION_KEY,
      },
    });

    const project = this.getProject();

    this.client.writeQuery({
      query: GET_PROJECT,
      variables: {
        projectId: project.id,
      },
      data: {
        project: {
          ...project,
          transactionTemplates: project.transactionTemplates.filter(
            (template) => template.id !== templateId,
          ),
        },
        persist: true,
      },
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
      context: {
        serializationKey: PROJECT_SERIALIZATION_KEY,
      },
    });

    const project = this.getProject();

    this.client.writeQuery({
      query: GET_PROJECT,
      variables: {
        projectId: project.id,
      },
      data: {
        project: {
          ...project,
          scriptTemplates: project.scriptTemplates.filter(
            (template) => template.id !== templateId,
          ),
        },
        persist: true,
      },
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
      context: {
        serializationKey: PROJECT_SERIALIZATION_KEY,
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
      context: {
        serializationKey: PROJECT_SERIALIZATION_KEY,
      },
    });

    const project = this.getProject();

    this.client.writeQuery({
      query: GET_PROJECT,
      variables: {
        projectId: project.id,
      },
      data: {
        project: {
          ...project,
          scriptTemplates: [
            ...project.scriptTemplates,
            res.data.createScriptTemplate,
          ],
        },
        persist: true
      },
    });

    Mixpanel.track('Script template created', {
      projectId: this.projectId,
      script,
    });

    return res;
  }

  getProject() {
    const { project } = this.client.readQuery<GetProjectQuery>({
      query: GET_PROJECT,
      variables: {
        projectId: this.projectId,
      },
    });
    return project;
  }

  async createContractTemplate(script: string, title: string) {
    if (this.isLocal) {
      await this.createProject();
    }

    const res = await this.client.mutate({
      mutation: CREATE_CONTRACT_TEMPLATE,
      variables: {
        projectId: this.projectId,
        script,
        title,
      },
      context: {
        serializationKey: PROJECT_SERIALIZATION_KEY,
      },
    });

    const project = this.getProject();
    this.client.writeQuery({
      query: GET_PROJECT,
      variables: {
        projectId: project.id,
      },
      data: {
        project: {
          ...project,
          contractTemplates: [
            ...project.contractTemplates,
            res.data.createContractTemplate,
          ],
        },
      },
    });

    Mixpanel.track('Contract template created', {
      projectId: this.projectId,
      script,
    });

    return res;
  }

  async updateContractTemplate(
    contractTemplate: ContractTemplate,
    script: string,
    title: string,
    index: number,
  ) {
    this.client.writeData({
      id: `ContractTemplate:${contractTemplate.id}`,
      data: {
        __typename: 'ContractTemplate',
        title,
        script,
      },
    });

    if (this.isLocal) {
      registerOnCloseSaveMessage();
      return;
    }

    const key = [
      'UPDATE_CONTRACT_TEMPLATE',
      this.projectId,
      contractTemplate.id,
    ];

    await this.client.mutate({
      mutation: UPDATE_CONTRACT_TEMPLATE,
      variables: {
        templateId: contractTemplate.id,
        title: title,
        script: script,
        index,
        projectId: this.projectId,
      },
      context: {
        debounceKey: key,
        serializationKey: PROJECT_SERIALIZATION_KEY,
      },
      fetchPolicy: 'no-cache',
    });
  }

  async createContractDeployment(
    contractTemplate: ContractTemplate,
    account: Account,
    index: number,
  ) {
    const hasDeployedCode = !!account.deployedContracts?.length;

    if (this.isLocal) {
      const project = await this.createProject();
      contractTemplate = project.contractTemplates[index];
      unregisterOnCloseSaveMessage();
    }

    const res = await this.client.mutate({
      mutation: CREATE_CONTRACT_DEPLOYMENT,
      variables: {
        projectId: this.projectId,
        script: contractTemplate.script,
        signer: account.address,
      },
      context: {
        serializationKey: PROJECT_SERIALIZATION_KEY,
      },
    });

    // TODO: update accounts based on latest api changes
    if (hasDeployedCode) this.clearProjectAccountsOnReDeploy(account.address);

    Mixpanel.track('Contract deployed', {
      projectId: this.projectId,
      accountAddress: account.address,
      code: contractTemplate.script,
    });

    return res;
  }

  async deleteContractTemplate(templateId: string) {
    if (this.isLocal) {
      await this.createProject();
    }

    const res = await this.client.mutate({
      mutation: DELETE_CONTRACT_TEMPLATE,
      variables: {
        projectId: this.projectId,
        templateId,
      },
      context: {
        serializationKey: PROJECT_SERIALIZATION_KEY,
      },
    });

    const project = this.getProject();

    this.client.writeQuery({
      query: GET_PROJECT,
      variables: {
        projectId: project.id,
      },
      data: {
        project: {
          ...project,
          contractTemplates: project.contractTemplates.filter(
            (template) => template.id !== templateId,
          ),
        },
        persist: true,
      },
    });

    return res;
  }
}
