import { render, screen } from '@testing-library/react';
import Info from '../components/Info';

// Mock @arwes/react Text component
jest.mock('@arwes/react', () => ({
  Text: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}));

describe('Info', () => {
  it('renders key-value pairs with humanized keys', () => {
    const mockData = {
      gender: 'male',
      eye_color: 'blue',
    };

    render(<Info data={mockData} />);

    // Check if keys are humanized and values rendered
    expect(screen.getByText(/gender/i)).toBeInTheDocument();
    expect(screen.getByText(/male/i)).toBeInTheDocument();

    expect(screen.getByText(/eye color/i)).toBeInTheDocument();
    expect(screen.getByText(/blue/i)).toBeInTheDocument();
  });

  it('renders nothing if data is empty', () => {
    const { container } = render(<Info data={{}} />);
    expect(container.textContent).toBe('');
  });
});
