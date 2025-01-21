export const useFilteredCalls = (calls, activeTab) => {
  const getFilteredCalls = () => {
    switch (activeTab) {
      case 'inbox':
        return calls.filter(call => 
          !call.is_archived && 
          (call.call_type === 'missed' || call.call_type === 'voicemail')
        );
      case 'all':
        return calls.filter(call => !call.is_archived);
      case 'archived':
        return calls.filter(call => call.is_archived);
      default:
        return [];
    }
  };

  return getFilteredCalls();
}; 