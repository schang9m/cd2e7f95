import { useMemo } from 'react';

export const useSortedCalls = (calls) => {
  return useMemo(() => {
    // First, sort all calls by date (newest first)
    const sortedCalls = [...calls].sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });

    // Track processed call IDs to prevent duplication
    const processedIds = new Set();

    // Group calls by date first
    const groupedByDate = sortedCalls.reduce((groups, call) => {
      // Skip if we've already processed this call
      if (processedIds.has(call.id)) {
        return groups;
      }

      const date = new Date(call.created_at);
      const dateKey = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      // If the call is archived, treat it as an independent entry
      if (call.is_archived) {
        processedIds.add(call.id); // Mark as processed
        groups[dateKey].push(call); // Add to the group as an independent entry
        return groups;
      }

      // Find consecutive similar calls for non-archived calls
      const consecutiveCalls = [call];
      let nextIndex = sortedCalls.indexOf(call) + 1;
      
      while (nextIndex < sortedCalls.length) {
        const nextCall = sortedCalls[nextIndex];
        
        // Check if next call is from same number on same day
        const sameDay = new Date(nextCall.created_at).toLocaleDateString() === date.toLocaleDateString();
        const sameNumber = nextCall.from === call.from;
        const sameDirection = nextCall.direction === call.direction;
        const notVoicemail = nextCall.call_type !== 'voicemail' && call.call_type !== 'voicemail';
        
        // Break if not consecutive similar call
        if (!sameDay || !sameNumber || !sameDirection || !notVoicemail || processedIds.has(nextCall.id)) {
          break;
        }
        
        consecutiveCalls.push(nextCall);
        nextIndex++;
      }

      if (consecutiveCalls.length > 1) {
        // Mark all consecutive calls as processed
        consecutiveCalls.forEach(c => processedIds.add(c.id));
        
        // Create a group with the newest call as the main one
        const mainCall = { ...consecutiveCalls[0] };
        mainCall.repeatedCalls = consecutiveCalls;
        mainCall.repeatCount = consecutiveCalls.length;
        groups[dateKey].push(mainCall);
      } else {
        // Single call
        processedIds.add(call.id);
        groups[dateKey].push(call);
      }

      return groups;
    }, {});

    return groupedByDate;
  }, [calls]);
}; 