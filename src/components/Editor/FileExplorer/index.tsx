import AccountList from 'components/AccountList';
import MenuList from 'components/Editor/FileExplorer/MenuList';
import ProjectInfo from 'components/Editor/FileExplorer/ProjectInfo';
import { EntityType } from 'providers/Project';
import React from 'react';
import { SXStyles } from 'src/types'
import { navigate } from '@reach/router';
import { useProject } from 'providers/Project/projectHooks';
import { isUUUID, LOCAL_PROJECT_ID } from '../../../util/url';
import { Flex } from 'theme-ui'
import ExplorerArrow from 'components/Icons/ExplorerArrow';

const styles: SXStyles = {
  root: {
    overFlowY: 'auto',
    background: ' #F6F7F9',
    flexDirection: 'row',
    display: 'flex',
    flexGrow: 0,

  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: '24px',
  },
  shutter: {
    position: 'absolute',
    width: '24px',
    height: '24px',
    left: '222px',
    top: '72px',
    borderRadius: '8px 0px 0px 8px',
    padding: 0
  },
  header: {}
}

const FileExplorer: React.FC = () => {
  const {
    isLoading,
    active,
    project,
    mutator,
    deleteTransactionTemplate,
    deleteScriptTemplate,
    updateTransactionTemplate,
    updateScriptTemplate,
    selectedResourceAccount,
  } = useProject();

  if (isLoading) return <p>Loading...</p>;

  const projectPath = isUUUID(project.id) ? project.id : LOCAL_PROJECT_ID;

  const storageAcct = selectedResourceAccount || 'none';

  return (
    <Flex sx={styles.root} >
      <Flex sx={styles.content} >
        <Flex sx={styles.header} >
          Files
        </Flex>
        <MenuList
          title="Transaction"
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
          active={active.type == EntityType.ScriptTemplate ? active.index : null}
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
        <ProjectInfo />
        <AccountList />
      </Flex>
      <Flex sx={styles.shutter} >
        shutter_placeholder
      </Flex>
      
    </Flex>
  );
};

export default FileExplorer;
