import React, { useState, useEffect, useContext } from 'react';
import { CadenceCheckerContext } from 'providers/CadenceChecker';
import styled from 'styled-components';

export const StatusContainer = styled.div`
  display: grid;
  justify-content: flex-end;
  grid-gap: 10px;
  grid-template-columns: repeat(2, auto);
  align-items: center;
`;

export const DotBox = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  flex-direction: row;
  gap: 3px;
`

interface DotType {
  active: string;
}
export const Dot = styled.div<DotType>`
  --size: 8px;
  display: block;
  width: var(--size);
  height: var(--size);
  border-radius: var(--size);
  background-color: ${({ active = false }) => {
    return active === 'OFF' ? '#ee431e' : '#00ff76';
  }};
`;

const API = process.env.PLAYGROUND_API;

export const Version = () => {
  const [version, setVersion] = useState('--');
  const { languageClient, languageServer } = useContext(CadenceCheckerContext);

  useEffect(() => {
    getCadenceVersion().then();
  }, []);

  const url = `${API}/utils/version`;
  const getCadenceVersion = async () => {
    const response = await fetch(url);
    const { version } = await response.json();
    setVersion(version);
  };

  const lsStatus = languageServer ? 'ON' : 'OFF';
  const lcStatus = languageClient ? 'ON' : 'OFF';

  return (
    <StatusContainer>
      <DotBox>
        <span title="Language Server Protocol">LSP:</span>
        <Dot active={lsStatus} title={`Language Server is ${lsStatus}`} />
        <Dot active={lcStatus} title={`Language Client is ${lsStatus}`} />
      </DotBox>
      <span>Cadence: {version}</span>
    </StatusContainer>
  );
};
