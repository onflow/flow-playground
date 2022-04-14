import styled from "@emotion/styled";
import {WithShowProps} from "containers/Editor/components";

export const ProjectInfoContainer = styled.div<WithShowProps>`
  display: ${({ show }) => (show ? 'block' : 'none')};
  margin: 0.2rem 1rem 0rem 1rem;
  min-width: 500px;
  margin-top: 1rem;
`;

export const ProjectHeading = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-top: 0.25rem;
  padding: 1rem;
`;

export const ProjectDescription = styled.div`
  font-size: 1.2rem;
  margin: 1rem;
  margin-top: 2rem;
  padding: 0.5rem;
  border-radius: 2px;
  font-style: italic;
`;

export const ReadmeHtmlContainer = styled.div`
  margin: 1rem;
  margin-top: 0rem;
`;