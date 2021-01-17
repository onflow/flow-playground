import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import prettier from 'prettier';
import parserBabel from 'prettier/parser-babel';
import { useProject } from 'providers/Project/projectHooks';

import {
  FullScreenContainer,
  PopupContainer,
  PopupHeader,
  WhiteOverlay,
  SpaceBetween,
} from 'components/Common';
import { Project } from 'api/apollo/generated/graphql';
import {
  getContractName,
  replaceContractTemplate,
  replaceScriptTemplate,
  replaceTransactionTemplate,
} from '../util/generator';

// TODO: should be replaced to "master" before merging or replaced with .env variable
const BRANCH = 'max/export-project-as-zip';
const GENERATOR_ROOT = `https://raw.githubusercontent.com/onflow/flow-playground/${BRANCH}/project-generator`;

const getFile = async (filename: string) => {
  const response = await fetch(`${GENERATOR_ROOT}/${filename}`);
  const content = await response.text();
  return content;
};

const generateReadMe = async (id: 'string') => {
  const file = await getFile('files/README.md');
  const readMeFile = file
    .replace(/##PROJECT-ID##/g, `${id.toLowerCase()}`)
    .replace(
      /##PROJECT-LINK##/g,
      `https://play.onflow.org/${id.toLowerCase()}`,
    );
  return readMeFile;
};

const generatePackageConfig = async (projectName: string) => {
  const file = await getFile('files/package.json');
  const config = file.replace(/##PROJECT-NAME##/g, projectName.toLowerCase());
  return config;
};

const generateTests = async (baseFolder: string, project: Project) => {
  const base = await getFile('snippets/imports.js');
  let content = base.replace(/##BASE-FOLDER##/, baseFolder);

  let deploymentTests = '';
  for (let i = 0; i < project.accounts.length; i++) {
    const account = project.accounts[i];
    const address = `0x0${account.address.slice(-1)}`;
    const code = account.draftCode;
    const unitTest = replaceContractTemplate(address, code);
    deploymentTests += unitTest;
    deploymentTests += '\n';
  }
  content = content.replace(/\/\/ ##DEPLOYMENT-TESTS##/, deploymentTests);

  let executionTests = '';
  for (let i = 0; i < project.transactionTemplates.length; i++) {
    const tx = project.transactionTemplates[i];
    const unitTest = replaceTransactionTemplate(tx.title, tx.script);
    executionTests += unitTest;
    executionTests += '\n';
  }

  for (let i = 0; i < project.scriptTemplates.length; i++) {
    const script = project.scriptTemplates[i];
    const unitTest = replaceScriptTemplate(script.title, script.script);
    executionTests += unitTest;
    executionTests += '\n';
  }
  content = content.replace(
    /\/\/ ##TRANSACTIONS-AND-SCRIPTS-TESTS##/,
    executionTests,
  );
  return prettier.format(content, { parser: 'babel', plugins: [parserBabel] });
};

const ExportPopup: React.FC<{
  visible: boolean;
  triggerClose?: (e: React.SyntheticEvent) => any;
}> = ({ visible, triggerClose }) => {
  const { project } = useProject();
  const [processing, setProcessing] = useState(false);
  const [projectName, setProjectName] = useState(`project-${project.id}`);
  const [folderName, setFolderName] = useState('cadence');

  const createZip = async () => {
    const zip = new JSZip();

    // Create setup files
    const readMeFile = await generateReadMe(project.id);
    const packageConfig = await generatePackageConfig(
      `playground-project-${project.id.toLowerCase()}`,
    );
    const babelConfig = await getFile('files/babel.config.json');
    const jestConfig = await getFile('files/package.json');
    const testFile = await generateTests(folderName, project);

    zip.file('test/README.md', readMeFile);
    zip.file('test/package.json', packageConfig);
    zip.file('test/babel.config.json', babelConfig);
    zip.file('test/jest.config.json', jestConfig);
    zip.file('test/index.test.js', testFile);

    const { accounts, transactionTemplates, scriptTemplates } = project;

    for (let i = 0; i < accounts.length; i++) {
      const account = accounts[i];
      const name = getContractName(account.draftCode);
      const fileName = `cadence/contracts/${name}.cdc`;
      zip.file(fileName, account.draftCode);
    }

    for (let i = 0; i < transactionTemplates.length; i++) {
      const template = transactionTemplates[i];
      const name = template.title;
      const fileName = `cadence/transactions/${name}.cdc`;
      zip.file(fileName, template.script);
    }

    for (let i = 0; i < scriptTemplates.length; i++) {
      const template = scriptTemplates[i];
      const name = template.title;
      const fileName = `cadence/scripts/${name}.cdc`;
      zip.file(fileName, template.script);
    }

    // Save everything as ZIP
    const projectFile = await zip.generateAsync({ type: 'blob' });
    saveAs(projectFile, `${projectName}.zip`);
  };

  return (
    visible && (
      <FullScreenContainer elevation={15}>
        <PopupContainer width="300px">
          <PopupHeader mb="20px">Export Project</PopupHeader>
          <input
            value={projectName}
            onChange={event => setProjectName(event.target.value)}
          />
          <input
            value={folderName}
            onChange={event => setFolderName(event.target.value)}
          />
          {processing ? (
            <p>Processing...</p>
          ) : (
            <SpaceBetween mb="20px">
              <button onClick={triggerClose}>Close</button>
              <button
                onClick={async () => {
                  setProcessing(true);
                  await createZip();
                  setProcessing(false);
                  triggerClose(null);
                }}
              >
                Export
              </button>
            </SpaceBetween>
          )}
        </PopupContainer>
        <WhiteOverlay onClick={triggerClose} />
      </FullScreenContainer>
    )
  );
};

export default ExportPopup;
