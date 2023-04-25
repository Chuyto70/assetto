import { render, screen } from '@testing-library/react';

import NotFoundPage from '@/app/not-found';

describe('Check for page not found', () => {
  it('renders a heading', () => {
    render(<NotFoundPage />);

    const heading = screen.getByText(/not found/i);

    expect(heading).toBeInTheDocument();
  });
});
