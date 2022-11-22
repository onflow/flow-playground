import Button from 'components/Button';
import Mixpanel from 'util/mixpanel';
import React from 'react';
import { SXStyles } from 'src/types';
import { Container, Text } from 'theme-ui';
import { useProject } from 'providers/Project/projectHooks';
import { LOCAL_PROJECT_ID } from 'util/url';
import { formatDistance } from 'date-fns';

const styles: SXStyles = {
  container: {
    margin: '0',
    width: 'unset',
  },
};

export const SaveButton = () => {
  const projectId =
    window.location.pathname.slice(1) === LOCAL_PROJECT_ID
      ? null
      : window.location.pathname.slice(1);

  const { project, updateProject } = useProject();

  // todo: verify Project persist is true when project is saved.
  const isSaved = project?.persist;

  const saveClicked = () => {
    Mixpanel.track('Save project clicked', { projectId });
    updateProject(project.title, project.description, project.readme);
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
          onClick={() => saveClicked()}
          variant="alternate"
          size="sm"
          inline={true}
          disabled={isSaved}
        >
          {buttonLabel}
        </Button>
      )}
    </Container>
  );
};
