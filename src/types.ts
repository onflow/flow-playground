import { Scalars } from 'api/apollo/generated/graphql';
import { ThemeUICSSObject } from 'theme-ui';

export interface ChildProps {
  children: React.ReactNode;
}

export interface ChildPropsOptional {
  children?: React.ReactNode;
}

export type SXStyles = Record<string, ThemeUICSSObject>;

export type MockProject = {
  id: Scalars['UUID'];
  title: string;
  contractTemplateCount: number;
  transactionTemplateCount: number;
  scriptTemplateCount: number;
  lastSavedAt: string;
};
