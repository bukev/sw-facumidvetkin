// src/hooks/useFetchDetail.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import useFetchDetail from '../hooks/useFetchDetail';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    usePathname: jest.fn(),
}));

const mockResponse = { id: '1', name: 'Luke Skywalker' };
const baseUrl = 'http://localhost:4000';

describe('useFetchDetail', () => {
    beforeEach(() => {
        // global.fetch = jest.fn().mockResolvedValue({
        //     ok: true,
        //     json: async () => mockResponse,
        // }) as jest.Mock;
        (global.fetch as jest.Mock) = jest.fn();
        process.env.NEXT_PUBLIC_API_BASE_URL = baseUrl;
    });

    it('fetches detail data successfully', async () => {
        const { usePathname } = require('next/navigation');
        usePathname.mockReturnValue('/characters/1');

        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        });

        const { result } = renderHook(() => useFetchDetail<typeof mockResponse>());

        expect(result.current.loading).toBe(true);

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.data).toEqual(mockResponse);
        expect(result.current.error).toBe(null);
        expect(global.fetch).toHaveBeenCalledWith(new URL(`${baseUrl}/characters/1`));
    });

    it('handles fetch error', async () => {
        const { usePathname } = require('next/navigation');
        usePathname.mockReturnValue('/characters/1');

        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
        });

        const { result } = renderHook(() => useFetchDetail());

        await waitFor(() => {
            expect(result.current.error).toBe('Failed to fetch characters');
            expect(result.current.data).toBe(undefined);
            expect(result.current.loading).toBe(false);
        });

    });
});
