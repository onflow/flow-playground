import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { ChildPropsOptional } from 'src/types';
import theme from '../theme';

interface ItemProps extends ChildPropsOptional {
  active?: boolean;
}

export const ProjectItem = styled.div<ItemProps>`
  --active-width: 6px;

  padding: 1rem;
  font-size: 1rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${theme.colors.heading};
  margin-top: 1rem;
  padding-bottom: calc(1rem - 3px);

  background: ${theme.colors.secondaryBackground};
  position: relative;

  ${(p) =>
    p.active &&
    css`
      background: rgba(255, 255, 255, 0.75);

      &:after {
        content: '';
        display: block;
        position: absolute;
        left: 0;
        top: 6px;
        bottom: 6px;
        width: 6px;
        border-radius: 0 3px 3px 0;
        background: ${theme.colors.primary};
      }
    `}

  cursor: pointer;
  &:hover,
  &:focus {
    background: rgba(255, 255, 255, 0.75);
  }
  text-decoration: none;
  display: flex;
  align-items: center;
  color: ${theme.colors.muted};
`;
