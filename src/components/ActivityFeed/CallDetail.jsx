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

const CallDetail = ({ call, onArchiveToggle, activeTab }) => {
  console.log('CallDetail props:', {
    activeTab,
    call,
    repeatedCalls: call.repeatedCalls,
    archivedCalls: call.repeatedCalls?.filter(call => call.is_archived),
    unarchivedCalls: call.repeatedCalls?.filter(call => !call.is_archived)
  });

  // For archive tab, show all archived calls including the first one
  const repeatedCalls = activeTab === 'archived' 
    ? null    // Don't show any repeated calls in archive tab
    : call.repeatedCalls?.slice(1).filter(call => !call.is_archived);    // Main tab: show non-archived repeated calls as before

  console.log('Filtered repeatedCalls:', repeatedCalls);

  return (
    <div className="call-details">
      <DetailRow label="To" value={call.to} />
      <DetailRow label="Via" value={call.via} />
      <DetailRow label="Direction" value={call.direction} />
      <DetailRow label="Call Type" value={call.call_type} />
      <DetailRow label="Duration" value={formatDuration(call.duration)} />
      
      {repeatedCalls?.length > 0 && (
        <div className="repeated-calls">
          <div className="repeated-calls-header">
            Previous Calls ({repeatedCalls.length})
          </div>
          {repeatedCalls.map((repeatedCall) => (
            <div key={repeatedCall.id} className="call-container">
              <CallItem 
                call={{
                  ...repeatedCall,
                  from: '',
                  call_type: repeatedCall.call_type
                }}
                onArchiveToggle={onArchiveToggle}
                activeTab={activeTab}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CallDetail; 