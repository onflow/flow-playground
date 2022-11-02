import { navigate } from '@reach/router';
import { EntityType } from 'providers/Project';
import { useProject } from 'providers/Project/projectHooks';
import React from 'react';
import { SXStyles, ChildProps } from 'src/types';
import { Flex, Box } from 'theme-ui';
import { isUUUID, LOCAL_PROJECT_ID } from 'util/url';
import MenuList from './MenuList';
import ExplorerContractIcon from 'components/Icons/ExplorerContractIcon';
import ExplorerTransactionIcon from 'components/Icons/ExplorerTransactionIcon';
import ExplorerScriptIcon from 'components/Icons/ExplorerScriptIcon';

type FileListProps = {
  isExplorerCollapsed: boolean;
};

interface DynamicIconProps extends ChildProps {
  isSelected: boolean;
}

const styles: SXStyles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: '24px',
    fontFamily: 'IBM Plex Mono',
  },
  header: {
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '12px',
    lineHeight: '14px',
    letterSpacing: '-0.01em',
    textTransform: 'uppercase',
    color: '#69717E',
    fontFamily: 'Acumin Pro',
  },
  collapsed: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '12px',
    justifyContent: 'space-between',
    height: '100px',
  },
  selected: {
    filter:
      'brightness(0) saturate(100%) invert(14%) sepia(96%) saturate(3637%) hue-rotate(242deg) brightness(95%) contrast(100%)',
  },
};

const FilesList = ({ isExplorerCollapsed }: FileListProps) => {
  const {
    active,
    project,
    mutator,
    selectedResourceAccount,
    deleteTransactionTemplate,
    deleteScriptTemplate,
    deleteContractTemplate,
    updateTransactionTemplate,
    updateScriptTemplate,
    updateContractTemplate,
  } = useProject();

  const projectPath = isUUUID(project.id) ? project.id : LOCAL_PROJECT_ID;
  const storageAcct = selectedResourceAccount || 'none';

  const DynamicIcon = ({ children, isSelected }: DynamicIconProps) => {
    return <Box sx={isSelected ? styles.selected : {}}>{children}</Box>;
  };
  const getListContent = () => {
    if (isExplorerCollapsed) {
      return (
        <Flex sx={styles.collapsed}>
          <DynamicIcon isSelected={active.type == EntityType.ContractTemplate}>
            <ExplorerContractIcon />
          </DynamicIcon>
          <DynamicIcon
            isSelected={active.type == EntityType.TransactionTemplate}
          >
            <ExplorerTransactionIcon />
          </DynamicIcon>
          <DynamicIcon isSelected={active.type == EntityType.ScriptTemplate}>
            <ExplorerScriptIcon />
          </DynamicIcon>
        </Flex>
      );
    }

    return (
      <>
        <Flex sx={styles.header}>Files</Flex>
        <MenuList
          title="Contracts"
          items={[
            { title: 'Contract Test', key: 0 },
            { title: 'Contract 2 Test', key: 1 },
          ]}
          active={null}
          onSelect={() => {}}
          onUpdate={(templateId: string, script: string, title: string) => {
            updateContractTemplate(templateId, script, title);
          }}
          onDelete={async (templateId: string) => {
            await deleteContractTemplate(templateId);
            // const id = project.contractTemplates[0].id;
            const id = 0;
            navigate(`/${projectPath}?type=tx&id=${id}&storage=${storageAcct}`);
          }}
          onInsert={async () => {
            const res = await mutator.createContractTemplate(
              '',
              `New Contract`,
            );
            navigate(
              `/${projectPath}?type=tx&id=${res.data?.createContractTemplate?.id}&storage=${storageAcct}`,
            );
          }}
        />
        <MenuList
          title="Transactions"
          items={project.transactionTemplates}
          active={
            active.type == EntityType.TransactionTemplate ? active.index : null
          }
          onSelect={(_, id) => {
            navigate(`/${projectPath}?type=tx&id=${id}&storage=${storageAcct}`);
          }}
          onUpdate={(templateId: string, script: string, title: string) => {
            updateTransactionTemplate(templateId, script, title);
          }}
          onDelete={async (templateId: string) => {
            await deleteTransactionTemplate(templateId);
            const id = project.transactionTemplates[0].id;
            navigate(`/${projectPath}?type=tx&id=${id}&storage=${storageAcct}`);
          }}
          onInsert={async () => {
            const res = await mutator.createTransactionTemplate(
              '',
              `New Transaction`,
            );
            navigate(
              `/${projectPath}?type=tx&id=${res.data?.createTransactionTemplate?.id}&storage=${storageAcct}`,
            );
          }}
        />
        <MenuList
          title="Scripts"
          items={project.scriptTemplates}
          active={
            active.type == EntityType.ScriptTemplate ? active.index : null
          }
          onSelect={(_, id) => {
            navigate(
              `/${projectPath}?type=script&id=${id}&storage=${storageAcct}`,
            );
          }}
          onUpdate={(templateId: string, script: string, title: string) => {
            updateScriptTemplate(templateId, script, title);
          }}
          onDelete={async (templateId: string) => {
            await deleteScriptTemplate(templateId);
            const id = project.scriptTemplates[0].id;
            navigate(
              `/${projectPath}?type=script&id=${id}&storage=${storageAcct}`,
            );
          }}
          onInsert={async () => {
            const res = await mutator.createScriptTemplate('', `New Script`);
            navigate(
              `/${projectPath}?type=script&id=${res.data?.createScriptTemplate?.id}&storage=${storageAcct}`,
            );
          }}
        />
      </>
    );
  };

  return <Flex sx={styles.root}>{getListContent()}</Flex>;
};

export default FilesList;
