import React, { createContext } from 'react';
import { ChildProps } from 'src/types';
import useLanguageServer from '../../hooks/useLanguageServer';

export const CadenceCheckerContext: React.Context<any> = createContext(null);

export default function CadenceChecker(props: ChildProps) {
  // Connect project to cadence checker hook
  const cadenceChecker = useLanguageServer();

  // render
  const { children } = props;
  return (
    <CadenceCheckerContext.Provider value={cadenceChecker}>
      {children}
    </CadenceCheckerContext.Provider>
  );
}
