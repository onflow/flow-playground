import { ThemeUICSSObject } from 'theme-ui';

export interface ChildProps {
  children: React.ReactNode;
}

export interface ChildPropsOptional {
  children?: React.ReactNode;
}

export type SXStyles = Record<string, ThemeUICSSObject>;
