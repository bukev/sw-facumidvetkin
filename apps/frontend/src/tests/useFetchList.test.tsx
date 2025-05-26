import { renderHook, act, waitFor } from '@testing-library/react';
import useFetchList from '../hooks/useFetchList';

const mockResponse = {
    data: [
        { id: '1', name: 'Luke Skywalker' },
        { id: '2', name: 'Leia Organa' },
    ],
};

describe('useFetchList', () => {
    beforeEach(() => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        }) as jest.Mock;
    });

    it('fetches data successfully', async () => {
        const { result } = renderHook(() => useFetchList('characters'));

        expect(result.current.loading).toBe(true);

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.data).toEqual(mockResponse.data);
        expect(result.current.error).toBe(null);
    });

    it('handles search debounce', async () => {
        jest.useFakeTimers();

        const { result } = renderHook(() => useFetchList('characters'));

        act(() => {
            result.current.setSearch('Luke');
        });

        expect(result.current.search).toBe('Luke');

        jest.advanceTimersByTime(500);

        await waitFor(() => {
            const calls = (global.fetch as jest.Mock).mock.calls;
            const matchingCall = calls.find(([url]) => String(url).includes('search=Luke'));
            expect(matchingCall).toBeTruthy();
        });

        jest.useRealTimers();
    });

    it('handles fetch error', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
        });

        const { result } = renderHook(() => useFetchList('characters'));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBe('Failed to fetch characters');
        expect(result.current.data).toEqual([]);
    });
});
