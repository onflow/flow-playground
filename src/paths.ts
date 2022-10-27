import { Scalars } from 'api/apollo/generated/graphql';

const paths = {
  projectPath: (id: Scalars['UUID']) => `/${id}`,
};

export default paths;
