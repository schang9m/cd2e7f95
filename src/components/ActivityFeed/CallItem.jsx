import React, { useState } from 'react';
import incomingCall from '../../assets/incoming-call.png';
import outgoingCall from '../../assets/outgoing-call.png';
import missedCall from '../../assets/missed-call.png';
import blockedCall from '../../assets/blocked-call.png';
import '../../css/callitem.css';

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const CallItem = ({ call, onArchiveToggle, onClick, activeTab }) => {
  // Count archived or unarchived calls based on activeTab
  const repeatCount = call.repeatedCalls?.filter(
    repeatedCall => activeTab === 'archived' ? 
      repeatedCall.is_archived : 
      !repeatedCall.is_archived
  ).length;

  const [menuVisible, setMenuVisible] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const handleSettingsClick = (e) => {
    e.stopPropagation();
    setMenuVisible(!menuVisible);
  };

  const handleMenuOptionClick = (option, e) => {
    setMenuVisible(false);
    if (option === 'call') {
      console.log('Call option selected');
    } else if (option === 'block') {
      setIsBlocked(true);
    } else if (option === 'archive') {
      onArchiveToggle(call.id, e);
    }
  };

  return (
    <div 
      className={`call-item ${call.call_type}`}
      onClick={onClick}
    >
      <div className="call-direction">
        <img 
          src={
            isBlocked ? blockedCall :
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
          {repeatCount > 1 && (
            <span className="repeat-badge">
              {repeatCount}
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
          className="settings-button"
          onClick={handleSettingsClick}
        >
          &#x22EE;
        </button>
      )}
      
      {menuVisible && (
        <div className={`popup-menu ${menuVisible ? 'show' : ''}`}>
          <button 
            className="menu-button call-button"
            onClick={() => handleMenuOptionClick('call')}
          >
            Call
          </button>
          <button 
            className="menu-button block-button"
            onClick={() => handleMenuOptionClick('block')}
          >
            Block
          </button>
          <button 
            className="menu-button archive-button"
            onClick={(e) => {
              handleMenuOptionClick('archive', e)}}
          >
            {call.is_archived ? 'Unarchive' : 'Archive'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CallItem; 