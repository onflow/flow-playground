import React from 'react';
import theme from '../../theme';
import { SXStyles } from 'src/types';
import { Link } from 'theme-ui';

const styles: SXStyles = {
  link: {
    border: '1px solid #DEE2E9',
    background: `${theme.colors.background}`,
    fontFamily: 'body',
    color: 'text',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    margin: 0,
    fontWeight: 500,
    padding: '0.25rem ',
    borderRadius: '8px',
    fontSize: 4,
    '&:hover': {
      background: `${theme.colors.menuBg}`,
      borderColor: '#1E1FB9',
    },
  },
};

interface NavLinkProps {
  href: string;
  title?: string;
  children: React.ReactNode;
}

export const NavButtonLink = ({ href, title, children }: NavLinkProps) => {
  return (
    <Link
      sx={styles.link}
      rel="noreferrer"
      variant="secondary"
      title={title}
      href={href}
      target="_blank"
    >
      {children}
    </Link>
  );
};
