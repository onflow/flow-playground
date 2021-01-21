import styled from "@emotion/styled";
import theme from "../theme";

export const Heading = styled.div`
  padding: 1rem;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${theme.colors.heading};
  padding-bottom: calc(1rem - 3px);

  display: flex;
  justify-content: space-between;
  align-items: center;

  position: relative;

  &:after {
    opacity: 0.5;
    content: "";
    display: block;
    position: absolute;
    left: 1rem;
    bottom: calc(1rem - 3px - 6px);
    background: ${theme.colors.primary};
    height: 3px;
    width: 1rem;
    border-radius: 3px;
  }
`;


export const ResizeHeading = styled(Heading)`
	&:hover {
		cursor: ns-resize;
	}
`
