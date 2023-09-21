import ApolloClient from 'apollo-client';
import { navigate } from '@reach/router';

import {
  Account,
  ContractTemplate,
  GetProjectQuery,
  Project,
} from 'api/apollo/generated/graphql';
import {
  CLEAR_EXECUTION_RESULTS,
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
  RESET_PROJECT,
  SAVE_PROJECT,
  SET_ACTIVE_PROJECT,
  UPDATE_CONTRACT_TEMPLATE,
  UPDATE_SCRIPT_TEMPLATE,
  UPDATE_TRANSACTION_TEMPLATE,
} from 'api/apollo/mutations';
import {
  GET_APPLICATION_ERRORS,
  GET_LOCAL_PROJECT,
  GET_PROJECT,
} from 'api/apollo/queries';

import Mixpanel from 'util/mixpanel';
import {
  registerOnCloseSaveMessage,
  unregisterOnCloseSaveMessage,
} from 'util/onclose';
import { createDefaultProject, DEFAULT_ACCOUNT_STATE } from './projectDefault';
import { UrlRewritter, FILE_TYPE_NAME } from 'util/urlRewritter';
import { Template } from 'src/types';

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

  async createLocalProject(): Promise<Project> {
    const project = createDefaultProject();

    this.client.writeQuery({
      query: GET_PROJECT,
      variables: {
        projectId: project.id,
      },
      data: { project },
    });

    await this.client.mutate({
      mutation: SET_ACTIVE_PROJECT,
      variables: {
        id: project.id,
      },
    });
    return project;
  }

  async createProjectCopy(sourceProject: Project): Promise<Project> {
    const parentId = sourceProject?.id || null;
    const seed = sourceProject?.seed || 0;
    const title = `${sourceProject?.title} Copy`;
    const description = sourceProject?.description || '';
    const readme = sourceProject?.readme || '';
    const transactionTemplates = sourceProject.transactionTemplates.map(
      (tpl: Template) => ({
        script: tpl.script,
        title: tpl.title,
      }),
    );
    const scriptTemplates = sourceProject.scriptTemplates.map(
      (tpl: Template) => ({
        script: tpl.script,
        title: tpl.title,
      }),
    );
    const contractTemplates = sourceProject.contractTemplates.map(
      (tpl: Template) => ({
        script: tpl.script,
        title: tpl.title,
      }),
    );

    const { data } = await this.client.mutate({
      mutation: CREATE_PROJECT,
      variables: {
        parentId: parentId,
        updatedAt: null,
        title: title,
        description: description,
        numberOfAccounts: sourceProject?.accounts?.length || 5,
        readme: readme,
        seed: seed,
        transactionTemplates,
        scriptTemplates,
        contractTemplates,
      },
      context: {
        serializationKey: PROJECT_SERIALIZATION_KEY,
      },
    });

    const newProject = data.project;

    Mixpanel.people.set({
      projectId: newProject.id,
    });
    Mixpanel.track('Copy Project', { projectId: sourceProject.id, newProject });

    return newProject;
  }

  async createProject(): Promise<Project> {
    const newProject = this.client.readQuery({
      query: GET_LOCAL_PROJECT,
    }).project;

    const seed = newProject.seed;
    const title = newProject.title;
    const description = newProject.description;
    const readme = newProject.readme;
    const transactionTemplates = newProject.transactionTemplates.map(
      (tpl: Template) => ({ script: tpl.script, title: tpl.title }),
    );
    const scriptTemplates = newProject.scriptTemplates.map((tpl: Template) => ({
      script: tpl.script,
      title: tpl.title,
    }));
    const contractTemplates = newProject.contractTemplates.map(
      (tpl: Template) => ({
        script: tpl.script,
        title: tpl.title,
      }),
    );

    const { data } = await this.client.mutate({
      mutation: CREATE_PROJECT,
      variables: {
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

    // project saved
    unregisterOnCloseSaveMessage();
    return project;
  }

  /** update local project meta
   * keeps track of changes to meta data before project is saved to server
   */
  async updateLocalProjectMeta(
    title: string,
    description: string,
    readme: string,
  ) {
    const project = this.client.readQuery({
      query: GET_LOCAL_PROJECT,
    }).project;

    project.title = title || project.title;
    project.description = description || project.description;
    project.readme = readme || project.readme;
    project.updatedAt = null;
    project.contractDeployments = [];

    this.client.writeQuery({
      query: GET_PROJECT,
      variables: {
        projectId: project.id,
      },
      data: { project },
    });
  }

  async saveProject(title: string, description: string, readme: string) {
    if (this.isLocal) {
      const project = await this.createProject();
      const path = UrlRewritter(project, FILE_TYPE_NAME.contract, 0);
      navigate(path);
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
        title: title,
        description: description,
        readme: readme,
      },
      refetchQueries: [
        { query: GET_PROJECT, variables: { projectId: this.projectId } },
      ],
      context: {
        debounceKey: key,
        serializationKey: PROJECT_SERIALIZATION_KEY,
      },
    });

    Mixpanel.track('Project saved', { projectId: this.projectId });
    return { projectId: this.projectId };
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

  async resetProject(projectId: string) {
    const res = await this.client.mutate({
      mutation: RESET_PROJECT,
      variables: {
        projectId,
      },
      refetchQueries: [{ query: GET_PROJECT, variables: { projectId } }],
      context: {
        serializationKey: PROJECT_SERIALIZATION_KEY,
      },
    });
    return res;
  }

  async clearLog(resultType: string) {
    const res = await this.client.mutate({
      mutation: CLEAR_EXECUTION_RESULTS,
      variables: {
        resultType,
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
      refetchQueries: [
        {
          query: GET_PROJECT,
          variables: { projectId: this.projectId },
        },
      ],
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
      const project = await this.createProject();
      const path = UrlRewritter(project, FILE_TYPE_NAME.transaction, 0);
      navigate(path);
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
      const project = await this.createProject();
      const path = UrlRewritter(project, FILE_TYPE_NAME.transaction, 0);
      navigate(path);
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
      refetchQueries: [
        {
          query: GET_PROJECT,
          variables: { projectId: this.projectId },
        },
      ],
      context: {
        debounceKey: key,
        serializationKey: PROJECT_SERIALIZATION_KEY,
      },
      fetchPolicy: 'no-cache',
    });
  }

  async deleteTransactionTemplate(templateId: string) {
    if (this.isLocal) {
      // if project not saved don't save when deleting a file
      return;
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
      // don't save if project is local and deleting a file
      return;
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
      const project = await this.createProject();
      const path = UrlRewritter(project, FILE_TYPE_NAME.script, 0);
      navigate(path);
    }

    const res = await this.client.mutate({
      mutation: CREATE_SCRIPT_EXECUTION,
      variables: {
        projectId: this.projectId,
        script,
        arguments: args,
      },
      refetchQueries: [
        { query: GET_PROJECT, variables: { projectId: this.projectId } },
      ],
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
    if (this.isLocal) {
      const project = await this.createProject();
      const path = UrlRewritter(project, FILE_TYPE_NAME.script, 0);
      navigate(path);
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
        persist: true,
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
      const project = await this.createProject();
      const path = UrlRewritter(project, FILE_TYPE_NAME.contract, 0);
      navigate(path);
    }

    const res = await this.client.mutate({
      mutation: CREATE_CONTRACT_TEMPLATE,
      variables: {
        projectId: this.projectId,
        script,
        title,
      },
      refetchQueries: [
        { query: GET_PROJECT, variables: { projectId: this.projectId } },
      ],
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
        project,
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
      refetchQueries: [
        {
          query: GET_PROJECT,
          variables: { projectId: this.projectId },
        },
      ],
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
    args: string[],
  ) {
    const hasDeployedCode = !!account.deployedContracts?.length;

    if (this.isLocal) {
      const project = await this.createProject();
      contractTemplate = project.contractTemplates[index];
      const path = UrlRewritter(project, FILE_TYPE_NAME.contract, index);
      navigate(path);
    }

    const res = await this.client.mutate({
      mutation: CREATE_CONTRACT_DEPLOYMENT,
      variables: {
        projectId: this.projectId,
        script: contractTemplate.script,
        signer: account.address,
        arguments: args,
      },
      refetchQueries: [
        { query: GET_PROJECT, variables: { projectId: this.projectId } },
      ],
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
      // don't save a local project if deleting a file
      return;
    }

    const res = await this.client.mutate({
      mutation: DELETE_CONTRACT_TEMPLATE,
      variables: {
        projectId: this.projectId,
        templateId,
      },
      refetchQueries: [
        { query: GET_PROJECT, variables: { projectId: this.projectId } },
      ],
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

  async getApplicationErrors() {
    const response = this.client.readQuery({
      query: GET_APPLICATION_ERRORS,
    });
    return response;
  }

  async clearApplicationErrors() {
    this.client.writeQuery({
      query: GET_APPLICATION_ERRORS,
      data: {
        errorMessage: '',
      },
    });
  }
}
