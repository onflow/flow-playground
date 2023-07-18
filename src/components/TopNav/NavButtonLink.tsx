import React from 'react';
import { Link } from 'theme-ui';

interface NavLinkProps {
  href: string;
  title?: string;
  children: React.ReactNode;
}

export const NavButtonLink = ({ href, title, children }: NavLinkProps) => {
  return (
    <Link
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
