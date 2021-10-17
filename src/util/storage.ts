export const getStorageData = (state: string): any => {

  const storage: { [identifier: string]: string } = {};
  const paths: { [identifier: string]: string } = {};
  const types: { [identifier: string]: string } = {};

  const parsed = JSON.parse(state);

  for (let key in parsed) {
    if (!parsed.hasOwnProperty(key)) {
      continue;
    }

    const tuple = key.split('\u001f')
    const [domain, identifier] = tuple

    if (tuple.length === 2 && ['storage', 'public', 'private'].includes(domain)) {
      storage[identifier] = parsed[key];
      paths[identifier] = `/${domain}/${identifier}`
      types[identifier] = parsed[key].value.type
    }
  }

  return { storage, paths, types }
 
}