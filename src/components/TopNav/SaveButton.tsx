import Button from 'components/Button';
import Mixpanel from 'util/mixpanel';
import React from 'react';
import { SXStyles } from 'src/types';
import { Container, Text, useThemeUI } from 'theme-ui';
import { useProject } from 'providers/Project/projectHooks';
import { LOCAL_PROJECT_ID } from 'util/url';
import { formatDistance } from 'date-fns';
import useProjects from '../../hooks/useProjects';
import { MAX_PROJECTS } from 'components/LeftSidebar/NewProjectButton';

export const SaveButton = () => {
  const projectId =
    window.location.pathname.slice(1) === LOCAL_PROJECT_ID
      ? null
      : window.location.pathname.slice(1);

  const { project, isSaving, saveProject } = useProject();
  const { projects } = useProjects();
  const hasReachedProjectsLimit = projects.length >= MAX_PROJECTS;

  const isSaved = Boolean(project?.updatedAt);
  const context = useThemeUI();
  const { theme } = context;

  const styles: SXStyles = {
    container: {
      margin: '0',
      width: 'unset',
      display: ['none', 'none', 'flex'],
    },
    button: {
      border: `1px solid ${theme.colors.border}`,
      borderRadius: '8px',
    },
  };

  const saveClicked = () => {
    Mixpanel.track('Save project clicked', { projectId });
    saveProject();
  };

  const timeAgo = isSaved
    ? formatDistance(new Date(project.updatedAt), new Date(), {
        addSuffix: false,
      })
    : null;

  const buttonLabel = timeAgo ? `Saved ${timeAgo}` : `Save`;

  return (
    <Container sx={styles.container}>
      {isSaved ? (
        <Text>{buttonLabel}</Text>
      ) : (
        <Button
          sx={styles.button}
          onClick={() => saveClicked()}
          variant="secondary"
          size="sm"
          inline={true}
          disabled={isSaved || isSaving || hasReachedProjectsLimit}
        >
          {buttonLabel}
        </Button>
      )}
    </Container>
  );
};
