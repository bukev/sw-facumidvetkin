import { render, screen, fireEvent } from '@testing-library/react';
import Section from '../components/Section';
import type { ListResponse } from '@bukev/types';

// Mock the Loading component
jest.mock('../components/Loading', () => () => <div data-testid="loading">Loading...</div>);

// Mock the custom hook
jest.mock('../hooks/useFetchList', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import useFetchList from '../hooks/useFetchList';

// Dummy list item component for testing
const DummyItem = ({ item }: { item: ListResponse['data'][number] }) => (
  <div data-testid="item">{item.name}</div>
);

describe('Section', () => {
  const mockSetSearch = jest.fn();

  const mockData = [
    { id: '1', name: 'Luke Skywalker' },
    { id: '2', name: 'Leia Organa' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    (useFetchList as jest.Mock).mockReturnValue({
      data: [],
      loading: true,
      error: null,
      search: '',
      setSearch: mockSetSearch,
    });

    render(<Section entity="characters" ListItemComponent={DummyItem} />);

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('renders error state', () => {
    (useFetchList as jest.Mock).mockReturnValue({
      data: [],
      loading: false,
      error: 'Failed to fetch',
      search: '',
      setSearch: mockSetSearch,
    });

    render(<Section entity="movies" ListItemComponent={DummyItem} />);

    expect(screen.getByText(/Error: Failed to fetch/)).toBeInTheDocument();
  });

  it('renders list items and handles search input', () => {
    (useFetchList as jest.Mock).mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
      search: 'Lu',
      setSearch: mockSetSearch,
    });

    render(<Section entity="characters" ListItemComponent={DummyItem} />);

    expect(screen.getByText('characters')).toBeInTheDocument();
    expect(screen.getAllByTestId('item')).toHaveLength(2);

    const input = screen.getByPlaceholderText('Search characters...');
    fireEvent.change(input, { target: { value: 'Leia' } });

    expect(mockSetSearch).toHaveBeenCalledWith('Leia');
  });
});
