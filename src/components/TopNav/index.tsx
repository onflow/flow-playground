import Button from 'components/Button';
import Examples from 'components/Examples';
import { useProject } from 'providers/Project/projectHooks';
import React, { useEffect, useState } from 'react';
import { SXStyles } from 'src/types';
import { Flex, Link } from 'theme-ui';
import Mixpanel from 'util/mixpanel';
import ProjectsIcon from 'components/Icons/ProjectsIcon';
import LearnCadenceIcon from 'components/Icons/LearnCadenceIcon';
import FlagIcon from 'components/Icons/FlagIcon';
import NavInput from './NavInput';
import { ShareMenu } from './ShareMenu';
import { SaveButton } from './SaveButton';
import theme from '../../theme';
import { PLAYGROUND_GITHUB_ISSUES_URL } from 'util/globalConstants';

const styles: SXStyles = {
  root: {
    background: 'white',
    display: 'flex',
    gridArea: 'header',
    flex: '1 1 auto',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: '1em',
    paddingRight: '1em',
  },
  button: {
    border: '1px solid #DEE2E9',
    borderRadius: '8px',
    background: '#F6F7F9',
    '&:hover': {
      background: `${theme.colors.menuBg}`,
    },
  },
  link: {
    border: '1px solid #DEE2E9',
    background: '#F6F7F9',
    fontFamily: 'body',
    color: 'text',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    margin: 0,
    fontWeight: 500,
    paddingX: '0.65rem',
    paddingY: '0.5rem',
    borderRadius: '8px',
    fontSize: 4,
    '&:hover': {
      background: `${theme.colors.menuBg}`,
      borderColor: '#1E1FB9',
    },
  },
  topNavSection: {
    alignItems: 'center',
    minWidth: 210,
    gap: 4,
  },
  topNavProjectName: {
    alignItems: 'center',
  },
  externalNavLink: {
    display: 'flex',
    marginLeft: '0.25rem',
    textDecoration: 'none',
  },
  externalNavLinkFlow: {
    textDecoration: 'none',
  },
  topNavSectionRight: {
    flexDirection: 'row-reverse',
  },
};

const TopNav = () => {
  const { project, updateProject, toggleProjectsSidebar } = useProject();
  const [showExamples, setShowExamples] = useState(false);
  const [projectName, setProjectName] = useState(project.title);

  const onStartButtonClick = () => {
    setShowExamples(true);
    Mixpanel.track('Show examples', { meta: 'none' });
  };

  const onNameInputChange = (name: string) => {
    setProjectName(name);
  };

  const updateProjectName = (name: string) => {
    updateProject(name, project.description, project.readme);
  };

  useEffect(() => {
    setProjectName(project.title);
  }, [project?.id]);

  return (
    <Flex sx={styles.root}>
      <Flex sx={styles.topNavSection}>
        <Button
          onClick={toggleProjectsSidebar}
          variant="alternate"
          size="sm"
          inline={true}
        >
          <ProjectsIcon />
          Projects
        </Button>
      </Flex>
      <Flex sx={styles.topNavProjectName}>
        <NavInput
          type="text"
          value={projectName}
          onChange={(e: any) => {
            onNameInputChange(e.target.value);
          }}
          updateValue={updateProjectName}
        />
      </Flex>
      <Flex sx={{ ...styles.topNavSection, ...styles.topNavSectionRight }}>
        {!!project && (
          <>
            <Button
              sx={styles.button}
              onClick={() => onStartButtonClick()}
              variant="secondary"
              size="sm"
              inline={true}
            >
              <LearnCadenceIcon />
              Learn Cadence
            </Button>
            <Link
              sx={styles.link}
              rel="noreferrer"
              variant="secondary"
              title="Report a Bug"
              href={PLAYGROUND_GITHUB_ISSUES_URL}
              target="_blank"
            >
              <FlagIcon />
            </Link>
            <ShareMenu />
            <SaveButton />
          </>
        )}
      </Flex>
      <Examples
        visible={showExamples}
        triggerClose={() => setShowExamples(false)}
      />
    </Flex>
  );
};

export default TopNav;
