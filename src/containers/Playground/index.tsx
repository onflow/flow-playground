import { Redirect } from '@reach/router';
import React, { CSSProperties } from 'react';

import { RouteComponentProps } from '@reach/router';
import CadenceChecker from 'providers/CadenceChecker';
import { ProjectProvider } from 'providers/Project';

import LeftSidebar from 'components/LeftSidebar';
import { AnimatePresence, motion, MotionStyle } from 'framer-motion';
import { useProject } from 'providers/Project/projectHooks';
import { Box, Button, ThemeUICSSObject } from 'theme-ui';
import { LOCAL_PROJECT_ID } from 'util/url';
import EditorLayout from './layout';

export const LEFT_SIDEBAR_WIDTH = 350;

const editorContainerStyle: MotionStyle = {
  position: 'fixed',
  width: '100vw',
  height: '100vh',
  top: 0,
  left: 0,
};

const closeLeftSidebarButtonStyle: CSSProperties = {
  position: 'absolute',
  width: '100vw',
  height: '100vh',
  right: 0,
  top: 0,
  background: 'white',
  opacity: 0.5,
  padding: 0,
  zIndex: 10,
};

const getBaseStyles = (
  showProjectsSidebar: boolean,
  showFileExplorer: boolean,
): ThemeUICSSObject => {
  const fileExplorerWidth = showFileExplorer ? '244px' : '65px';

  return {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    height: '100vh',
    display: 'grid',
    'grid-gap': '1px 1px',
    'grid-template-areas': "'header header' 'sidebar main'",
    'grid-template-columns': `${fileExplorerWidth} auto`,
    'grid-template-rows': '50px auto',
    background: 'greyBorder',
    overflow: 'hidden',
    filter: showProjectsSidebar ? 'blur(1px)' : 'none',
  };
};

const leftSidebarTransition = { type: 'spring', bounce: 0.2, duration: 0.25 };

const Content = () => {
  const { showProjectsSidebar, toggleProjectsSidebar } = useProject();
  const baseStyles = getBaseStyles(showProjectsSidebar, true);
  return (
    <>
      <AnimatePresence>
        {showProjectsSidebar && (
          <motion.div
            initial={{
              width: LEFT_SIDEBAR_WIDTH,
              height: '100vh',
              overflowY: 'auto',
              zIndex: 10,
              position: 'fixed',
              bottom: 0,
              top: 0,
              left: -LEFT_SIDEBAR_WIDTH,
            }}
            animate={{
              left: 0,
            }}
            exit={{ left: -LEFT_SIDEBAR_WIDTH }}
            transition={leftSidebarTransition}
          >
            <LeftSidebar />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        style={editorContainerStyle}
        animate={{ left: showProjectsSidebar ? LEFT_SIDEBAR_WIDTH : 0 }}
        transition={leftSidebarTransition}
      >
        {showProjectsSidebar && (
          <Button
            type="button"
            style={closeLeftSidebarButtonStyle}
            onClick={toggleProjectsSidebar}
            title="Close projects"
          />
        )}
        <Box sx={baseStyles}>
          <EditorLayout />
        </Box>
      </motion.div>
    </>
  );
};

interface PlaygroundProps extends RouteComponentProps {
  projectId?: string;
}

const Playground = ({ projectId }: PlaygroundProps) => {
  const isLocalProject = projectId === LOCAL_PROJECT_ID;

  if (!projectId) {
    return <Redirect noThrow to={`/${LOCAL_PROJECT_ID}`} />;
  }

  return (
    <ProjectProvider urlProjectId={isLocalProject ? null : projectId}>
      <CadenceChecker>
        <Content />
      </CadenceChecker>
    </ProjectProvider>
  );
};

export default Playground;
