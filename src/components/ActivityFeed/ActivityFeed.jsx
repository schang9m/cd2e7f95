import React, { useState, useEffect } from 'react';
import '../../css/activityfeed.css';

const BASE_URL = 'https://aircall-api.onrender.com';

const ActivityFeed = ({ activeTab }) => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCallId, setExpandedCallId] = useState(null);

  useEffect(() => {
    fetchCalls();
  }, []);

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

  const handleArchiveToggle = async (callId, event) => {
    event.stopPropagation();
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

  const handleCallClick = (callId) => {
    setExpandedCallId(expandedCallId === callId ? null : callId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <div>Loading calls...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        Error loading calls: {error}
        <button onClick={fetchCalls}>Retry</button>
      </div>
    );
  }

  const filteredCalls = getFilteredCalls();

  return (
    <div className="activity-feed">
      <div className="calls-container">
        {filteredCalls.length === 0 ? (
          <div className="no-calls">
            No {activeTab} calls
            <button onClick={fetchCalls} className="refresh-button">
              Refresh
            </button>
          </div>
        ) : (
          filteredCalls.map((call) => (
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
                    <span className="time">{formatDate(call.created_at)}</span>
                    <span className="duration">Duration: {formatDuration(call.duration)}</span>
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
                <div className="call-details">
                  <div className="detail-row">
                    <span className="detail-label">To:</span>
                    <span className="detail-value">{call.to}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Via:</span>
                    <span className="detail-value">{call.via}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Direction:</span>
                    <span className="detail-value">{call.direction}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Call Type:</span>
                    <span className="detail-value">{call.call_type}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Duration:</span>
                    <span className="detail-value">{formatDuration(call.duration)}</span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
