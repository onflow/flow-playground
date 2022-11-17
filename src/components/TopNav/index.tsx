import Button from 'components/Button';
import { Separator } from 'components/Common';
import Examples from 'components/Examples';
import ExportPopup from 'components/ExportPopup';
import ProjectsIcon from 'components/Icons/ProjectsIcon';
import NavInput from './NavInput';
import NewProjectButton from 'components/NewProjectButton';
import { AnimatedText } from 'containers/Playground/components';
import { useProject } from 'providers/Project/projectHooks';
import React, { useEffect, useState } from 'react';
import { FaArrowAltCircleDown } from 'react-icons/fa';
import useKeyPress from '../../hooks/useKeyPress';
import { SXStyles } from 'src/types';
import { Button as ThemeUIButton, Flex } from 'theme-ui';
import Mixpanel from 'util/mixpanel';
import ShareSaveButton from './ShareSaveButton';
import ExternalNavLinks from './TopNavButton';
import LearnCadenceIcon from 'components/Icons/LearnCadenceIcon';
import { ShareMenu } from './ShareMenu';

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
  input: {
    width: '100%',
    fontSize: '15px',
    color: '#000000',
    fontWeight: '450',
    textOverflow: 'ellipsis',
    border: 'none',
    pointerEvents: 'initial',
    background: '#DEE2E9',
    backgroundColor: '#DEE2E9',
    fontFamily: 'Termina',
    textAlign: 'center',
    borderRadius: '0px',
  },
  inputReadOnly: {
    width: '100%',
    fontSize: '15px',
    border: 'none',
    color: 'inherit',
    fontWeight: '450',
    textOverflow: 'ellipsis',
    background: 'none',
    pointerEvents: 'none',
    fontFamily: 'Termina',
    textAlign: 'center',
    borderRadius: '0px',
  },
};

const TopNav = () => {
  const defaultProjectName = 'Untitled Project';
  const { project, updateProject, toggleProjectsSidebar } = useProject();
  const [showExport, setShowExport] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [editing, setEditing] = useState(false);
  const [projectName, setProjectName] = useState(defaultProjectName);
  const enterPressed = useKeyPress('Enter');
  const escapePressed = useKeyPress('Escape');
  const inputStyles = editing ? styles.input : styles.inputReadOnly;

  const onStartButtonClick = () => {
    setShowExamples(true);
    Mixpanel.track('Show examples', { meta: 'none' });
  };

  const onNameInputChange = (name: string) => {
    setProjectName(name);
  };

  const toggleEditing = () => {
    const toggledEditing = !editing;
    return setEditing(toggledEditing);
  };

  useEffect(() => {
    if (enterPressed || escapePressed) {
      updateProject(projectName, project.description, project.readme);
      setEditing(false);
    }
  }, [enterPressed, escapePressed]);

  return (
    <Flex sx={styles.root}>
      <Flex sx={styles.topNavSection}>
        <Button
          onClick={toggleProjectsSidebar}
          variant="secondaryLegacy"
          size="sm"
          inline={true}
        >
          <ProjectsIcon />
          Projects
        </Button>
        <NewProjectButton size="sm" variant="secondaryLegacy" inline={true} />
      </Flex>
      <Flex sx={styles.topNavProjectName} onClick={() => toggleEditing()}>
        <NavInput
          editing={editing}
          sx={inputStyles}
          type="text"
          defaultValue={defaultProjectName}
          toggleEditing={toggleEditing}
          onChange={(e: any) => {
            onNameInputChange(e.target.value);
          }}
          updateProject={updateProject}
        />
        {/* <ThemeUIButton variant="secondaryLegacy" onClick={onStartButtonClick}>
          <AnimatedText>Click here to start a tutorial</AnimatedText>
        </ThemeUIButton>
        <Separator />
        <ExternalNavLinks /> */}
      </Flex>
      <Flex sx={{ ...styles.topNavSection, ...styles.topNavSectionRight }}>
        {!!project && (
          <>
            <Button
              onClick={() => onStartButtonClick()}
              variant="explorer"
              size="sm"
              inline={true}
            >
              <LearnCadenceIcon />
              Learn Cadence
            </Button>
            <ShareMenu />
          </>
        )}
      </Flex>
      <Examples
        visible={showExamples}
        triggerClose={() => setShowExamples(false)}
      />
      <ExportPopup
        visible={showExport}
        projectTitle={project.title}
        triggerClose={() => setShowExport(false)}
      />
    </Flex>
  );
};

export default TopNav;
