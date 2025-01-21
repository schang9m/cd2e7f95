import React, { useState } from 'react';
import { useArchive } from '../../hooks/useArchive';
import { useFetchCalls } from '../../hooks/useFetchCalls';
import { useFilteredCalls } from '../../hooks/useFilteredCalls';
import { useSortedCalls } from '../../hooks/useSortedCalls';
import '../../css/activityfeed.css';
import CallDetail from './CallDetail.jsx';

const ActivityFeed = ({ activeTab }) => {
  const [expandedCallId, setExpandedCallId] = useState(null);
  const { calls, setCalls, loading, error, fetchCalls } = useFetchCalls();
  const { archiveCall, archiveAll, unarchiveAll } = useArchive(calls, setCalls);
  const sortedCalls = useSortedCalls(calls);
  const filteredCalls = useFilteredCalls(calls, activeTab);

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

  // Call detail
  const handleCallClick = (callId) => {
    setExpandedCallId(expandedCallId === callId ? null : callId);
  };


  // Format duration
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) return <div>Loading calls...</div>;
  if (error) {
    return (
      <div className="error-message">
        Error loading calls: {error}
        <button onClick={fetchCalls}>Retry</button>
      </div>
    );
  }

  return (
    <div className="activity-feed">
      {activeTab !== 'archived' && filteredCalls.length > 0 && (
        <button 
          className="archive-all-button"
          onClick={handleArchiveAll}
        >
          Archive All
        </button>
      )}
      {activeTab === 'archived' && filteredCalls.length > 0 && (
        <button 
          className="unarchive-all-button"
          onClick={handleUnarchiveAll}
        >
          Unarchive All
        </button>
      )}
      <div className="calls-container">
        {filteredCalls.length === 0 ? (
          <div className="no-calls">
            No {activeTab} calls
            <button onClick={fetchCalls} className="refresh-button">
              Refresh
            </button>
          </div>
        ) : (
          Object.entries(sortedCalls).map(([date, dateGroup]) => {
            const filteredGroup = dateGroup.filter(call => {
              if (activeTab === 'archived') return call.is_archived;
              if (activeTab === 'all') return !call.is_archived;
              return !call.is_archived && 
                (call.call_type === 'missed' || call.call_type === 'voicemail');
            });

            // Only render the date group if it has calls after filtering
            if (filteredGroup.length === 0) return null;

            return (
              <div key={date} className="date-group">
                <div className="date-header">{date}</div>
                {filteredGroup.map((call) => (
                  <div key={call.id} className="call-container">
                    <div 
                      className={`call-item ${call.call_type}`}
                      onClick={() => handleCallClick(call.id)}
                    >
                      <div className="call-direction">
                        {call.direction === 'inbound' ? '←' : '→'}
                      </div>
                      <div className="call-info">
                        <div className="call-primary">
                          <span className="caller">{call.from}</span>
                          <span className="call-type">{call.call_type}</span>
                        </div>
                        <div className="call-secondary">
                          <span className="time">
                            {new Date(call.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          <span className="duration">
                            Duration: {formatDuration(call.duration)}
                          </span>
                        </div>
                      </div>
                      <button 
                        className="archive-button"
                        onClick={(e) => handleArchiveToggle(call.id, e)}
                      >
                        {call.is_archived ? 'Unarchive' : 'Archive'}
                      </button>
                    </div>
                    {expandedCallId === call.id && (
                      <CallDetail call={call} />
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
