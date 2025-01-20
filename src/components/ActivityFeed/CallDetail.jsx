import React, { useState } from 'react';

const CallDetail = ({ call, onArchive }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleArchiveClick = (event) => {
    event.stopPropagation();
    onArchive(call.id);
  };

  return (
    <div className="call-container">
      <div 
        className={`call-item ${call.call_type}`}
        onClick={() => setIsExpanded(!isExpanded)}
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
          onClick={handleArchiveClick}
        >
          Archive
        </button>
      </div>
      
      {isExpanded && (
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
  );
};

export default CallDetail; 