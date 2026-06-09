import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Park } from '../types';

export const useParks = () => {
  const [parks, setParks] = useState<Park[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchParks = async () => {
    try {
      const { data } = await api.get('/parks');
      setParks(data.data);
    } catch (error) {
      console.error('Failed to fetch parks', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParks();
  }, []);

  return { parks, loading, refetch: fetchParks };
};
