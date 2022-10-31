import { useQuery } from '@apollo/react-hooks';
import { GET_PROJECTS } from 'api/apollo/queries';
import { MockProject } from 'src/types';

export default function useProjects() {
  const { loading, error, data } = useQuery<{ projects: MockProject[] }>(
    GET_PROJECTS,
  );

  const projects = data?.projects || [];

  return {
    projects,
    loading,
    error,
  };
}
