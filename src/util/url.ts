export const isUUUID = (projectId: string): boolean => {
  const regexp = /[\w\d]{8}-([\w\d]{4}-){3}[\w\d]{12}/;
  return regexp.test(projectId);
};

export const getParams = (url: string): any => {
  return url
    .slice(1)
    .split('&')
    .reduce((acc: any, item: string) => {
      const [key, value] = item.split('=');
      acc[key] = value;
      return acc;
    }, {});
};

export const getHashLineNumber = (): number[] => {
  const value = window.location.hash?.substring(1);
  if (!value) return [];

  const lineNumbers = value.substring(1);
  if (lineNumbers.includes('-')) {
    const [start, end] = lineNumbers.replace('L', '').split('-');
    return [Number(start), Number(end)];
  }
  return [Number(lineNumbers)];
};

export const scriptTypes = ['contract', 'tx', 'script'];

export const LOCAL_PROJECT_ID = 'local-project';
