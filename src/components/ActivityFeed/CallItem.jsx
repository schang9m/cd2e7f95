import React from 'react';
import incomingCall from '../../assets/incoming-call.png';
import outgoingCall from '../../assets/outgoing-call.png';
import missedCall from '../../assets/missed-call.png';

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const CallItem = ({ call, onArchiveToggle, onClick }) => (
  <div 
    className={`call-item ${call.call_type}`}
    onClick={onClick}
  >
    <div className="call-direction">
      <img 
        src={
          call.call_type === 'missed' 
            ? missedCall 
            : call.direction === 'inbound' 
              ? incomingCall 
              : outgoingCall
        } 
        alt={`${call.call_type} ${call.direction} call`}
        className="phone-icon"
      />
    </div>
    <div className="call-info">
      <div className="call-primary">
        {call.from && <span className="caller">{call.from}</span>}
        {call.repeatCount > 1 && (
          <span className="repeat-badge">
            {call.repeatCount}
          </span>
        )}
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
    {onArchiveToggle && (
      <button 
        className="archive-button"
        onClick={(e) => {
          e.stopPropagation();
          onArchiveToggle(call.id, e);
        }}
      >
        {call.is_archived ? 'Unarchive' : 'Archive'}
      </button>
    )}
  </div>
);

export default CallItem; 