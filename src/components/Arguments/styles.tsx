import styled from 'styled-components'
import { FaCaretSquareDown } from 'react-icons/fa'
import theme from "../../theme";

interface HoverPanelProps {
  width?: string
}

export const HoverPanel = styled.div<HoverPanelProps>`
  width: ${({width = "300px"}) => width};
  padding: 20px;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.35), 0 6px 10px rgba(0, 0, 0, 0.05);
`;

export const Heading = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const Title = styled.div`
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  position: relative;
  color: #919191;

  &:after {
    opacity: 0.5;
    content: "";
    display: block;
    position: absolute;
    left: 0;
    background: ${theme.colors.primary};
    height: 3px;
    width: 1rem;
    bottom: -6px;
    border-radius: 3px;
  }
`;

export const Controls = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const Badge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #EE431E;
  color: #fff;
  font-weight: bold;
  font-size: 12px;
  
  --size: 16px;
  width: var(--size);
  height: var(--size);
  border-radius: var(--size);
  
  span {
    transform: translateY(1px);
  }
`;

export const List = styled.div`
  display: grid;
  grid-gap: 12px;
  grid-template-columns: 100%;
  margin-bottom: 20px;
`;

export const SignersContainer = styled.div`
  margin-bottom: 20px;
`;


interface ToggleProps {
  active: boolean
}
export const ToggleExpand = styled(FaCaretSquareDown).attrs({
  size: 18
})<ToggleProps>`
  cursor: pointer;
  opacity: 0.2;
  transform: ${({active}) => active ? 'rotate(180deg)' : 'rotate(0deg)'};
  margin-left: 5px;
`;