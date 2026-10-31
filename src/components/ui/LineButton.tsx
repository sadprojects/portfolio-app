import styled from 'styled-components';

export const LineButton = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0 0.55rem;
  background: none;
  border: 0;
  color: inherit;
  font: inherit;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  text-decoration: none;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background: currentColor;
    transform-origin: right;
    transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }

  &:hover::after,
  &:focus-visible::after {
    transform: scaleX(0);
    transform-origin: left;
  }

  &:disabled {
    opacity: 0.5;
    cursor: wait;
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 4px;
  }
`;
