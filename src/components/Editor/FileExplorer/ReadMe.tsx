import React from 'react';
import { navigate } from '@reach/router';
import { useProject } from 'providers/Project/projectHooks';
import { isUUUID, LOCAL_PROJECT_ID } from 'util/url';
import { EntityType } from 'providers/Project';
import { Text, Flex } from '@theme-ui/components';
import ExplorerReadMeIcon from '../../Icons/ExplorerReadMeIcon'
import Button from 'components/Button';

const styles = {
  button: {
    paddingLeft: '0px'
  }
}
const ProjectInfo: React.FC = () => {
  const { project, active } = useProject();

  const projectPath = isUUUID(project.id) ? project.id : LOCAL_PROJECT_ID;

  return (
    <Button
      sx={styles.button}
      variant='secondary'
      selected={active.type === EntityType.Readme}
      onClick={() => {
        navigate(`/${projectPath}`);
      }}
    >
      <ExplorerReadMeIcon/>
      <Text>ReadMe</Text>
    </Button>
  );
};

export default ProjectInfo;
