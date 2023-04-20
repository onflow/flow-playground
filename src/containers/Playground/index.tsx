import { useApolloClient } from '@apollo/react-hooks';
import { navigate, RouteComponentProps } from '@reach/router';
import { Project } from 'api/apollo/generated/graphql';
import InformationalPopup from 'components/InformationalPopup';
import LeftSidebar from 'components/LeftSidebar';
import { AnimatePresence, motion, MotionStyle } from 'framer-motion';
import CadenceChecker from 'providers/CadenceChecker';
import { ProjectProvider } from 'providers/Project';
import useGetProject, { useProject } from 'providers/Project/projectHooks';
import React, { CSSProperties } from 'react';
import { Box, Button, Spinner, ThemeUICSSObject } from 'theme-ui';
import { userDataKeys, UserLocalStorage } from 'util/localstorage';
import useToggleExplorer from '../../hooks/useToggleExplorer';
import EditorLayout from './EditorLayout';

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
  isExplorerCollapsed: boolean,
): ThemeUICSSObject => {
  const fileExplorerWidth = isExplorerCollapsed ? '65px' : '244px';

  const styles: ThemeUICSSObject = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    height: '100vh',
    display: 'grid',
    gridTemplateAreas: "'header header' 'sidebar main'",
    gridTemplateColumns: `${fileExplorerWidth} auto`,
    gridTemplateRows: '50px auto',
    overflow: 'hidden',
    filter: showProjectsSidebar ? 'blur(1px)' : 'none',
  };

  return styles;
};

const leftSidebarTransition = { type: 'spring', bounce: 0.2, duration: 0.25 };

const Content = () => {
  const { showProjectsSidebar, toggleProjectsSidebar } = useProject();
  const { isExplorerCollapsed, toggleExplorer } = useToggleExplorer();

  const baseStyles = getBaseStyles(showProjectsSidebar, isExplorerCollapsed);
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
          <EditorLayout
            isExplorerCollapsed={isExplorerCollapsed}
            toggleExplorer={toggleExplorer}
          />
        </Box>
      </motion.div>
    </>
  );
};

interface PlaygroundProps extends RouteComponentProps {
  projectId?: string;
}

const Playground = ({ projectId }: PlaygroundProps) => {
  const client = useApolloClient();
  const userStorage = new UserLocalStorage();
  const userProjectId = userStorage.getDataByKey(userDataKeys.PROJECT_ID);
  const loadingProjectId = projectId || userProjectId;

  let project: Project;
  let isLocal: boolean;
  let isLoading: boolean;
  let startUpError = '';
  try {
    const {
      project: _project,
      isLocal: _isLocal,
      isLoading: _isLoading,
    } = useGetProject(client, loadingProjectId, null);
    project = _project;
    isLocal = _isLocal;
    isLoading = _isLoading;
  } catch (e) {
    console.error(e);
    startUpError = `${e.message}`;
  }

  if (isLoading || (isLoading === undefined && !startUpError)) {
    const sx = {
      margin: '10rem',
      width: '50%',
      height: '50%',
    };
    return (
      <Box sx={sx}>
        <Spinner />
      </Box>
    );
  }

  if (startUpError) {
    const startUpErrorMessage = {
      title: `Oops, There is an Issue!!!`,
      messages: [
        'Sorry about this',
        `Issue loading project: "${startUpError}"`,
        'Click <ok> to go to home page or last loaded project',
      ],
    };
    if (loadingProjectId === userProjectId) {
      // issue loading project clear last saved loaded project id
      userStorage.setData(userDataKeys.PROJECT_ID, null);
    }

    return (
      <InformationalPopup
        onClose={() => {
          navigate('/');
        }}
        visible={true}
        {...startUpErrorMessage}
      />
    );
  }

  if (!projectId && loadingProjectId) {
    // update location to reflect project loaded
    window.history.replaceState({}, '', loadingProjectId);
  }
  // project loaded successfully save as user's last project
  userStorage.setData(userDataKeys.PROJECT_ID, loadingProjectId);

  return (
    <ProjectProvider project={project} isLocal={isLocal} client={client}>
      <CadenceChecker>
        <Content />
      </CadenceChecker>
    </ProjectProvider>
  );
};

export default Playground;
