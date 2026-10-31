import styled, { css } from 'styled-components';

/** Kept in the accessibility tree, removed from the picture. */
export const srOnly = css`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
`;

export const VisuallyHidden = styled.span`
  ${srOnly}
`;

/** Hidden until it receives keyboard focus, then pinned over the header. */
export const SkipLink = styled.a`
  ${srOnly}

  &:focus {
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 1000;
    width: auto;
    height: auto;
    margin: 0;
    padding: 0.75rem 1rem;
    overflow: visible;
    clip: auto;
    white-space: normal;
    border-radius: 0.5rem;
    background: ${({ theme }) => theme.colors.foreground};
    color: ${({ theme }) => theme.colors.background};
    font-weight: 600;
    text-decoration: none;
  }
`;
