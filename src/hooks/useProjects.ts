import { useQuery } from '@apollo/react-hooks';
import { GET_PROJECTS } from 'api/apollo/queries';
import { ProjectListType } from 'src/types';

export default function useProjects() {
  const { loading, error, data } = useQuery<{ projectList: ProjectListType }>(
    GET_PROJECTS,
  );

  const projects = data?.projectList?.projects || [];

  return {
    projects,
    loading,
    error,
  };
}
