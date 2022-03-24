import React, { createContext } from 'react';
import useLanguageServer from '../../hooks/useLanguageServer';
import { useProject } from 'providers/Project/projectHooks';

export const CadenceCheckerContext: React.Context<any> = createContext(null);

export default function CadenceChecker(props) {
  const project = useProject();

  // Connect project to cadence checker hook
  const cadenceChecker = useLanguageServer({
    getCode: (address) => {
      const { accounts } = project.project;

      const number = parseInt(address, 16);
      if (!number) {
        return;
      }

      const index = number - 1;
      if (index < 0 || index >= accounts.length) {
        return;
      }
      let code = accounts[index].draftCode;
      return code;
    },
  });

  // render
  const { children } = props;
  return (
    <CadenceCheckerContext.Provider value={cadenceChecker}>
      {children}
    </CadenceCheckerContext.Provider>
  );
}
