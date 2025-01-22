import React from 'react';
import { Button, Stack, Badge } from 'react-bootstrap';

const Bottom = ({ inboxCallCount, onDialPadShow}) => {
    // Function to scroll to the top of the container
  const scrollToTop = (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    const container = document.querySelector('.container-view'); // Replace with your actual container class or ID
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll the container to the top
    }
  };
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
        <Button variant="primary" className="ms-auto" size='lg' onClick={scrollToTop}>
          <span className="material-icons icon" aria-hidden="true">
            arrow_upward
          </span>
        </Button>
      </Stack>
    </div>
  );
};

export default Bottom;
