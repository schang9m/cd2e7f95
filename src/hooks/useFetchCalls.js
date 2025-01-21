import { useState, useEffect } from 'react';

const BASE_URL = 'https://aircall-api.onrender.com';

export const useFetchCalls = () => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCalls = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${BASE_URL}/activities`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Data is not an array');
      }

      setCalls(data);
    } catch (error) {
      console.error('Error fetching calls:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalls();
  }, []);

  return { calls, setCalls, loading, error, fetchCalls };
}; 