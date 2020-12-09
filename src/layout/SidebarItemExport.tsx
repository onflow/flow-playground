import styled from '@emotion/styled';

type SidebarItemExportProps = {
  active: boolean;
};

export const SidebarItemExport = styled.div<SidebarItemExportProps>`
  -moz-appearance: none;
  -webkit-appearance: none;
  display: block;
  justify-self: flex-end;
  transition: color 0.2s;
  margin-left: 0.5rem;
  font-size: 14px;
  padding: 5px;
  border-radius: 5px;
  color: ${({ active }) => (active ? '#00ff76' : '#c1c1c1')};
  &:hover {
    color: ${({ active }) => (active ? 'white' : '#c1c1c1')};
    background: ${({ active }) => (active ? '#00ff76' : '#e6e6e6')};
  }
`;
