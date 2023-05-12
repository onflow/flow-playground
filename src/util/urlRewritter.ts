import { Project } from 'api/apollo/generated/graphql';

export const FILE_TYPE_NAME: { [key: string]: string } = {
  contract: 'contract',
  transaction: 'tx',
  script: 'script',
};

export const UrlRewritterWithId = (
  project: Project,
  type: string,
  id: string,
): string => {
  const query = `?type=${type}&id=${id}`;
  // if parent then project was shared or is tutorial
  return project.parentId
    ? `/${project.parentId}${query}`
    : `/${project.id}${query}`;
};

export const UrlRewritter = (
  project: Project,
  type: string,
  index: number,
): string => {
  const fileType = FILE_TYPE_NAME[type];
  let value;
  switch (type) {
    case FILE_TYPE_NAME.contract: {
      value = project.contractTemplates[index];
      break;
    }
    case FILE_TYPE_NAME.transaction: {
      value = project.transactionTemplates[index];
      break;
    }
    default: {
      value = project.scriptTemplates[index];
    }
  }

  return `/${project.id}?type=${fileType}&id=${value.id}`;
};
