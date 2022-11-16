import { useQuery } from '@apollo/react-hooks';
import { GET_PROJECTS } from 'api/apollo/queries';
import { ProjectType } from 'src/types';

export default function useProjects() {
  const { loading, error, data } = useQuery<{ projects: ProjectType[] }>(
    GET_PROJECTS, { fetchPolicy: 'no-cache' },
  );

  const projects = data?.projects || [];

  return {
    projects,
    loading,
    error,
  };
}
