const CAPABILITY_TYPES = ['public', 'private'];

// take in the state for an account, return data for resources explorer
export const getStorageData = (state: string = ''): any => {
  if (state === '') {
    return { storage: {}, paths: {}, types: {} };
  }

  const storage: { [identifier: string]: string } = {};
  const paths: { [identifier: string]: string } = {};
  const types: { [identifier: string]: string } = {};

  const parsed = JSON.parse(state);

  for (let key in parsed) {
    // eslint-disable-next-line no-prototype-builtins
    if (!parsed.hasOwnProperty(key)) {
      continue;
    }

    const domain = key.toLowerCase();
    if (['Storage', 'Public', 'Private'].includes(key)) {
      Object.keys(parsed[key] || {}).forEach((identifier) => {
        storage[identifier] = parsed[key][identifier];

        const path = `/${domain}/${identifier}`;
        paths[identifier] = path;
        types[identifier] = CAPABILITY_TYPES.includes(domain)
          ? 'Capability'
          : 'Resource';
      });
    }
  }
  return { storage, paths, types };
};
