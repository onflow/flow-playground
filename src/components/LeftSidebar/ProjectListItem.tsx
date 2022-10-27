import ContractIcon from 'components/Icons/ContractIcon';
import ScriptIcon from 'components/Icons/ScriptIcon';
import TransactionIcon from 'components/Icons/TransactionIcon';
import { formatDistance } from 'date-fns';
import React from 'react';
import { MockProject } from 'src/types';
import { Box, Flex } from 'theme-ui';

type Props = {
  project: MockProject;
};

const ProjectListItem = ({ project }: Props) => {
  const timeAgo = formatDistance(new Date(project.lastSavedAt), new Date(), {
    addSuffix: true,
  });

  return (
    <Flex>
      <Box>{project.title}</Box>
      <Box>
        <ContractIcon />
        {project.contractTemplateCount}
      </Box>
      <Box>
        <TransactionIcon />
        {project.transactionTemplateCount}
      </Box>
      <Box>
        <ScriptIcon />
        {project.scriptTemplateCount}
      </Box>

      <Box>Last saved {timeAgo}</Box>
    </Flex>
  );
};

export default ProjectListItem;
