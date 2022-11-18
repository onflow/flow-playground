import Button from 'components/Button';
import Mixpanel from 'util/mixpanel';
import React from 'react';
import { SXStyles } from 'src/types';
import { Container, Text } from 'theme-ui';
import theme from '../../theme';
import { useProject } from 'providers/Project/projectHooks';
import { useApolloClient } from '@apollo/react-hooks';
import { LOCAL_PROJECT_ID } from 'util/url';
import { formatDistance } from 'date-fns';

const styles: SXStyles = {
  container: {
    margin: '0',
    width: 'unset',
  },
  menu: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '8px',
    border: `1px solid ${theme.colors.borderColor}`,
    boxShadow: `0px 4px 40px rgba(0, 0, 0, 0.08)`,
    position: 'absolute',
    zIndex: '15',
    right: '170px',
    margin: '0',
    background: theme.colors.white,
    padding: '1rem',
  },
  copyLink: {
    flexDirection: 'row',
    paddingBottom: '12px',
  },
  ctaButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '12px',
    width: '113px',
    marginLeft: '4px',
    background: '#F6F7F9',
    border: '1px solid #DEE2E9',
    borderRadius: '4px',
    height: '48px',
  },
  linkInput: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '12px',
    width: '363px',
    background: '#F6F7F9',
    border: '1px solid #DEE2E9',
    borderRadius: '4px',
  },
  message: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
};

export const SaveButton = () => {
  const projectId =
    window.location.pathname.slice(1) === LOCAL_PROJECT_ID
      ? null
      : window.location.pathname.slice(1);
  const client = useApolloClient();
  //console.log('use get project', projectId, true)
  const { project, updateProject } = useProject();

  //console.log('save project', project?.persist, project?.updatedAt);
  // todo: verify Project persist is true when project is saved.
  const isSaved = project?.persist;

  const saveClicked = () => {
    console.log('save project');
    Mixpanel.track('Save project clicked', { projectId });
    updateProject(project.title, project.description, project.readme)
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
        <Text>{ buttonLabel }</Text>
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
