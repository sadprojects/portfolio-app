import { render, screen } from '@testing-library/react';

import { RevealText } from './RevealText';

describe('RevealText without animation', () => {
  it('renders the sentence as plain text', () => {
    render(<RevealText text="Plain words" animate={false} />);
    expect(screen.getByText('Plain words')).toBeInTheDocument();
    expect(screen.queryAllByText('Plain', { exact: false })).toHaveLength(1);
  });
});

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
