import React, { createContext } from 'react';
import useLanguageServer from '../../hooks/useLanguageServer';

export const CadenceCheckerContext: React.Context<any> = createContext(null);
type Prop = { children: any };
export default function CadenceChecker(props: Prop) {
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
