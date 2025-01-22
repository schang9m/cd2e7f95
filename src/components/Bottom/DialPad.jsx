import React, { useState } from 'react';
import { Button, Modal, Stack } from 'react-bootstrap';
import '../../css/dialpad.css';

const DialPad = ({ show, onHide }) => {
  const [input, setInput] = useState(''); // State to keep track of the input

  const handleButtonClick = (value) => {
    setInput((prevInput) => prevInput + value); // Append the clicked value to the input
  };

  const handleClose = () => {
    setInput(''); // Clear the input when closing the modal
    onHide(); // Call the onHide function to close the modal
  };

  const handleCall = () => {
    console.log(`Calling: ${input}`); // Replace with actual call logic
    // Optionally clear input after calling
    setInput('');
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose} 
      centered 
    className="modal-sm"
    >
      <Modal.Header closeButton>
        <Modal.Title>{input}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack direction="vertical" gap={4}>
          <div className="dial-pad" >
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((value) => (
              <Button 
                key={value}
                className="dial-pad-button"
                onClick={() => handleButtonClick(value)}
              >
                {value}
              </Button>
            ))}
          </div>
          <Button 
            variant="success" 
            onClick={handleCall} 
            className="call-button"
          >
            <span className="material-icons" style={{ verticalAlign: 'middle' }}>
              call
            </span>
          </Button>
        </Stack>
      </Modal.Body>
    </Modal>
  );
};

export default DialPad;