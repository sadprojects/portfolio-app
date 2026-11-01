import { ThemeProvider } from '@contexts/ThemeContext';
import { render, screen } from '@testing-library/react';

import { MediaBlock } from './MediaBlock';

describe('MediaBlock', () => {
  it('renders the photo from public media with its caption', () => {
    render(
      <ThemeProvider>
        <MediaBlock
          image="castle.jpg"
          caption="Weekends are for the camera."
          alt="Castle"
          align="right"
        />
      </ThemeProvider>,
    );
    expect(screen.getByRole('img', { name: 'Castle' })).toHaveAttribute(
      'src',
      '/media/images/castle.jpg',
    );
    expect(
      screen.getByText('Weekends are for the camera.'),
    ).toBeInTheDocument();
  });
});
