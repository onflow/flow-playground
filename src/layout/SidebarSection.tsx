import styled from "@emotion/styled";

export const SidebarSection = styled.div`
  position:relative;

  & + & {
    margin-top: calc(2rem + 1px);
  }

  & + &:before {
    display:block;
    content: "";
    position:absolute;
    bottom: 100%;
    margin-bottom: 1rem;
    border-top: 1px solid var(--key);
    right:4rem;
    left:4rem;
  }
`;
