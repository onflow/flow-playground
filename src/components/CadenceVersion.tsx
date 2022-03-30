import React, { useState, useEffect, useContext } from 'react';
import { CadenceCheckerContext } from 'providers/CadenceChecker';

const API = process.env.PLAYGROUND_API;

export const Version = () => {
  const [version, setVersion] = useState('--');
  const { languageClient, languageServer } = useContext(CadenceCheckerContext);

  useEffect(() => {
    getCadenceVerion().then()
  }, []);

  const url = `${API}/utils/version`;
  const getCadenceVerion = async () => {
    const response = await fetch(url);
    const { version } = await response.json();
    setVersion(version);
  };

  const lsStatus = languageServer ? 'ON' : "OFF";
  const lcStatus = languageClient ? 'ON' : "OFF";

  return (
    <>
      <span>LS: {lsStatus}</span>
      <span>LC: {lcStatus}</span>
      <span>Cadence: {version}</span>
    </>
  );
};
