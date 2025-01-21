const BASE_URL = 'https://aircall-api.onrender.com';

export const useArchive = (calls, setCalls) => {
  const archiveCall = async (callId) => {
    try {
      await fetch(`${BASE_URL}/activities/${callId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_archived: !calls.find(call => call.id === callId).is_archived }),
      });
      setCalls(calls.map(call => 
        call.id === callId 
          ? { ...call, is_archived: !call.is_archived }
          : call
      ));
    } catch (error) {
      console.error('Error toggling archive status:', error);
    }
  };

  const archiveAll = async (filteredCalls) => {
    try {
      const callsToArchive = filteredCalls.filter(call => !call.is_archived);
      
      await Promise.all(callsToArchive.map(call => 
        fetch(`${BASE_URL}/activities/${call.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ is_archived: true }),
        })
      ));

      setCalls(calls.map(call => 
        callsToArchive.some(toArchive => toArchive.id === call.id)
          ? { ...call, is_archived: true }
          : call
      ));
    } catch (error) {
      console.error('Error archiving all calls:', error);
    }
  };

  const unarchiveAll = async (filteredCalls) => {
    try {
      const callsToUnarchive = filteredCalls.filter(call => call.is_archived);
      
      await Promise.all(callsToUnarchive.map(call => 
        fetch(`${BASE_URL}/activities/${call.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ is_archived: false }),
        })
      ));

      setCalls(calls.map(call => 
        callsToUnarchive.some(toUnarchive => toUnarchive.id === call.id)
          ? { ...call, is_archived: false }
          : call
      ));
    } catch (error) {
      console.error('Error unarchiving all calls:', error);
    }
  };

  return { archiveCall, archiveAll, unarchiveAll };
};
