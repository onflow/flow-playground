import Button from 'components/Button';
import { Separator } from 'components/Common';
import Examples from 'components/Examples';
import ExportPopup from 'components/ExportPopup';
import PlusIcon from 'components/Icons/PlusIcon';
import ProjectsIcon from 'components/Icons/ProjectsIcon';
import { AnimatedText } from 'containers/Playground/components';
import { useProject } from 'providers/Project/projectHooks';
import React, { useState } from 'react';
import { FaArrowAltCircleDown } from 'react-icons/fa';
import { SXStyles } from 'src/types';
import { Flex } from 'theme-ui';
import Mixpanel from 'util/mixpanel';
import ShareSaveButton from './ShareSaveButton';
import ExternalNavLinks from './TopNavButton';

const styles: SXStyles = {
  root: {
    background: 'background',
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
  const { project, createBlankProject, isSaving, toggleProjectsSidebar } =
    useProject();
  const [showExport, setShowExport] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

  const onStartButtonClick = () => {
    setShowExamples(true);
    Mixpanel.track('Show examples', { meta: 'none' });
  };

  return (
    <Flex sx={styles.root}>
      <Flex sx={styles.topNavSection}>
        <Button
          onClick={toggleProjectsSidebar}
          variant="alternate"
          size="sm"
          disabled={isSaving}
        >
          <ProjectsIcon />
          Projects
        </Button>
        <Button
          onClick={createBlankProject}
          variant="alternate"
          size="sm"
          disabled={isSaving}
        >
          <PlusIcon />
        </Button>
      </Flex>
      <Flex sx={styles.topNavSection}>
        <Button variant="secondary" onClick={onStartButtonClick}>
          <AnimatedText>Click here to start a tutorial</AnimatedText>
        </Button>
        <Separator />
        <ExternalNavLinks />
      </Flex>
      <Flex sx={{ ...styles.topNavSection, ...styles.topNavSectionRight }}>
        {!!project && (
          <>
            <Button
              onClick={() => setShowExport(true)}
              variant="alternate"
              size="sm"
            >
              Export
              <FaArrowAltCircleDown />
            </Button>
            <ShareSaveButton />
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
