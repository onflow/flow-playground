import Button from 'components/Button';
import Examples from 'components/Examples';
import { useProject } from 'providers/Project/projectHooks';
import React, { useEffect, useState } from 'react';
import { SXStyles } from 'src/types';
import { Flex } from 'theme-ui';
import Mixpanel from 'util/mixpanel';
import ProjectsIcon from 'components/Icons/ProjectsIcon';
import LearnCadenceIcon from 'components/Icons/LearnCadenceIcon';
import NavInput from './NavInput';
import { ShareMenu } from './ShareMenu';
import { SaveButton } from './SaveButton';
import theme from '../../theme';
import {
  CADENCE_DOCS_URL,
  PLAYGROUND_GITHUB_ISSUES_URL,
} from 'util/globalConstants';
import { ExportButton } from './ExportButton';
import GithubIcon from 'components/Icons/GithubIcon';
import { NavButtonLink } from './NavButtonLink';
import { IconCadence } from 'components/Icons/CadenceIcon';
import VersionInfoPopup from 'components/VersionInfoPopup';
import { ThemeToggle } from './ThemeToggle';

const styles: SXStyles = {
  root: {
    display: 'flex',
    gridArea: 'header',
    flex: '1 1 auto',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: '1em',
    paddingRight: '1em',
    background: `${theme.colors.primary}`,
  },
  mobile: {
    background: `${theme.colors.secondaryBackground}`,
    display: 'flex',
    gridArea: 'header',
    flex: '1 1 auto',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '1rem',
  },
  link: {
    border: `1px solid ${theme.colors.border}`,
    background: `${theme.colors.background}`,
    fontFamily: 'body',
    color: 'text',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    margin: 0,
    fontWeight: 500,
    padding: '0.25rem ',
    borderRadius: '8px',
    fontSize: 4,
    '&:hover': {
      background: `${theme.colors.active}`,
      borderColor: `${theme.colors.accent}`,
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

  if (theme.isMobile) {
    return (
      <Flex sx={styles.mobile}>
        <NavInput
          type="text"
          value={projectName}
          onChange={() => {}}
          updateValue={() => {}}
        />
      </Flex>
    );
  }
  return (
    <Flex sx={styles.root}>
      <Flex sx={styles.topNavSection}>
        <Button
          onClick={toggleProjectsSidebar}
          variant="secondary"
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
            <ThemeToggle />
            <VersionInfoPopup />
            <Button
              onClick={() => onStartButtonClick()}
              variant="secondary"
              size="sm"
              inline={true}
            >
              <LearnCadenceIcon />
              Learn Cadence
            </Button>
            <NavButtonLink
              title="Report a Bug"
              href={PLAYGROUND_GITHUB_ISSUES_URL}
            >
              <GithubIcon />
            </NavButtonLink>
            <NavButtonLink title="Cadence Docs" href={CADENCE_DOCS_URL}>
              <IconCadence size="22px" title="Cadence Language Reference" />
            </NavButtonLink>
            <ShareMenu />
            <ExportButton />
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
