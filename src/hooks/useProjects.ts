import { useQuery } from '@apollo/react-hooks';
import { GET_PROJECTS } from 'api/apollo/queries';
import { ProjectType } from 'src/types';

export default function useProjects() {

  const reload = async () => {
    const { loading, error, data } = useQuery<{ projects: ProjectType[] }>(
      GET_PROJECTS, { fetchPolicy: 'network-only' },
    );
    console.log('loading', loading, error, data)      
  }

  console.log('calling get projects', GET_PROJECTS)
  const { loading, error, data } = useQuery<{ projects: ProjectType[] }>(
    GET_PROJECTS, { fetchPolicy: 'network-only' },
  );

  console.log('projects', loading, error, data, )

  const projects = data?.projects || [];

  return {
    projects,
    loading,
    error,
    reload,
  };
}
