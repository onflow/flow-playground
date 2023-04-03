import { Scalars } from 'api/apollo/generated/graphql';
import { ThemeUICSSObject } from 'theme-ui';

export interface ChildProps {
  children: React.ReactNode;
}

export interface ChildPropsOptional {
  children?: React.ReactNode;
}

export type SXStyles = Record<string, ThemeUICSSObject>;

export type ProjectListType = {
  projects: ProjectType[];
};

export type ProjectType = {
  id: Scalars['UUID'];
  title?: string;
  contractTemplates: Template[];
  transactionTemplates: Template[];
  scriptTemplates: Template[];
  updatedAt: string;
  persist: boolean;
};

export type Template = {
  id: string;
  script: string;
  title: string;
  index: number;
};
