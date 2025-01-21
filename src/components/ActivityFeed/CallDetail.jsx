import React from 'react';
import CallItem from './CallItem.jsx';
import '../../css/calldetail.css';

const DetailRow = ({ label, value }) => (
  <div className="detail-row">
    <span className="detail-label">{label}:</span>
    <span className="detail-value">{value}</span>
  </div>
);

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const CallDetail = ({ call, onArchiveToggle }) => {
  return (
    <div className="call-details">
      <DetailRow label="To" value={call.to} />
      <DetailRow label="Via" value={call.via} />
      <DetailRow label="Direction" value={call.direction} />
      <DetailRow label="Call Type" value={call.call_type} />
      <DetailRow label="Duration" value={formatDuration(call.duration)} />
      
      {call.repeatedCalls && call.repeatedCalls.length > 1 && (
        <div className="repeated-calls">
          <div className="repeated-calls-header">
            Previous Calls ({call.repeatedCalls.length - 1})
          </div>
          {call.repeatedCalls.slice(1).map((repeatedCall) => (
            <div key={repeatedCall.id} className="call-container">
              <CallItem 
                call={{
                  ...repeatedCall,
                  from: '',
                  call_type: ''
                }}
                onArchiveToggle={onArchiveToggle}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CallDetail; 