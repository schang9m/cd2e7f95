import React, { useState, useEffect } from 'react';
import { useArchive } from '../../hooks/useArchive';
import { useFetchCalls } from '../../hooks/useFetchCalls';
import { useFilteredCalls } from '../../hooks/useFilteredCalls';
import { useSortedCalls } from '../../hooks/useSortedCalls';
import '../../css/activityfeed.css';
import CallItem from './CallItem.jsx';
import CallDetail from './CallDetail.jsx';
import { Spinner, Button } from 'react-bootstrap';

const ActivityFeed = ({ activeTab, setInboxCallCount }) => {
  const [expandedCallId, setExpandedCallId] = useState(null);
  const { calls, setCalls, loading, error, fetchCalls } = useFetchCalls();
  const { archiveCall, archiveAll, unarchiveAll } = useArchive(calls, setCalls);
  const sortedCalls = useSortedCalls(activeTab === 'archived' ? 
    calls.filter(call => call.is_archived) : 
    calls
  );
  const filteredCalls = useFilteredCalls(calls, activeTab);

  const handleExpand = (callId) => {
    setExpandedCallId(prevId => prevId === callId ? null : callId);
  };
  
  // Count inbox calls
  const inboxCallCount = calls.filter(call => !call.is_archived && (call.call_type === 'missed' || call.call_type === 'voicemail')).length;

  useEffect(() => {
    const inboxCount = calls.filter(call => !call.is_archived && (call.call_type === 'missed' || call.call_type === 'voicemail')).length;
    setInboxCallCount(inboxCount); // Update the inbox call count in App
  }, [calls, setInboxCallCount]); // Add calls as a dependency

  // Reset expandedCallId when activeTab changes
  useEffect(() => {
    setExpandedCallId(null);
  }, [activeTab]);

  // Archive single call
  const handleArchiveToggle = (callId, event) => {
    event.stopPropagation();
    archiveCall(callId);
  };

  // Archive all calls
  const handleArchiveAll = () => {
    archiveAll(filteredCalls);
  };

  // Unarchive all calls
  const handleUnarchiveAll = () => {
    unarchiveAll(filteredCalls);
  };

  if (loading) {
    return (
      <div>
        <Spinner animation="border" variant="success" 
        className="position-absolute top-50 start-50"
        />
      </div>
    );
  }  
  
  if (error) {
    return (
      <div className="error-message">
        Error loading calls: {error}
        <button onClick={fetchCalls}>Retry</button>
      </div>
    );
  }

  return (
    <div className="activity-feed" style={{ position: 'relative' }}>
      {activeTab !== 'archived' && filteredCalls.length > 0 && (
        <Button  
          variant="outline-primary"
          size="sm"
          onClick={handleArchiveAll}
        >
          <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '4px' }}>
            archive
          </span>
          Archive All
        </Button>
      )}

      {activeTab === 'archived' && filteredCalls.length > 0 && (
        <Button  
          variant="outline-warning"
          size="sm"
          onClick={handleUnarchiveAll}
        >
          <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '4px' }}>
            restore
          </span>
          Unarchive
        </Button>
      )}

      <div className="calls-container">
        {filteredCalls.length === 0 ? (
          <div className="no-calls">
            No {activeTab} calls 
            <Button variant="primary" size="sm" className="ms-2" onClick={fetchCalls}>
              Refresh
            </Button>
          </div>
        ) : (
          Object.entries(sortedCalls).map(([date, dateGroup]) => {
            const filteredGroup = dateGroup.filter(call => {
              if (activeTab === 'archived') {
                return call.is_archived;
              } else {
                if (activeTab === 'all') return !call.is_archived;
                return !call.is_archived && 
                  (call.call_type === 'missed' || call.call_type === 'voicemail');
              }
            });

            if (filteredGroup.length === 0) return null;

            return (
              <div key={date} className="date-group">
                <div className="date-header">{date}</div>
                {filteredGroup.map((call) => (
                  <div key={`${call.id}-${date}`} className="call-container">
                    <CallItem 
                      call={call}
                      onArchiveToggle={handleArchiveToggle}
                      onClick={() => handleExpand(call.id)} // Toggle expand/collapse on click
                      activeTab={activeTab}
                    />
                    {expandedCallId === call.id && (
                      <CallDetail call={call} onArchiveToggle={handleArchiveToggle} activeTab={activeTab} />
                    )}
                  </div>
                ))}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;