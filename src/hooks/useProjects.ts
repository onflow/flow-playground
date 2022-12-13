import { useQuery } from '@apollo/react-hooks';
import { GET_PROJECTS } from 'api/apollo/queries';
import { ProjectListType } from 'src/types';

export default function useProjects() {
  // TODO: figure out how to update project list in cache when project is added, deleted or name changed
  const { loading, error, data, refetch } = useQuery<{
    projectList: ProjectListType;
  }>(GET_PROJECTS, { fetchPolicy: 'no-cache' });

  const projects = data?.projectList?.projects || [];

  return {
    projects,
    loading,
    error,
    refetch,
  };
}
