import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { ChildPropsOptional } from 'src/types';
import theme from '../theme';

interface ItemProps extends ChildPropsOptional {
  active?: boolean;
}

export const SidebarItem = styled.div<ItemProps>`
  --active-width: 6px;

  font-size: 1rem;
  padding-left: 1rem;
  padding-right: 0.25rem;
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
  background: var(--bg);
  position: relative;

  ${(p) =>
    p.active &&
    css`
      background: rgba(255, 255, 255, 0.75);
    `}

  cursor: pointer;
  &:hover,
  &:focus {
    background: rgba(255, 255, 255, 0.75);
  }
  text-decoration: none;
  display: flex;
  align-items: center;
  font-weight: bold;
  color: ${theme.colors.muted};

  & .avatar {
    margin-right: 1rem;
    width: 35px;
    height: 35px;
    border-radius: 0 0 20px 20px;
  }

  & small,
  & .mute {
    font-weight: normal;
    color: ${theme.colors.heading};
    font-size: 13px;
  }
`;
