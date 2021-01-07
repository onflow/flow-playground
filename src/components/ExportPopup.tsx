import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useProject } from 'providers/Project/projectHooks';

import {
  FullScreenContainer,
  PopupContainer,
  PopupHeader,
  WhiteOverlay,
  SpaceBetween,
} from 'components/Common';

// TODO: should be replaced to "master" before merging or replaced with .env variable
const BRANCH = "max/export-project-as-zip"
const GENERATOR_ROOT = `https://raw.githubusercontent.com/onflow/flow-playground/${BRANCH}/project-generator`

const getFile = async (filename: string) =>  {
  const response = await fetch(`${GENERATOR_ROOT}/${filename}`)
  const content = await response.text()
  return content
}

const generateReadMe = async (id:"string") => {
  const file = await getFile("files/README.md")
  const readMeFile = file
    .replace(/##PROJECT-ID##/g,`${id.toLowerCase()}`)
    .replace(/##PROJECT-LINK##/g,`https://play.onflow.org/${id.toLowerCase()}`)
  return readMeFile
}
const generatePackageConfig = async (projectName: string) => {
  const file = await getFile("files/package.json")
  const config = file
    .replace(/##PROJECT-NAME##/g, projectName.toLowerCase())
  return config
}
const generateTests = async (baseFolder: string) =>{
  const base = await getFile("snippets/imports.js")
  const content = base.replace(/##BASE-FOLDER##/, baseFolder)

  // TODO: inject deployment scripts
  // TODO: inject transactions and scripts in specified order via #pragma-order tags

  return content
}

const ExportPopup: React.FC<{
  visible: boolean;
  triggerClose?: (e: React.SyntheticEvent) => any;
}> = ({ visible, triggerClose }) => {
  const [processing, setProcessing] = useState(false);
  const { project } = useProject();

  const createZip = async () => {

    const zip = new JSZip();

    // Create setup files
    const readMeFile = await generateReadMe(project.id)
    const packageConfig = await generatePackageConfig(`playground-project-${project.id.toLowerCase()}`)
    const babelConfig = await getFile("files/babel.config.json")
    const jestConfig = await getFile("files/package.json")
    const testFile = await generateTests("cadence")
    zip.file("test/README.md", readMeFile);
    zip.file("test/package.json", packageConfig)
    zip.file("test/babel.config.json", babelConfig)
    zip.file("test/jest.config.json", jestConfig)
    zip.file("test/index.test.js", testFile)

    const { accounts, transactionTemplates, scriptTemplates } = project;

    for (let i = 0; i < accounts.length; i++) {
      const account = accounts[i];
      const fileName = `cadence/contracts/contract-0${i}.cdc`;
      zip.file(fileName, account.draftCode);
    }

    for (let i = 0; i < transactionTemplates.length; i++) {
      const template = transactionTemplates[i];
      const fileName = `cadence/transactions/tx-0${i}.cdc`;
      zip.file(fileName, template.script);
    }

    for (let i = 0; i < scriptTemplates.length; i++) {
      const template = scriptTemplates[i];
      const fileName = `cadence/scripts/script-0${i}.cdc`;
      zip.file(fileName, template.script);
    }

    // Save everything as ZIP
    const projectFile = await zip.generateAsync({ type: 'blob' });
    const projectName = `project-${project.id}.zip`;
    saveAs(projectFile, projectName);
  };

  return (
    visible && (
      <FullScreenContainer elevation={15}>
        <PopupContainer width="300px">
          <PopupHeader mb="20px">Export Project</PopupHeader>
          <p>Here we will show popup information</p>
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
