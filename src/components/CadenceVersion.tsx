import React, { useState, useEffect } from 'react';

const API = process.env.PLAYGROUND_API;

export const Version = () => {
  const [version, setVersion] = useState('--');

  useEffect(() => {
    getCadenceVerion();
  }, []);

  const url = `${API}/utils/version`;
  const getCadenceVerion = async () => {
    const response = await fetch(url);
    const { version } = await response.json();
    setVersion(version);
  };

  return(
    <span>Cadence: {version}</span>
  )
};
