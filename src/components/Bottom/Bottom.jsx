import React from 'react';
import { Button, Stack, Badge } from 'react-bootstrap';

const Bottom = ({ inboxCallCount, onDialPadShow}) => {
  return (
    <div>
      <Stack direction="horizontal" gap={3}>
        <Button variant="primary">
          <span className="material-icons icon" aria-hidden="true">
            call
          </span> 
          <Badge bg="secondary">{inboxCallCount}</Badge>
        </Button>
        <Button variant="primary" className="ms-auto" size='lg' onClick={onDialPadShow}>
          <span className="material-icons icon" aria-hidden="true">
            dialpad
          </span>
        </Button>
        <Button variant="primary" className="ms-auto" size='lg'>
          <span className="material-icons icon" aria-hidden="true">
            settings
          </span>
        </Button>
      </Stack>
    </div>
  );
};

export default Bottom;
