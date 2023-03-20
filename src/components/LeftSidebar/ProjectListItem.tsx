import { navigate } from '@reach/router';
import ConfirmationPopup from 'components/ConfirmationPopup';
import { ContextMenu } from 'components/ContextMenu';
import ContractIcon from 'components/Icons/ContractIcon';
import DeleteIcon from 'components/Icons/DeleteIcon';
import ScriptIcon from 'components/Icons/ScriptIcon';
import TransactionIcon from 'components/Icons/TransactionIcon';
import { formatDistance } from 'date-fns';
import React, { useState } from 'react';
import { ProjectType, SXStyles } from 'src/types';
import { Box, Flex } from 'theme-ui';
import paths from '../../paths';
import { useProject } from 'providers/Project/projectHooks';
import InformationalPopup from 'components/InformationalPopup';
import { LOCAL_PROJECT_ID } from 'util/url';

type Props = {
  project: ProjectType;
  projectCount: number;
  refetch: Function;
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
    fontWeight: 600,
    '&:hover': {
      opacity: 0.75,
    },
    cursor: 'pointer',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
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

const infoLastProjectOptions = {
  title: `Unable to delete this project!`,
  message: 'At least one playground project is required.',
};

const willLoseChangesOptions = {
  title: `You have unsaved Changes!`,
  message:
    'The project you are working on has not been saved, you will lose changes.',
};

const ProjectListItem = ({ project, projectCount, refetch }: Props) => {
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [showLastProject, setShowLastProject] = useState<boolean>(false);
  const [showWillLoseChanges, setShowWillLoseChanges] =
    useState<boolean>(false);
  const {
    toggleProjectsSidebar,
    deleteProject,
    project: activeProject,
  } = useProject();

  const confirmDelete = async (isConfirmed: boolean): Promise<void> => {
    setShowConfirmation(false);
    if (isConfirmed) {
      await deleteProject(project.id);
      await refetch();
    }
  };

  const confirmSelectProject = async (isConfirmed: boolean): Promise<void> => {
    setShowWillLoseChanges(false);
    if (isConfirmed) {
      toggleProjectsSidebar();
      navigate(`${paths.projectPath(project.id)}`);
    }
  };

  const contextMenuOptions = [
    {
      name: 'Delete Project',
      onClick: () =>
        projectCount > 1 ? setShowConfirmation(true) : setShowLastProject(true),
      icon: DeleteIcon,
    },
  ];
  const timeAgo = formatDistance(new Date(project.updatedAt), new Date(), {
    addSuffix: true,
  });

  const isCurrentProject = project.id === activeProject?.id;
  const rootStyles = getRootStyles(isCurrentProject);
  const headerStyles: SXStyles = {
    header: {
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  };

  const isLocal = Boolean(activeProject?.id === LOCAL_PROJECT_ID); // figure out if there are local project changes
  return (
    <Flex sx={rootStyles}>
      <ConfirmationPopup
        onClose={confirmDelete}
        visible={showConfirmation}
        {...confirmDeleteOptions}
      />
      <InformationalPopup
        onClose={setShowLastProject}
        visible={showLastProject}
        {...infoLastProjectOptions}
      />
      <ConfirmationPopup
        onClose={confirmSelectProject}
        visible={showWillLoseChanges}
        {...willLoseChangesOptions}
      />
      <Flex sx={headerStyles.header}>
        <Box
          onClick={() =>
            isLocal ? setShowWillLoseChanges(true) : confirmSelectProject(true)
          }
          sx={styles.title}
        >
          {project.title}
        </Box>

        <ContextMenu showEllipsis={true} options={contextMenuOptions} />
      </Flex>

      <Flex sx={styles.details}>
        <Flex sx={styles.detail}>
          <span title="Contracts">
            <ContractIcon />
          </span>
          {project.contractTemplates.length}
        </Flex>
        <Flex sx={styles.detail}>
          <span title="Transactions">
            <TransactionIcon />
          </span>
          {project.transactionTemplates.length}
        </Flex>
        <Flex sx={styles.detail}>
          <span title="Scripts">
            <ScriptIcon />
          </span>
          {project.scriptTemplates.length}
        </Flex>
      </Flex>

      <Box
        sx={styles.lastSaved}
        title={new Date(project.updatedAt).toISOString()}
      >
        Last saved {timeAgo}
      </Box>
    </Flex>
  );
};

export default ProjectListItem;
