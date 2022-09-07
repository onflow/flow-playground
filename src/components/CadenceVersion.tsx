import React, { useState, useEffect, useContext } from 'react';
import { CadenceCheckerContext } from 'providers/CadenceChecker';
import styled from 'styled-components';
import theme from '../theme';
import * as Sentry from  "@sentry/react";

export const StatusContainer = styled.div`
  display: grid;
  justify-content: flex-end;
  grid-gap: 10px;
  position: relative;
  grid-template-columns: repeat(2, auto);
  align-items: center;
`;

export const DotBox = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  flex-direction: row;
  gap: 3px;
`;

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

const CadenceVersionMessage = styled.div`
  position: absolute;
  z-index: 13;
  line-height: 13px;
  top: 100%;
  background: white;
  padding: 1rem;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border-radius: 4px;
  margin-top: 0.5rem;
  display: none;
`;

const TwoToneWarningIcon = () => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    stroke-width="0"
    viewBox="0 0 1024 1024"
    width="1.125rem"
    height="1.125rem"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M955.7 856l-416-720c-6.2-10.7-16.9-16-27.7-16s-21.6 5.3-27.7 16l-416 720C56 877.4 71.4 904 96 904h832c24.6 0 40-26.6 27.7-48zm-783.5-27.9L512 239.9l339.8 588.2H172.2z"
      fill={theme.colors.warning}
    ></path>
    <path
      d="M172.2 828.1h679.6L512 239.9 172.2 828.1zM560 720a48.01 48.01 0 0 1-96 0 48.01 48.01 0 0 1 96 0zm-16-304v184c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V416c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8z"
      fill={theme.colors.warning}
    ></path>
    <path
      d="M464 720a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm16-304v184c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V416c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8z"
      fill="black"
    ></path>
  </svg>
);

const WarningIcon = styled(TwoToneWarningIcon)`
  position: relative;
  font-size: 20rem;
  margin-left: 0.5rem;
`;

const CadenceVersion = styled.div`
  display: flex;
  cursor: default;
  align-items: center;
  &:hover + div {
    display: block;
  }
`;

const API = process.env.PLAYGROUND_API;

export const Version = () => {
  const versionPlaceholder = '--'
  const [version, setVersion] = useState(versionPlaceholder);
  const { languageClient, languageServer } = useContext(CadenceCheckerContext);

  useEffect(() => {
    getCadenceVersion().then();
  }, []);

  const url = `${API}/utils/version`;
  const getCadenceVersion = async () => {
    let response;
    try {
      response = await fetch(url);
    } catch (err) {
      Sentry.withScope(function(scope) {
        scope.setFingerprint(['LanguageClient']);
        Sentry.captureException(err);
      })
      setVersion(versionPlaceholder);
      return;
    }
    const { version } = await response.json();
    setVersion(version);
  };

  const lsStatus = languageServer ? 'ON' : 'OFF';
  const lcStatus = languageClient ? 'ON' : 'OFF';

  const cadenceIsOutdated = false;

  return (
    <StatusContainer>
      <DotBox>
        <span title="Language Server Protocol">LSP:</span>
        <Dot active={lsStatus} title={`Language Server is ${lsStatus}`} />
        <Dot active={lcStatus} title={`Language Client is ${lsStatus}`} />
      </DotBox>
      <CadenceVersion>
        <span>Cadence: {version}</span>
        {cadenceIsOutdated ? <WarningIcon /> : undefined}
      </CadenceVersion>
      {cadenceIsOutdated ? (
        <CadenceVersionMessage>
          The playground is currently running an older version of Cadence and
          will be updated shortly
        </CadenceVersionMessage>
      ) : undefined}
    </StatusContainer>
  );
};
