import styled from '@emotion/styled';

type TabItemExportProps = {
  active: boolean;
};

export const TabItemExport = styled.div<TabItemExportProps>`
  -moz-appearance: none;
  -webkit-appearance: none;
  display: block;
  justify-self: flex-end;
  transition: color 0.2s;
  margin: 0;
  padding: 0;
  border-radius: 5px;
  color: ${({ active }) => (active ? '#00ff76' : '#c1c1c1')};

  font-size: 0.7rem;
  width: 0.7rem;
  height: 2rem;
  padding-top: 1px;
  line-height: 2rem;

  position: absolute;
  top: 0;
  right: 1.4rem;

  &:hover {
    color: ${({ active }) => (active ? '#c1c1c1' : '#444')};
  }
`;
