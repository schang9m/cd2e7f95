import React, { useState, useEffect } from 'react';
import '../../css/activityfeed.css';

const BASE_URL = 'https://aircall-api.onrender.com';

const ActivityFeed = () => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCallId, setExpandedCallId] = useState(null);

  useEffect(() => {
    fetchCalls();
  }, []);

  const fetchCalls = async () => {
    try {
      const response = await fetch(`${BASE_URL}/activities`);
      const data = await response.json();
      const activeCalls = data.filter(call => !call.is_archived);
      setCalls(activeCalls);
    } catch (error) {
      console.error('Error fetching calls:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleArchiveCall = async (callId, event) => {
    event.stopPropagation(); // Prevent expansion when clicking archive button
    try {
      await fetch(`${BASE_URL}/activities/${callId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_archived: true }),
      });
      setCalls(calls.filter(call => call.id !== callId));
    } catch (error) {
      console.error('Error archiving call:', error);
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

  return (
    <div className="activity-feed">
      {calls.length === 0 ? (
        <div className="no-calls">No active calls</div>
      ) : (
        calls.map((call) => (
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
                onClick={(e) => handleArchiveCall(call.id, e)}
              >
                Archive
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
  );
};

export default ActivityFeed;
