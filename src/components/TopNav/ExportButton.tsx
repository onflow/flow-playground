import Button from 'components/Button';
import Mixpanel from 'util/mixpanel';
import React, { useState } from 'react';
import theme from '../../theme';
import { SXStyles } from 'src/types';
import { Container } from 'theme-ui';
import { useProject } from 'providers/Project/projectHooks';
import { LOCAL_PROJECT_ID } from 'util/url';
import InformationalPopup from 'components/InformationalPopup';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const styles: SXStyles = {
  container: {
    margin: '0',
    width: 'unset',
  },
  button: {
    border: '1px solid #DEE2E9',
    borderRadius: '8px',
    background: '#F6F7F9',
    '&:hover': {
      background: `${theme.colors.menuBg}`,
    },
  },
  buttonDisabled: {
    border: '1px solid #DEE2E9',
    borderRadius: '8px',
    background: '#F6F7F9',
    color: '#DEE2E9',
  },
};

export const ExportButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const projectId =
    window.location.pathname.slice(1) === LOCAL_PROJECT_ID
      ? null
      : window.location.pathname.slice(1);

  const { project } = useProject();


  const exportClicked = () => {
    Mixpanel.track('export project clicked', { projectId });
    setIsOpen(false);
    saveProject();
  };

  const saveProject = async () => {
    const zip = new JSZip();
    const contracts = zip.folder('contracts');
    project.contractTemplates.map((cdc) =>
      contracts.file(`${cdc.title}.cdc`, cdc.script),
    );
    const scripts = zip.folder('scripts');
    project.scriptTemplates.map((script) =>
      scripts.file(`${script.title}.cdc`, script.script),
    );
    const transactions = zip.folder('transactions');
    project.transactionTemplates.map((tx) =>
      transactions.file(`${tx.title}.cdc`, tx.script),
    );

    zip.generateAsync({ type: 'blob' }).then(function (content) {
      Mixpanel.track('export project downloaded', { projectId });
      saveAs(content, `${project.title}.zip`);
    });
  };

  const infoLastProjectOptions = {
    title: `Export Project: ${project.title}`,
    messages:
      ['Use vs code extension and flow-cli to deploy to an emulator or network.', 'Use "flow dev" to generate a flow.json file for this project.', 'Click "ok" to download project files.'],
  };

  return (
    <Container sx={styles.container}>
      <Button
        sx={styles.button}
        onClick={() => setIsOpen(true)}
        variant="secondary"
        size="sm"
        inline={true}
      >
        Export
      </Button>
      <InformationalPopup
        onClose={exportClicked}
        visible={isOpen}
        {...infoLastProjectOptions}
      />
    </Container>
  );
};
