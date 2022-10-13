import { IconCadence } from 'components/Icons';
import React from 'react';
import { FaDiscord, FaTwitter } from 'react-icons/fa';
import { ChildProps, SXStyles } from 'src/types';
import { Link } from 'theme-ui';

const styles: SXStyles = {
  externalNavLink: {
    display: 'flex',
    marginLeft: '0.25rem',
    textDecoration: 'none',
  },
  externalNavLinkFlow: {
    textDecoration: 'none',
  },
};

interface NavButtonProps extends ChildProps {
  href: string;
  title?: string;
}

const NavButton = ({ href, title, children }: NavButtonProps) => {
  return (
    <Link
      sx={styles.externalNavLink}
      variant="buttonSecondary"
      href={href}
      title={title}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </Link>
  );
};

// Nav links will be moved to the tutorial sidebar in v2
const ExternalNavLinks = () => {
  return (
    <>
      <NavButton href="https://docs.onflow.org">Flow Docs</NavButton>
      <NavButton
        href="https://docs.onflow.org/cadence/language"
        title="Cadence"
      >
        <IconCadence size="22px" title="Cadence Language Reference" />
      </NavButton>
      <NavButton
        title="Flow on Twitter"
        href="https://twitter.com/flow_blockchain"
      >
        <FaTwitter size="20px" />
      </NavButton>
      <NavButton title="Flow on Discord" href="https://discord.gg/2h6hgBF">
        <FaDiscord size="20px" />
      </NavButton>
    </>
  );
};

export default ExternalNavLinks;
