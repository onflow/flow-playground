import { navigate } from '@reach/router';
import ExplorerContractIcon from 'components/Icons/ExplorerContractIcon';
import ExplorerScriptIcon from 'components/Icons/ExplorerScriptIcon';
import ExplorerTransactionIcon from 'components/Icons/ExplorerTransactionIcon';
import { EntityType } from 'providers/Project';
import { useProject } from 'providers/Project/projectHooks';
import React, { useEffect, useState } from 'react';
import { ChildProps, SXStyles, Template } from 'src/types';
import { Box, Flex, useThemeUI } from 'theme-ui';
import MenuList from './MenuList';
import InformationalPopup from '../../InformationalPopup';
import {
  UrlRewritter,
  UrlRewritterWithId,
  FILE_TYPE_NAME,
} from 'util/urlRewritter';
import { hasDuplicates } from '../CadenceEditor/ControlPanel/utils';
import { ResultType } from 'api/apollo/generated/graphql';

type FileListProps = {
  isExplorerCollapsed: boolean;
};

interface DynamicIconProps extends ChildProps {
  isSelected: boolean;
}
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

  const [showDeleteError, setShowDeleteError] = useState<boolean>(false);

  const context = useThemeUI();
  const { theme } = context;

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
      lineHeight: '16px',
      letterSpacing: '-0.01em',
      textTransform: 'uppercase',
      color: `${theme.colors.muted}`,
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

  const DynamicIcon = ({ children, isSelected }: DynamicIconProps) => {
    return <Box sx={isSelected ? styles.selected : {}}>{children}</Box>;
  };

  const handelDupNames = (type: ResultType, names: string[]) => {
    if (hasDuplicates(names)) {
      setApplicationErrorMessage(
        `${type.toLowerCase()} file name already exists`,
      );
    }
  };

  const getNames = (items: Template[]) => {
    return items?.map((template) => {
      return template.title;
    });
  };

  const handleDelete = async ({
    itemType,
    templateId,
  }: {
    itemType: EntityType;
    templateId: string;
  }) => {
    if (project.parentId) {
      return setShowDeleteError(true);
    }
    switch (itemType) {
      case EntityType.TransactionTemplate:
        if (project.transactionTemplates.length > 1) {
          await deleteTransactionTemplate(templateId);
          const path = UrlRewritter(project, FILE_TYPE_NAME.transaction, 0);
          navigate(path);
        } else {
          setShowDeleteError(true);
        }
        break;
      case EntityType.ScriptTemplate:
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
    const contractNames = getNames(project.contractTemplates);
    const transactionNames = getNames(project.transactionTemplates);
    const scriptNames = getNames(project.scriptTemplates);

    useEffect(() => {
      handelDupNames(ResultType.Contract, contractNames);
      handelDupNames(ResultType.Transaction, transactionNames);
      handelDupNames(ResultType.Script, scriptNames);
    }, [contractNames, transactionNames, scriptNames]);

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
        <Flex sx={styles.header}>FILES</Flex>
        <MenuList
          title="Contracts"
          itemType={EntityType.ContractTemplate}
          items={project.contractTemplates}
          itemTitles={contractNames}
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
          itemTitles={transactionNames}
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
          itemTitles={scriptNames}
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
          messages={
            project.parentId
              ? [
                  'Project is from a shared source, need to save before deleting files.',
                ]
              : [
                  'Project requires at least 1 Script, Transaction, and Contract file. Please create a new file before deleting this one.',
                ]
          }
        />
      </>
    );
  };

  return <Flex sx={styles.root}>{getListContent()}</Flex>;
};

export default FilesList;
