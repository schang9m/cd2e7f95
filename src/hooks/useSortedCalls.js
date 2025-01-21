import { useMemo } from 'react';

export const useSortedCalls = (calls) => {
  return useMemo(() => {
    // First, sort all calls by date (newest first)
    const sortedCalls = [...calls].sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });

    // Group calls by date
    const groupedCalls = sortedCalls.reduce((groups, call) => {
      const date = new Date(call.created_at);
      const dateKey = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(call);
      return groups;
    }, {});

    return groupedCalls;
  }, [calls]);
}; 