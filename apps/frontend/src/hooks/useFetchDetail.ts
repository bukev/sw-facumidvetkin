'use client';

import { usePathname } from 'next/navigation';
import { useLayoutEffect, useState } from 'react';

type useFetchDetailResult<T> = {
  data: T | undefined;
  loading: boolean;
  error: string | null;
};

const useFetchDetail = <T>(): useFetchDetailResult<T> => {
  const path = usePathname();
  const [data, setData] = useState<T | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`);

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch characters');

        const data = await res.json();
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
  }, [path]);

  return {
    data,
    loading,
    error,
  };
};

export default useFetchDetail;
