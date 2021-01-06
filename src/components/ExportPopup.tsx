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

const ExportPopup: React.FC<{
  visible: boolean;
  triggerClose?: (e: React.SyntheticEvent) => any;
}> = ({ visible, triggerClose }) => {
  const [processing, setProcessing] = useState(false);
  const { project } = useProject();

  const createZip = async () => {

    const readMeResponse = await fetch("https://raw.githubusercontent.com/onflow/flow-playground/master/README.md")
    const readMeFile = await readMeResponse.text();
    console.log({ readMeFile })

    const { accounts, transactionTemplates, scriptTemplates } = project;

    const zip = new JSZip();

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
