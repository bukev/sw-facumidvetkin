'use client';

import type { ListResponse } from '@bukev/types';
import { useEffect, useLayoutEffect, useState } from 'react';

type useFetchListResult = {
  data: ListResponse['data'];
  loading: boolean;
  error: string | null;
  search: string;
  setSearch: (search: string) => void;
  page: number;
  setPage: (number: number) => void;
};

type endpoint = 'characters' | 'movies' | 'planets' | 'starships';

const useFetchList = (endpoint: endpoint): useFetchListResult => {
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState<ListResponse['data']>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useLayoutEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}`);
      if (debouncedSearch) url.searchParams.append('search', debouncedSearch);
      if (page) url.searchParams.append('page', String(page));

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch characters');

        const { data } = await res.json();
        setData(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message || 'Unknown error');
        } else {
          setError('Unknown error');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedSearch, page, endpoint]);

  return {
    data,
    loading,
    error,
    search,
    setSearch,
    page,
    setPage,
  };
};

export default useFetchList;
