import styled from '@emotion/styled';

type SidebarItemToggleResourcesProps = {
  active: boolean;
};

export const SidebarItemToggleResources = styled.div<SidebarItemToggleResourcesProps>`
  -moz-appearance: none;
  -webkit-appearance: none;
  display: block;
  justify-self: flex-start;
  align-self: center;
  transition: color 0.2s;
  font-size: 14px;
  padding: 5px;
  margin-right: 0.5rem;
  margin-left: 0.1rem;
  border-radius: 5px;
  color: ${({ active }) => (active ? '#00ff76' : '#c1c1c1')};
  &:hover {
    color: ${({ active }) => (active ? 'white' : '#c1c1c1')};
    background: ${({ active }) => (active ? '#00ff76' : '#e6e6e6')};
  }
`;
