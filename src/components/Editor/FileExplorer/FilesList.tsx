import { navigate } from '@reach/router';
import ExplorerContractIcon from 'components/Icons/ExplorerContractIcon';
import ExplorerScriptIcon from 'components/Icons/ExplorerScriptIcon';
import ExplorerTransactionIcon from 'components/Icons/ExplorerTransactionIcon';
import { EntityType } from 'providers/Project';
import { useProject } from 'providers/Project/projectHooks';
import React, { useState } from 'react';
import { ChildProps, SXStyles } from 'src/types';
import { Box, Flex } from 'theme-ui';
import { isUUUID, LOCAL_PROJECT_ID } from 'util/url';
import MenuList from './MenuList';
import InformationalPopup from '../../InformationalPopup';
import {
  UrlRewritter,
  UrlRewritterWithId,
  FILE_TYPE_NAME,
} from 'util/urlRewritter';

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
    color: 'leftSidebarHeaderText',
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
    deleteTransactionTemplate,
    deleteScriptTemplate,
    deleteContractTemplate,
    updateTransactionTemplate,
    updateScriptTemplate,
    updateContractTemplate,
    setApplicationErrorMessage,
  } = useProject();

  const projectPath = isUUUID(project.id) ? project.id : LOCAL_PROJECT_ID;
  const [showDeleteError, setShowDeleteError] = useState<boolean>(false);
  const DynamicIcon = ({ children, isSelected }: DynamicIconProps) => {
    return <Box sx={isSelected ? styles.selected : {}}>{children}</Box>;
  };

  const handleDelete = async ({
    title,
    templateId,
  }: {
    templateId: string;
    title: string;
  }) => {
    switch (title) {
      case 'Transaction':
        if (project.transactionTemplates.length > 1) {
          await deleteTransactionTemplate(templateId);
          const path = UrlRewritter(project, FILE_TYPE_NAME.transaction, 0);
          navigate(path);
        } else {
          setShowDeleteError(true);
        }
        break;
      case 'Script':
        if (project.scriptTemplates.length > 1) {
          await deleteScriptTemplate(templateId);
          const path = UrlRewritter(project, FILE_TYPE_NAME.script, 0);
          navigate(path);
        } else {
          setShowDeleteError(true);
        }
        break;
      default:
        if (project.contractTemplates.length > 1) {
          await deleteContractTemplate(templateId);
          const path = UrlRewritter(project, FILE_TYPE_NAME.contract, 0);
          navigate(path);
        } else {
          setShowDeleteError(true);
        }
    }
    return;
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
          itemType={EntityType.ContractTemplate}
          items={project.contractTemplates}
          itemTitles={project.contractTemplates?.map((template) => {
            return template.title;
          })}
          onSelect={(_, id) => {
            navigate(UrlRewritterWithId(project, FILE_TYPE_NAME.contract, id));
          }}
          onUpdate={(_templateId: string, script: string, title: string) => {
            updateContractTemplate(script, title);
          }}
          onDelete={handleDelete}
          onInsert={async () => {
            let res;
            try {
              res = await mutator.createContractTemplate('', 'New Contract');
              navigate(
                UrlRewritterWithId(
                  project,
                  FILE_TYPE_NAME.contract,
                  res.data?.createContractTemplate?.id,
                ),
              );
            } catch (e) {
              await mutator.getApplicationErrors().then((res) => {
                setApplicationErrorMessage(res.errorMessage);
              });
            }
          }}
        />
        <MenuList
          title="Transactions"
          itemType={EntityType.TransactionTemplate}
          items={project.transactionTemplates}
          itemTitles={project.transactionTemplates?.map((template) => {
            return template.title;
          })}
          onSelect={(_, id) => {
            navigate(
              UrlRewritterWithId(project, FILE_TYPE_NAME.transaction, id),
            );
          }}
          onUpdate={(templateId: string, script: string, title: string) => {
            updateTransactionTemplate(templateId, script, title);
          }}
          onDelete={handleDelete}
          onInsert={async () => {
            let res;
            try {
              res = await mutator.createTransactionTemplate(
                '',
                `New Transaction`,
              );
              navigate(
                UrlRewritterWithId(
                  project,
                  FILE_TYPE_NAME.transaction,
                  res.data?.createTransactionTemplate?.id,
                ),
              );
            } catch (e) {
              await mutator.getApplicationErrors().then((res) => {
                setApplicationErrorMessage(res.errorMessage);
              });
            }
          }}
        />
        <MenuList
          title="Scripts"
          itemType={EntityType.ScriptTemplate}
          items={project.scriptTemplates}
          itemTitles={project.scriptTemplates?.map((template) => {
            return template.title;
          })}
          onSelect={(_, id) => {
            navigate(UrlRewritterWithId(project, FILE_TYPE_NAME.script, id));
          }}
          onUpdate={(templateId: string, script: string, title: string) => {
            updateScriptTemplate(templateId, script, title);
          }}
          onDelete={handleDelete}
          onInsert={async () => {
            let res;
            try {
              res = await mutator.createScriptTemplate('', `New Script`);
              navigate(
                UrlRewritterWithId(
                  project,
                  FILE_TYPE_NAME.script,
                  res.data?.createScriptTemplate?.id,
                ),
              );
            } catch (e) {
              await mutator.getApplicationErrors().then((res) => {
                setApplicationErrorMessage(res.errorMessage);
              });
            }
          }}
        />
        <InformationalPopup
          visible={showDeleteError}
          title="Unable to Delete file"
          onClose={() => setShowDeleteError(false)}
          message="Project requires at least 1 Script, Transaction, and Contract file. Please create a new file before deleting this one."
        />
      </>
    );
  };

  return <Flex sx={styles.root}>{getListContent()}</Flex>;
};

export default FilesList;
