import { Link } from '@reach/router';
import ConfirmationPopup from 'components/ConfirmationPopup';
import { ContextMenu } from 'components/ContextMenu';
import ContractIcon from 'components/Icons/ContractIcon';
import DeleteIcon from 'components/Icons/DeleteIcon';
import ScriptIcon from 'components/Icons/ScriptIcon';
import TransactionIcon from 'components/Icons/TransactionIcon';
import { formatDistance } from 'date-fns';
import React, { useState } from 'react';
import { MockProject, SXStyles } from 'src/types';
import { Box, Flex } from 'theme-ui';
import paths from '../../paths';
import { useProject } from 'providers/Project/projectHooks';

type Props = {
  project: MockProject;
};

const styles: SXStyles = {
  root: {
    borderRadius: 16,
    backgroundColor: 'white',
    padding: 10,
    gap: 7,
    flexDirection: 'column',
    color: 'black',
  },
  title: {
    fontSize: 3,
    fontFamily: 'Termina',
    fontWeight: 600,
    '&:hover': {
      opacity: 0.75,
    },
  },
  details: {
    gap: 8,
    alignItems: 'center',
  },
  detail: {
    gap: 5,
    alignItems: 'center',
    fontSize: 1,
  },
  lastSaved: {
    color: 'muted',
    fontSize: 1,
  },
};

const titleLinkStyle = {
  textDecoration: 'none',
  color: 'inherit',
};

const getRootStyles = (isCurrentProject: boolean) => {
  return {
    ...styles.root,
    borderColor: isCurrentProject ? `blueBorder` : 'transparent',
    borderWidth: 2,
    borderStyle: 'solid',
  };
};

const confirmDeleteOptions = {
  title: `Delete this project?`,
  message:
    'Are you sure you want to delete this project? This cannot be undone.',
};

const ProjectListItem = ({ project }: Props) => {
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const { deleteProject } = useProject();

  const confirmDelete = async (isConfirmed: boolean): Promise<void> => {
    setShowConfirmation(false);
    if (isConfirmed) {
      await deleteProject(project.id);
    }
  };

  const contextMenuOptions = [
    {
      name: 'Delete Project',
      onClick: () => setShowConfirmation(true),
      icon: DeleteIcon,
    },
  ];
  const timeAgo = formatDistance(new Date(project.lastSavedAt), new Date(), {
    addSuffix: true,
  });

  // TODO: isCurrentProject is mocked. Compare withe current project id once getProjects query is complete
  const isCurrentProject = project.id === 1;
  const rootStyles = getRootStyles(isCurrentProject);
  const headerStyles: SXStyles = {
    header: {
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  };

  return (
    <Flex sx={rootStyles}>
      <ConfirmationPopup
        onClose={confirmDelete}
        visible={showConfirmation}
        {...confirmDeleteOptions}
      />
      <Flex sx={headerStyles.header}>
        <Link to={paths.projectPath(project.id)} style={titleLinkStyle}>
          <Box sx={styles.title}>{project.title}</Box>
        </Link>
        <ContextMenu showDotDotDot={true} options={contextMenuOptions} />
      </Flex>

      <Flex sx={styles.details}>
        <Flex sx={styles.detail}>
          <span title="Contracts">
            <ContractIcon />
          </span>
          {project.contractTemplateCount}
        </Flex>
        <Flex sx={styles.detail}>
          <span title="Transactions">
            <TransactionIcon />
          </span>
          {project.transactionTemplateCount}
        </Flex>
        <Flex sx={styles.detail}>
          <span title="Scripts">
            <ScriptIcon />
          </span>
          {project.scriptTemplateCount}
        </Flex>
      </Flex>

      <Box
        sx={styles.lastSaved}
        title={new Date(project.lastSavedAt).toISOString()}
      >
        Last saved {timeAgo}
      </Box>
    </Flex>
  );
};

export default ProjectListItem;
