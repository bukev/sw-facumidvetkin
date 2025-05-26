import { render, screen } from '@testing-library/react';
import RelatedEntities from '../components/RelatedEntities';

jest.mock('../components/Card', () => ({
  __esModule: true,
  default: ({ id, title }: any) => <div data-testid="card">{title ?? id}</div>,
}));

describe('RelatedEntities', () => {
  const mockData = [
    { id: '1', name: 'Luke Skywalker' },
    { id: '2', name: 'Leia Organa' },
  ];

  it('renders with custom title and mapped cards', () => {
    render(<RelatedEntities type="characters" data={mockData} title="Heroes" />);

    expect(screen.getByText('Heroes')).toBeInTheDocument();
    expect(screen.getAllByTestId('card')).toHaveLength(2);
    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    expect(screen.getByText('Leia Organa')).toBeInTheDocument();
  });

  it('renders default type as title when title is not provided', () => {
    render(<RelatedEntities type="planets" data={[]} />);
    expect(screen.getByText('planets')).toBeInTheDocument();
  });
});
