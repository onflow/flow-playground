export const getStorageData = (state: string): any => {

  const storage: { [identifier: string]: string } = {};
  // console.log("ACCOUNTSTATE STORAGE:", storage);
  const paths: { [identifier: string]: string } = {};
  // console.log("ACCOUNTSTATE PATHS:", paths);

  const parsed = JSON.parse(state);
  // console.log("PARSED", parsed);

  for (let key in parsed) {
    if (!parsed.hasOwnProperty(key)) {
      continue;
    }

    const tuple = key.split('\u001f')
    const [domain, identifier] = tuple

    if (tuple.length === 2 && ['storage', 'public', 'private'].includes(domain)) {
      storage[identifier] = parsed[key];
      paths[identifier] = `/${domain}/${identifier}`
    }
  }

  return { storage, paths }
 
}