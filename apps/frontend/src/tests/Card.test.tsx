// Card.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Card from '../components/Card';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('@arwes/react-frames', () => ({
  FrameNefrex: ({ elementRef }: any) => <svg ref={elementRef} data-testid="frame" />,
  useFrameAssembler: () => {},
}));

jest.mock('@arwes/react', () => ({
  Animated: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
  Animator: ({ children }: any) => <div>{children}</div>,
  Text: ({ children }: any) => <span>{children}</span>,
  useBleeps: () => ({
    click: { play: jest.fn() },
    hover: { play: jest.fn() },
  }),
}));

describe('Card', () => {
  it('renders title and subtitle correctly', () => {
    render(<Card id="1" title="Luke Skywalker" subtitle="Tatooine" type="characters" />);

    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    expect(screen.getByText('Tatooine')).toBeInTheDocument();
  });

  it('navigates on click', () => {
    const mockPush = jest.fn();
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue({ push: mockPush });

    render(<Card id="1" title="Luke Skywalker" type="characters" />);

    fireEvent.click(screen.getByText('Luke Skywalker'));

    expect(mockPush).toHaveBeenCalledWith('/characters/1');
  });
});
