import React from 'react';

const CallDetail = ({ call }) => {
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
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
  );
};

export default CallDetail; 