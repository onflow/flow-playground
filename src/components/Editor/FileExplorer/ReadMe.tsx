import { navigate } from '@reach/router';
import { Text } from '@theme-ui/components';
import Button from 'components/Button';
import { useProject } from 'providers/Project/projectHooks';
import React from 'react';
import { isUUUID, LOCAL_PROJECT_ID } from 'util/url';
import ExplorerReadMeIcon from '../../Icons/ExplorerReadMeIcon';

const styles = {
  button: {
    paddingLeft: '0px',
  },
};
const ProjectInfo: React.FC = () => {
  const { project } = useProject();

  const projectPath = isUUUID(project.id) ? project.id : LOCAL_PROJECT_ID;

  return (
    <Button
      sx={styles.button}
      variant="secondary"
      onClick={() => {
        navigate(`/${projectPath}`);
      }}
    >
      <ExplorerReadMeIcon />
      <Text>ReadMe</Text>
    </Button>
  );
};

export default ProjectInfo;
