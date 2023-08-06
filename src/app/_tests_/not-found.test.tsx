import { render, screen } from '@testing-library/react';

import NotFound from '@/app/[lang]/not-found';

describe('Check for page not found', () => {
  it('renders a heading', () => {
    render(<NotFound slug={[]} lang='fr' />);

    const heading = screen.getByText(/not found/i);

    expect(heading).toBeInTheDocument();
  });
});
