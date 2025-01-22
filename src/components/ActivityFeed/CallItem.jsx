import React, { useState } from 'react';
import { Button, Modal, Stack, CloseButton } from 'react-bootstrap';

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

  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const [isBlocked, setIsBlocked] = useState(false);

  const handleMenuOptionClick = (option, e) => {
    setShowModal(false);
    if (option === 'call') {
      console.log('Call option selected');
    } else if (option === 'block') {
      setIsBlocked(true);
    } else if (option === 'archive') {
      onArchiveToggle(call.id, e);
    }
  };

  const iconClass = isBlocked ? 'icon-red' :
    call.call_type === 'missed' ? 'icon-red' :
    call.direction === 'inbound' || call.direction === 'outbound' ? 'icon-green' : '';

  return (
    <div 
      className={`call-item ${call.call_type}`}
      onClick={onClick}
    >
      <div className="call-direction">
      <span className={`material-icons phone-icon ${iconClass}`}>
          {isBlocked ? 'block' :
            call.call_type === 'missed' ? 'phone_missed' :
            call.direction === 'inbound' ? 'call_received' : 'call_made'}
        </span>
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

        <Button 
          variant="outline-secondary"
          className="settings-button"
          onClick={handleShow}
        >
          &#x22EE;
        </Button>

        <Modal show={showModal} onHide={handleClose} centered className="modal-sm">
          <Modal.Header closeButton>
            <Modal.Title>Call Options</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Stack gap={3}>
              <Button variant="outline-success"
                onClick={() => handleMenuOptionClick('call')}
                >
                Call
              </Button>
              <Button variant="outline-danger"
                onClick={() => handleMenuOptionClick('block')}
              >
                Block
              </Button>
              <Button 
                variant={call.is_archived ? "outline-warning" : "outline-primary"}
                onClick={(e) => {
                  handleMenuOptionClick('archive', e)}}
              >
                {call.is_archived ? 'Unarchive' : 'Archive'}
              </Button>
            </Stack>
          </Modal.Body>
      </Modal>
    </div>
  );
};

export default CallItem; 