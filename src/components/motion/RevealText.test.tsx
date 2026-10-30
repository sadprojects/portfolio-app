import { render, screen } from '@testing-library/react';
import { RevealText } from './RevealText';

describe('RevealText', () => {
  it('keeps the full sentence readable and renders one masked word per token', () => {
    const { container } = render(
      <RevealText tag="h2" text="I make software people enjoy" />,
    );
    expect(
      screen.getByRole('heading', { name: 'I make software people enjoy' }),
    ).toBeInTheDocument();
    expect(container.querySelectorAll('span[aria-hidden="true"]')).toHaveLength(
      5,
    );
  });
});
