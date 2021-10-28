// take in the state for an account, return data for resources explorer
export const getStorageData = (state: string = ''): any => {
  console.log("STORAGE DATA STATE:", state);
  

  if (state === '') {
    return { storage: {}, paths: {}, types: {}};
  };

  const storage: { [identifier: string]: string } = {};
  const paths: { [identifier: string]: string } = {};
  const types: { [identifier: string]: string } = {};
  const capabilities: { [identifier: string]: any } = {};

  const parsed = JSON.parse(state);

  for (let key in parsed) {
    if (!parsed.hasOwnProperty(key)) {
      continue;
    };

    const tuple = key.split('\u001f');
    const [domain, identifier] = tuple;

    if (tuple.length === 2 && ['storage', 'public', 'private'].includes(domain)) {
      storage[identifier] = parsed[key];
      const path = `/${domain}/${identifier}`;
      paths[identifier] = path;
      const storageItemType = parsed[key].value?.type || null;
      types[identifier] = storageItemType;

      if (storageItemType === "Link") {
        const borrowType = parsed[key].value.value.borrowType;
        const borrowTypeSplit = borrowType.split(".");
        const contractAcctId = borrowTypeSplit[1];
        const contractAddr = `0x0${contractAcctId.substr(contractAcctId.length - 1)}`;
        const contract = borrowTypeSplit[2];
        const resourcePart = borrowTypeSplit[3];
        const resource = resourcePart.split("{")[0];

        const rxp = /{([^}]+)}/g;

        const foundInterfacesRegEx = rxp.exec(borrowType)

        let interfaces: string[] = [];
        if (foundInterfacesRegEx) {
          const foundInterfaces = foundInterfacesRegEx[1];
          const fullyQualifiedInterfaces = foundInterfaces.split(',');
          fullyQualifiedInterfaces.map((fullyQualifiedInterface) => {
            interfaces.push(fullyQualifiedInterface.split(".")[2] + "." + fullyQualifiedInterface.split(".")[3]);
          });
        }

        capabilities[identifier] = {
          path: path,
          contractAddr: contractAddr,
          resourceContract: contract,
          resource: resource,
          contractImplementedInterfaces: interfaces
        };
      };
    };
  };

  return { storage, paths, types, capabilities }
 
}